import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { setupSocket } from "./socket/secket.js";
import { startConsumer } from "./kafka/consumer.js";
import { getCorsOrigins, getPort } from "./config.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const corsOrigins = getCorsOrigins();
const io = new Server(server, { cors: { origin: corsOrigins, credentials: true } });

// Setup Socket.IO connections
setupSocket(io);

// Start Kafka consumer
startConsumer(io);

const PORT = getPort();
server.listen(PORT, () => console.log(`Notification service running on port ${PORT}`));
