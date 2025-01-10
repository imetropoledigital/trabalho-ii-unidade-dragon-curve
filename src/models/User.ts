import mongoose, { Schema } from "mongoose";

/**
* Criação do schema do banco, onde poderá ser cadastrado o nome e a idade.
*/

const schema = new mongoose.Schema({
  name: String,
  age: Number
});

const User = mongoose.model('User', schema);

export default User;