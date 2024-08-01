import connection from '@_config/db.config';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Task, Challenge, CreateChallengeInput, UpdateChallengeInput, mapRowToChallenge, mapRowToTask } from '@_types/challenge';

// 모든 챌린지 가져오기
export const getAllChallenges = async (searchQuery: string): Promise<Challenge[]> => {
  const query = `
    SELECT c.*, u.name AS user_name 
    FROM challenges c 
    JOIN users u ON c.user_id = u.id 
    WHERE c.title LIKE ?`;
  const [rows] = await connection.promise().query<RowDataPacket[]>(query, [`%${searchQuery}%`]);
  return rows.map(mapRowToChallenge);  // 간단하게 매핑
};

// 특정 챌린지 가져오기
export const getChallengeById = async (id: string): Promise<{ challenge: Challenge, tasks: Task[] }> => {
  const query = `
    SELECT c.*, u.name AS user_name 
    FROM challenges c 
    JOIN users u ON c.user_id = u.id 
    WHERE c.id = ?`;
  const [challengeRows] = await connection.promise().query<RowDataPacket[]>(query, [id]);

  if (challengeRows.length === 0) {
    throw new Error('챌린지가 없습니다.');
  }

  const challenge = mapRowToChallenge(challengeRows[0]);

  const [taskRows] = await connection.promise().query<RowDataPacket[]>(
    `SELECT * FROM tasks WHERE challenge_id = ?`,
    [id]
  );

  const tasks = taskRows.map(mapRowToTask);
  return { challenge, tasks };
};

// 챌린지 생성하기
export const createChallenge = async (userId: number, { title, description, start_date, end_date, tasks }: CreateChallengeInput): Promise<{ challenge: Challenge, tasks: Task[] }> => {
  const [result] = await connection.promise().query<ResultSetHeader>(
    `INSERT INTO challenges (user_id, title, description, start_date, end_date, goal, progress) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, title, description, start_date, end_date, tasks.length, 0]
  );
  const challengeId = result.insertId;

  const taskQueries = tasks.map(task =>
    connection.promise().query<ResultSetHeader>(
      `INSERT INTO tasks (challenge_id, description, is_completed) VALUES (?, ?, ?)`,
      [challengeId, task.description, task.is_completed]
    )
  );
  await Promise.all(taskQueries);

  const [createdChallengeRows] = await connection.promise().query<RowDataPacket[]>(`SELECT * FROM challenges WHERE id = ?`, [challengeId]);
  const createdChallenge = mapRowToChallenge(createdChallengeRows[0]);

  const [createdTaskRows] = await connection.promise().query<RowDataPacket[]>(`SELECT * FROM tasks WHERE challenge_id = ?`, [challengeId]);
  const createdTasks = createdTaskRows.map(mapRowToTask);

  return { challenge: createdChallenge, tasks: createdTasks };
};

// 챌린지 수정하기
export const updateChallenge = async (id: string, { title, description, start_date, end_date }: UpdateChallengeInput): Promise<Challenge> => {
  await connection.promise().query(
    `UPDATE challenges SET title = ?, description = ?, start_date = ?, end_date = ? WHERE id = ?`,
    [title, description, start_date, end_date, id]
  );

  const [updatedChallengeRows] = await connection.promise().query<RowDataPacket[]>(`SELECT * FROM challenges WHERE id = ?`, [id]);
  const updatedChallenge = mapRowToChallenge(updatedChallengeRows[0]);

  return updatedChallenge;
};

// 챌린지 삭제하기
export const deleteChallenge = async (id: string): Promise<void> => {
  // 먼저 관련된 모든 할 일 삭제
  await connection.promise().query(`DELETE FROM tasks WHERE challenge_id = ?`, [id]);

  // 챌린지 삭제
  await connection.promise().query(`DELETE FROM challenges WHERE id = ?`, [id]);
};
