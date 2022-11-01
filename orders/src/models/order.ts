import { Schema, model } from "mongoose";
import { OrderStatus } from "@emir-tickets/common";
import { TicketModel } from "./ticket";

interface OrderModel {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketModel;
}

const orderSchema = new Schema<OrderModel>(
  {
    userId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
    },

    expiresAt: {
      type: Schema.Types.Date,
    },

    ticket: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
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

const Order = model<OrderModel>("Order", orderSchema);

export { Order };
