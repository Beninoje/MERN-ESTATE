import express from 'express';
import { test, updateUser, deleteUser, getUserListings, getUser, addToFavourites, getUserFavourites } from '../controllers/user.controller.js';
import { verifyUser } from '../utils/verifyUser.js';
const router = express.Router();

router.get('/test',test);

router.post('/update/:id', verifyUser, updateUser);

router.post('/:userId/favourites/:listingId', verifyUser, addToFavourites);

router.get('/:userId/favourites', verifyUser, getUserFavourites);

router.delete('/delete/:id', verifyUser, deleteUser);

router.get('/listings/:id', verifyUser, getUserListings);

router.get('/:id',verifyUser, getUser);

export default router