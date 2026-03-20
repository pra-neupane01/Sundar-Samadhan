import api from "./api";

export const getNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data;
};

export const markNotificationAsRead = async (id) => {
  const res = await api.put(`/notifications/mark-read/${id}`);
  return res.data;
};

export const markAllNotificationsAsRead = async () => {
  const res = await api.put("/notifications/mark-all-read");
  return res.data;
};

export const deleteNotification = async (id) => {
  const res = await api.delete(`/notifications/${id}`);
  return res.data;
};
