import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from "../utils/error.js";
import Listing from '../models/listing.model.js';

export const test =(req,res)=>{
    res.json({
        message: "API World!",
    });
}
export const updateUser = async (req,res,next)=>{
    if(req.user.id !== req.params.id)
    {
        return next(errorHandler(401, "You can only update your own account"));
    }
    try {
       if(req.body.password)
       {
        req.body.password = bcryptjs.hashSync(req.body.password,10);
       } 
       const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set:{
               username: req.body.username,
               email: req.body.email,
               password: req.body.password,
               fullName: req.body.fullName,
               postalCode: req.body.postalCode,
               address: req.body.address,
               country: req.body.country,
               avatar: req.body.avatar, 
            }
       },{new:true})

       const {password, ...rest} = updatedUser._doc

       res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}
export const deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.id){
        return next(errorHandler(401, "You can only delete your own account"));
    }
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200)
        .json('User have been deleted!')
    } catch (error) {
        next(error)
    }
}
export const getUserListings = async (req, res, next) => {
    
    if(req.user.id === req.params.id)
    {
        try {
            const listings = await Listing.find({userRef: req.params.id});
            res.status(200).json(listings);
        } catch (error) {
            next(error);
        }
    }else{
        return next(errorHandler(401, 'Your can only view your own listings'));
    }
    
};
export const getUser = async (req, res, next) => {
    try {
      
      const user = await User.findById(req.params.id);
    
      if (!user) return next(errorHandler(404, 'User not found!'));
    
      const { password: pass, ...rest } = user._doc;
    
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
};

export const addToFavourites = async (req, res, next) => {
    try {
        const {userId, listingId} = req.params;
        const user = await User.findById(userId);
        if(!user)
        {
            return next(errorHandler(404, 'User no found!'));
        }

        if(user.favorites.includes(listingId))
        {
            return res.status(400).json({message: 'Listing is already added to favourites'})
        }
        user.favorites.push(listingId);
        await user.save();
    } catch (error) {
        next(error);
    }
};

export const removeFromFavourites = async (req, res, next) => {
    try {
        const {userId, listingId} = req.params;
        const user = await User.findByIdAndUpdate(userId, {
            $pull: { favorites: listingId }
        });
    
        if(!user)
        {
            return next(errorHandler(404, 'User no found!'));
        }

        if(!user.favorites.includes(listingId))
        {
            return res.status(400).json({message: 'Listing is not in favourites'})
        }
        await user.save();
        res.status(200).json({message: 'Listing has been removed from favourites'})
    } catch (error) {
        next(error);
    }
};
export const getUserFavourites = async (req, res, next) => {
    try {
        const userId = req.params.userId; 
        
        if (req.user.id !== userId) {
            return next(errorHandler(401, 'You can only view your own favourites'));
        }

        const user = await User.findById(userId);

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        const favouriteListingIds = user.favorites;

        const favouriteListings = await Listing.find({
            _id: {
                $in: favouriteListingIds
            }
        });

        res.status(200).json(favouriteListings);
    } catch (error) {
        next(error);
    }
};
