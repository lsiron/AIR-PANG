import { RowDataPacket, ResultSetHeader } from 'mysql2';
import connection from '../config/db.config';
import { User } from '../types/user';

export class UserService {
  // 사용자 생성 또는 조회 메서드
  async findOrCreateUser(googleUser: any): Promise<User> {
    const [rows] = await connection.promise().query<RowDataPacket[]>(
      'SELECT * FROM users WHERE googleId = ?',
      [googleUser.id]
    );

    if (rows.length > 0) {
      return rows[0] as User;
    } else {
      const [result] = await connection.promise().query<ResultSetHeader>(
        'INSERT INTO users (googleId, name, email) VALUES (?, ?, ?)',
        [googleUser.id, googleUser.displayName, googleUser.emails[0].value]
      );

      const insertId = result.insertId;
      return {
        id: insertId,
        googleId: googleUser.id,
        name: googleUser.displayName,
        email: googleUser.emails[0].value,
      } as User;
    }
  }

  // 사용자 ID로 사용자 조회 메서드
  async findUserById(id: number): Promise<User | null> {
    const [rows] = await connection.promise().query<RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL',
      [id]
    );

    if (rows.length > 0) {
      return rows[0] as User;
    } else {
      return null;
    }
  }

  // 사용자 삭제 메서드
  async deleteUser(userId: number): Promise<void> {
    await connection.promise().query(
      'UPDATE users SET deleted_at = NOW() WHERE id = ?',
      [userId]
    );
  }
}
