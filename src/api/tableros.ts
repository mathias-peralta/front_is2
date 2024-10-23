import API from "@/config/API";

export const getTablerosByWorkspace = async (idEspacio: number) => {
  try {
    const tableroResponse = await API.get("/api/tableros_all/" + idEspacio);

    if (tableroResponse.status !== 200) return null;

    return tableroResponse.data;
  } catch {
    return null;
  }
};
