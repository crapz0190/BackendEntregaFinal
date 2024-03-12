import { userService } from "../users.service.js";

class UserRepository {
  constructor(data) {
    this.userRepository = data;
  }

  saveDocuments = async (uid, obj) => {
    const users = await this.userRepository.saveDocuments(uid, obj);
    return users;
  };

  findAll = async () => {
    const users = await this.userRepository.findAll();
    return users;
  };

  findToken = (obj) => {
    const users = this.userRepository.findToken(obj);
    return users;
  };

  createOne = (obj) => {
    const users = this.userRepository.createOne(obj);
    return users;
  };

  findByEmail = (email) => {
    const users = this.userRepository.findByEmail(email);
    return users;
  };

  findById = (uid) => {
    const users = this.userRepository.findById(uid);
    return users;
  };

  deleteOne = async (uid) => {
    const users = await this.userRepository.deleteOne(uid);
    return users;
  };

  deleteMany = async (uid) => {
    const users = await this.userRepository.deleteMany(uid);
    return users;
  };
}

export const userRepository = new UserRepository(userService);
