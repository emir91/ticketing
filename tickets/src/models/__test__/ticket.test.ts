import { Ticket } from "../ticket";

describe("Ticket model test suite", () => {
  test("implementation of optimistic concurrency control", async () => {
    // create an instance od a ticket
    const ticket = Ticket.build({
      title: "test ticket",
      price: 20,
      userId: "12hjhkk45op",
    });
    // save the ticket to the database
    await ticket.save();
    // fetch the ticket twice
    const fetchedTicket1 = await Ticket.findById(ticket.id);
    const fetchedTicket2 = await Ticket.findById(ticket.id);
    // make two separate changes to the tickets we fetched
    fetchedTicket1!.set({ price: 10 });
    fetchedTicket2!.set({ price: 30 });
    // save the first fetched ticket
    await fetchedTicket1!.save();
    // save the second fetched ticket and expect error
    try {
      await fetchedTicket2!.save();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test("successful update of version", async () => {
    const ticket = Ticket.build({
      title: "test ticket",
      price: 20,
      userId: "12hjhkk45op",
    });
    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);
  });
});
