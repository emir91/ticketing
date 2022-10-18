import { Schema, model } from "mongoose";

interface TicketModel {
  title: string;
  price: number;
  userId: string;
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
    },

    userId: {
      type: String,
      required: true,
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

export { Ticket };
