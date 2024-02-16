import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    id: String,
    name: String,
    description: String,
    price: Number,
    image: String,
})

export default  mongoose.model('ProductSchema', productSchema)