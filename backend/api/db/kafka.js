import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "video-service",
  brokers: (process.env.KAFKA_BROKERS || "localhost:9092")
    .split(",")
    .map((broker) => broker.trim())
    .filter(Boolean),
});
