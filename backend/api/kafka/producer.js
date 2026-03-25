import { kafka } from "../db/kafka.js";

export const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log("Kafka Producer connected");
};