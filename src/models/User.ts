import mongoose, { Schema } from "mongoose";

const schema = new Schema({
  name: String,
  age: Number
});

const User = mongoose.model('User', schema);

export default User;