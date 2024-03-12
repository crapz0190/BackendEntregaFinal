import CustomError from "../errors/errors.generator.js";
import { ErrorsMessages, ErrorsNames } from "../errors/errors.messages.js";

export default class BasicDAO {
  constructor(model, populateProps) {
    this.model = model;
    this.populateProps = populateProps;
  }
  async getAll() {
    try {
      const response = await this.model.find();
      return response;
    } catch (error) {
      CustomError.generateError(
        ErrorsMessages.INTERNAL_SERVER_ERROR,
        ErrorsNames.CODE_ERROR,
        500,
      );
    }
  }
  async getById(id) {
    try {
      const response = await this.model
        .findById(id)
        .populate(this.populateProps);

      return response;
    } catch (error) {
      CustomError.generateError(
        ErrorsMessages.INTERNAL_SERVER_ERROR,
        ErrorsNames.CODE_ERROR,
        500,
      );
    }
  }
  async createOne(obj) {
    try {
      const response = await this.model.create(obj);

      return response;
    } catch (error) {
      CustomError.generateError(
        ErrorsMessages.INTERNAL_SERVER_ERROR,
        ErrorsNames.CODE_ERROR,
        500,
      );
    }
  }
  async updateOne(id, obj) {
    try {
      const response = await this.model.findByIdAndUpdate(id, obj);
      return response;
    } catch (error) {
      CustomError.generateError(
        ErrorsMessages.INTERNAL_SERVER_ERROR,
        ErrorsNames.CODE_ERROR,
        500,
      );
    }
  }
  async deleteOne(id) {
    try {
      const response = await this.model.findByIdAndDelete(id);
      return response;
    } catch (error) {
      CustomError.generateError(
        ErrorsMessages.INTERNAL_SERVER_ERROR,
        ErrorsNames.CODE_ERROR,
        500,
      );
    }
  }
  async deleteMany(id) {
    try {
      const response = await this.model.deleteMany(id);
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
