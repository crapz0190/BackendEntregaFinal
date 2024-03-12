import { ticketsDAO } from "../dao/tickets.dao.js";

class TicketService {
  constructor(data) {
    this.ticketService = data;
  }

  createTicket = async (obj) => {
    const tickets = await this.ticketService.createOne(obj);
    return tickets;
  };

  allPurchases = async (email) => {
    const purchases = await this.ticketService.findByEmail(email);
    return purchases;
  };
}
export const ticketService = new TicketService(ticketsDAO);
