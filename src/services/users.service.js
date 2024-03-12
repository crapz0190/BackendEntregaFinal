import { usersDAO } from "../dao/users.dao.js";

class UserService {
  constructor(data) {
    this.userService = data;
  }

  saveDocuments = async (uid, obj) => {
    const users = await this.userService.updateOne(uid, obj);
    return users;
  };

  findAll = async () => {
    const users = await this.userService.getAll();
    return users;
  };

  findToken = async (obj) => {
    const users = await this.userService.findToken(obj);
    return users;
  };

  createOne = async (obj) => {
    const users = await this.userService.createOne(obj);
    return users;
  };

  findByEmail = async (email) => {
    const users = await this.userService.findByEmail(email);
    return users;
  };

  findById = async (uid) => {
    const users = await this.userService.getById(uid);
    return users;
  };

  deleteOne = async (uid) => {
    const users = await this.userService.deleteOne(uid);
    return users;
  };

  deleteMany = async (uid) => {
    const users = await this.userService.deleteMany(uid);
    return users;
  };
}
export const userService = new UserService(usersDAO);
