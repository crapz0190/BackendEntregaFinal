import { ticketService } from "../tickets.service.js";

class TicketRepository {
  constructor(data) {
    this.ticketRepository = data;
  }

  createTicket = (obj) => {
    const tickets = this.ticketRepository.createTicket(obj);
    return tickets;
  };
}

export const ticketRepository = new TicketRepository(ticketService);
