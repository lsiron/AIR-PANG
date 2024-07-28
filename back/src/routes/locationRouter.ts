import { Router } from 'express';
import { getLocationDataController, getMonthlyDataController } from '../controllers/locationController';

const router = Router();

router.get('/:location', getLocationDataController);
router.get('/:location/:subLocation', getMonthlyDataController);

export default router;
