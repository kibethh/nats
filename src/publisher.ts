import { TicketCreatedPublisher } from "./events/ticket-created-publisher";
import nats, { Message } from "node-nats-streaming";

console.clear();
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: "abc",
      title: "concert",
      price: 20,
    });
  } catch (error) {
    console.error(error);
  }

  // console.log("Publisher connected to NATS");
  // const data = JSON.stringify({
  //   id: "123",
  //   title: "concert",
  //   price: 20,
  // });
  // stan.publish("ticket:created", data, () => {
  //   console.log("Event Published!");
  // });
});
