export const getBackendUrl = () =>
  process.env.BACKEND_URL || "http://localhost:4000";

export const getKafkaBrokers = () =>
  (process.env.KAFKA_BROKERS || "localhost:9092")
    .split(",")
    .map((broker) => broker.trim())
    .filter(Boolean);

export const getCorsOrigins = () =>
  (process.env.CORS_ORIGINS || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

export const getPort = () => Number(process.env.PORT || 8080);
