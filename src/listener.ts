import { TicketCreatedListener } from "./events/ticket-created-listener";
import { randomBytes } from "crypto";
import nats from "node-nats-streaming";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  // setManualAckMode for reverting automatic acknowledgement of an event
  // setDeliverAllAvailable for recovering all events
  // setDurableName for processing unprocessed events
  // const options = stan
  //   .subscriptionOptions()
  //   .setManualAckMode(true)
  //   .setDeliverAllAvailable() // Getting all events emitted in the past
  //   .setDurableName("Ticketing"); //Keeping track of all events gone to a subscription
  // Queue group for preventing if we temporarily disconnect from client,
  // it will not dump the entire durable subscription,
  // Queue group will persist the subscription, for keeping track
  // const subscription = stan.subscribe(
  //   "ticket:created",
  //   "ordersListenerQueueGroup", //Q-grp for preventing accidental dumping of events
  //   options
  // );
  // subscription.on("message", (msg: Message) => {
  //   console.log("message received");

  //   const data = msg.getData();
  //   if (typeof data === "string") {
  //     console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
  //   }
  //   msg.ack();
  // });

  new TicketCreatedListener(stan).listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
