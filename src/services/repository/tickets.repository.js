import { ticketService } from "../tickets.service.js";

class TicketRepository {
  constructor(data) {
    this.ticketRepository = data;
  }

  allTicket = () => {
    const tickets = this.ticketRepository.allTicket();
    return tickets;
  };

  createTicket = (obj) => {
    const tickets = this.ticketRepository.createTicket(obj);
    return tickets;
  };

  allPurchases = (uid) => {
    const purchases = this.ticketRepository.allPurchases(uid);
    return purchases;
  };
}

export const ticketRepository = new TicketRepository(ticketService);
