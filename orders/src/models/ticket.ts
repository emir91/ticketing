import { Schema, model } from "mongoose";

interface TicketModel {
  title: string;
  price: number;
}

const ticketSchema = new Schema<TicketModel>(
  {
    title: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

const Ticket = model<TicketModel>("Ticket", ticketSchema);

export { Ticket, TicketModel };
