import { Router } from 'express';
import locationRouter from '@_routes/locationRouter';

const router = Router();

router.use('/locations', locationRouter);

export default router;
