import { messagesDAO } from "../dao/messages.dao.js";

class MessageService {
  constructor(data) {
    this.messageService = data;
  }

  findAll = async () => {
    const messages = await this.messageService.findAll();
    return messages;
  };

  findById = async (mid) => {
    const messages = await this.messageService.getById(mid);
    return messages;
  };

  createOne = async (obj) => {
    const messages = await this.messageService.createOne(obj);
    return messages;
  };

  updateOne = async (mid, obj) => {
    const messages = await this.messageService.updateOne(mid, obj);
    return messages;
  };

  deleteOne = async (mid) => {
    const messages = await this.messageService.deleteOne(mid);
    return messages;
  };
}
export const messageService = new MessageService(messagesDAO);
