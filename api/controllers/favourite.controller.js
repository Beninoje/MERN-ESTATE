import Favorite from "../models/favourite.model.js";
import { errorHandler } from "../utils/error.js";

export const addFavourite = async (req,res,next) => {
    try {
        const favourite = await Favorite.create(req.body);
        return res.status(201).json(favourite);
    } catch (error) {
        next(error);
    }
}

export const getFavourite = async (req, res, next) => {
    try {
        const favourite = await Favorite.findById(req.params.id);
        if(!favourite)
        {
            return next(errorHandler(404, 'Favourite not found'));
        }
        res
    .status(200)
    .json(listing);
    }
    catch (error) {
        next(error);
    }
} 

export const removeFavourite = async (req, res, next) => {
    const favourite = await Favorite.findById(req.params.id);
    if(!favourite)
    {
        return next(errorHandler(404, 'Listing not found'));
    }
    if(req.user.id !== favourite.user){
        return next(errorHandler(401, "You can only remove your own listings"));
    }
    try {
        await Favorite.findByIdAndDelete(req.params.id)
        res.status(200)
        .json('Listing has been removed from favourites!')
    } catch (error) {
        next(error);
    }
}






