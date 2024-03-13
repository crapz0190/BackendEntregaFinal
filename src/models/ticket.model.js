import { Schema, model } from "mongoose";

const ticketCollection = "Tickets";

const ticketSchema = new Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  purchase_datetime: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    // required: true,
  },
  idUser: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
});

export const ticketsModel = model(ticketCollection, ticketSchema);
