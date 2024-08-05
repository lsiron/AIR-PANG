import { Request, Response } from 'express';
import {
  getAllChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
} from '@_services/challengeService';
import { User } from '@_types/user'

export const getAllChallengesController = async (req: Request, res: Response) => {
  const searchQuery = req.query.search ? req.query.search.toString() : '';
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 4;
  try {
    const { challenges, total } = await getAllChallenges(searchQuery, page, limit);
    res.status(200).json({ challenges, total });
  } catch (error) {
    console.error('챌린지 데이터를 가져오는데 실패 했습니다.', error);
    res.status(500).send('서버 오류발생');
  }
};


export const getChallengeByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { challenge, tasks } = await getChallengeById(id);
    const user = req.user as User; // 현재 로그인된 사용자 정보
    res.status(200).json({ challenge, tasks, user });
  } catch (error) {
    console.error(`${id} 아이디의 챌린지 데이터를 가져오는데 실패 했습니다.:`, error);
    res.status(500).send('서버 오류발생');
  }
};

export const createChallengeController = async (req: Request, res: Response) => {
  const { title, description, start_date, end_date, tasks } = req.body;
  try { 
    const userId = (req.user as User).id; 
    if (!userId) {
      return res.status(401);
    }
    const newChallenge = await createChallenge(userId, { title, description, start_date, end_date, tasks });
    res.status(201).json(newChallenge);

  } catch (error) {
    console.error('챌린지 생성을 실패 했습니다.:', error);
    res.status(500).send('서버 오류발생');

  }
};

export const updateChallengeController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, start_date, end_date } = req.body;
  try {
    const { challenge } = await getChallengeById(id);
    if (challenge.user_id !== (req.user as User).id) {  
      return res.status(403);
    }
    const updatedChallenge = await updateChallenge(id, { title, description, start_date, end_date });
    res.status(204).json(updatedChallenge);
    
  } catch (error) {
    console.error(`${id} 아이디의 챌린지 수정을 실패 했습니다.:`, error);
    res.status(500).send('서버 오류발생');
  }
};

export const deleteChallengeController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try { 
    const { challenge } = await getChallengeById(id);
    if (challenge.user_id !== (req.user as User).id) {  // Optional Chaining 사용
      return res.status(403);
    }
    await deleteChallenge(id);
    res.status(204).send();
    
  } catch (error) {
    console.error(`${id} 아이디의 챌린지 삭제를 실패 했습니다.:`, error);
    res.status(500).send('서버 오류발생');
  }
};
