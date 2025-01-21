import express from 'express';
import { executeCustomQuery } from '../Controlers/queryController.js';
import  chatcontroller  from '../Controlers/Chat.Controllers.js';



const router = express.Router();

router.post('/query', executeCustomQuery);
router.post('/ask', executeCustomQuery,chatcontroller);





export default router;

