import { RowDataPacket, ResultSetHeader } from 'mysql2';
import connection from '@_config/db.config';
import { User } from '@_types/user';

export class UserService {

  async findOrCreateUser(googleUser: any): Promise<User> {
    try {
      // 구글 아이디로 사용자 검색
      const [existingUserRows] = await connection.promise().query<RowDataPacket[]>(
        'SELECT * FROM users WHERE googleId = ?',
        [googleUser.id]
      );

      if (existingUserRows.length > 0) {
        // 사용자 존재 시 반환
        return existingUserRows[0] as User;
      } else {
        // 새로운 사용자 생성
        const [result] = await connection.promise().query<ResultSetHeader>(
          'INSERT INTO users (googleId, name) VALUES (?, ?)',
          [googleUser.id, googleUser.displayName]
        );

        const insertId = result.insertId;
        return {
          id: insertId,
          googleId: googleUser.id,
          name: googleUser.displayName,
        } as User;
      }
    } catch (error) {
      console.error('Error in findOrCreateUser:', error);
      throw error; // 오류를 상위 호출로 전파
    }
  }

  async findUserById(id: number): Promise<User | null> {
    try {
      const [rows] = await connection.promise().query<RowDataPacket[]>(
        'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL',
        [id]
      );

      if (rows.length > 0) {
        return rows[0] as User;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error in findUserById:', error);
      throw error; // 오류를 상위 호출로 전파
    }
  }

  async deleteUser(userId: number): Promise<void> {
    try {
      await connection.promise().query(
        'UPDATE users SET deleted_at = NOW() WHERE id = ?',
        [userId]
      );
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  }
}
