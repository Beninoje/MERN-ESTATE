import express from 'express';
import { getFavourite, removeFavourite, addFavourite } from '../controllers/favourite.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/add/:id', verifyUser, addFavourite);

router.get('/:id', verifyUser, getFavourite);

router.delete('/delete/:id', verifyUser, removeFavourite);

export default router;