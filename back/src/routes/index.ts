import { Router } from 'express';
import locationRouter from './locationRouter';

const router = Router();

router.use('/locations', locationRouter);

export default router;
