import { Schema, model } from "mongoose";
import { Order, OrderStatus } from "../models/order";
interface TicketModel {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
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

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
        OrderStatus.Created,
      ],
    },
  });

  return !!existingOrder;
};

export { Ticket, TicketModel };
