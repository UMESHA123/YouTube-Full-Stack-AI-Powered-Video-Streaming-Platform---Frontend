import { Kafka } from "kafkajs";
import axios from "axios";
import { insertNotification } from "../utils/index.js";
import { getBackendUrl, getKafkaBrokers } from "../config.js";

const kafka = new Kafka({
  clientId: "notification-service",
  brokers: getKafkaBrokers(),
});

const consumer = kafka.consumer({ groupId: "video-notify-group" });

export const startConsumer = async (io) => {
  const backendBaseUrl = getBackendUrl();

  await consumer.connect();
  await consumer.subscribe({ topic: "video.uploaded", fromBeginning: false });
  await consumer.subscribe({ topic: "stream.started", fromBeginning: false });

  console.log("Kafka consumer connected & subscribed to topic");

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const event = JSON.parse(message.value.toString());
        console.log(
          "#########################################################"
        );
        console.log("Received event:", event);
        console.log(
          "#########################################################"
        );

        const { eventType, channelId, token } = event;
        if (!channelId || !token) return;

        // 🔹 Fetch subscribers using your endpoint
        const response = await axios.get(
          `${backendBaseUrl}/api/v1/subscriptions/${channelId}/c/subscribers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("list of subscribers:", response.data);

        const subscribers = response.data?.data?.subscribers || [];

        for (const sub of subscribers) {
          try {
            if (eventType === "VIDEO_UPLOADED") {
              const { videoId } = event;
              await insertNotification(
                {
                  user: sub._id,
                  type: "VIDEO_UPLOADED",
                  video: videoId,
                  channel: channelId,
                },
                token
              );

              io.to(sub._id.toString()).emit("new-video", {
                user: sub._id,
                type: "VIDEO_UPLOADED",
                video: videoId,
                channel: channelId,
              });
            }

            if (eventType === "LIVE_STREAM_STARTED") {
              const { streamTitle, streamUrl, videoId } = event;
              await insertNotification(
                {
                  user: sub._id,
                  type: "LIVE_STREAM_STARTED",
                  video: videoId,
                  channel: channelId,
                  streamTitle,
                  streamUrl,
                },
                token
              );

              io.to(sub._id.toString()).emit("live-stream-started", {
                user: sub._id,
                type: "LIVE_STREAM_STARTED",
                video: videoId,
                channel: channelId,
                streamTitle,
                streamUrl: streamUrl || "",
              });
            }
          } catch (err) {
            console.error(`Failed notification for user ${sub._id}:`, err.message);
          }
        }

        console.log(
          `Sent ${eventType} notifications to ${subscribers.length} subscribers of channel ${channelId}`
        );
      } catch (err) {
        console.error("Error in consumer:", err.message);
      }
    },
  });
};
