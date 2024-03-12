import { ticketService } from "../tickets.service.js";

class TicketRepository {
  constructor(data) {
    this.ticketRepository = data;
  }

  createTicket = (obj) => {
    const tickets = this.ticketRepository.createTicket(obj);
    return tickets;
  };

  allPurchases = (email) => {
    const purchases = this.ticketRepository.allPurchases(email);
    return purchases;
  };
}

export const ticketRepository = new TicketRepository(ticketService);
