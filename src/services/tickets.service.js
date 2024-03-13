import { ticketsDAO } from "../dao/tickets.dao.js";

class TicketService {
  constructor(data) {
    this.ticketService = data;
  }

  allTicket = async () => {
    const tickets = await this.ticketService.getAll();
    return tickets;
  };

  createTicket = async (obj) => {
    const tickets = await this.ticketService.createOne(obj);
    return tickets;
  };

  allPurchases = async (uid) => {
    const purchases = await this.ticketService.findByIdTicket(uid);
    return purchases;
  };
}
export const ticketService = new TicketService(ticketsDAO);
