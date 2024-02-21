import { ticketsModel } from "../models/ticket.model.js";
import BasicDAO from "./basic.dao.js";
import CustomError from "../errors/errors.generator.js";
import { ErrorsMessages, ErrorsNames } from "../errors/errors.messages.js";

class TicketDAO extends BasicDAO {
  constructor() {
    super(ticketsModel);
  }

  async findByEmail(email) {
    try {
      const response = await usersModel.findOne({ email });
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

export const ticketsDAO = new TicketDAO();
