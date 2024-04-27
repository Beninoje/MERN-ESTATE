import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }

},{timestamps:true});

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;