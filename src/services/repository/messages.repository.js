import { messageService } from "../messages.service.js";

class MessageRepository {
  constructor(data) {
    this.messageRepository = data;
  }

  findAll = () => {
    const messages = this.messageRepository.findAll();
    return messages;
  };

  findById = (mid) => {
    const messages = this.messageRepository.findById(mid);
    return messages;
  };

  createOne = (obj) => {
    const messages = this.messageRepository.createOne(obj);
    return messages;
  };

  updateOne = (mid, obj) => {
    const messages = this.messageRepository.updateOne(mid, obj);
    return messages;
  };

  deleteOne = (mid) => {
    const messages = this.messageRepository.deleteOne(mid);
    return messages;
  };
}

export const messageRepository = new MessageRepository(messageService);
