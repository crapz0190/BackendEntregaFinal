import { usersModel } from "../models/users.model.js";
import BasicDAO from "./basic.dao.js";
import CustomError from "../errors/errors.generator.js";
import { ErrorsMessages, ErrorsNames } from "../errors/errors.messages.js";

class UserDAO extends BasicDAO {
  constructor() {
    super(usersModel);
  }

  async findByEmail(email) {
    try {
      const response = await usersModel.findOne(email);
      return response;
    } catch (error) {
      CustomError.generateError(
        ErrorsMessages.INTERNAL_SERVER_ERROR,
        ErrorsNames.CODE_ERROR,
        500,
      );
    }
  }

  async findToken(obj) {
    try {
      const response = await usersModel.findOne(obj);
      return response;
    } catch (error) {
      CustomError.generateError(
        ErrorsMessages.INTERNAL_SERVER_ERROR,
        ErrorsNames.CODE_ERROR,
        500,
      );
    }
  }
}

export const usersDAO = new UserDAO();
