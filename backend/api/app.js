import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const allowedOrigins = ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3000', "http://localhost:5173", "http://192.168.1.21:3001", "http://0.0.0.0:3000"];
app.use(cors({
    origin: [`https://youtube-next.onrender.com`, 'http://localhost:4000', "http://localhost:8000"],
    credentials: true
}))

// const allowedOrigins = (
//   process.env.ALLOWED_ORIGINS ||
//   "https://youtube-next.onrender.com,http://localhost:3000"
// )
//   .split(",")
//   .map((origin) => origin.trim())
//   .filter(Boolean);

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },

//     credentials: true,
//   })
// );

app.set("trust proxy", 1);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

connectProducer();

//routes import
import userRouter from "./routes/user.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import notificationRoute from "./routes/notification.routes.js";
import protectedRoute from "./routes/protectedRoute.routes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import { connectProducer } from "./kafka/producer.js";

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/notifications", notificationRoute);
app.use("/api/v1/user-auth", protectedRoute);

app.use(errorHandler);

export { app };
