import axios from "axios";
import { getBackendUrl } from "../config.js";

export const insertNotification = async (notificationData, token) => {
  try {
    const backendBaseUrl = getBackendUrl();
    const notification = await axios.post(`${backendBaseUrl}/api/v1/notifications/create`, notificationData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
    return notification;
  } catch (error) {
    console.error("Error inserting notification:", error);
    throw error;
  }
};
