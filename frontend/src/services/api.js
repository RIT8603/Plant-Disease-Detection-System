import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 30000
});

export async function predictDisease(file) {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await api.post("/predict", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return data;
}

export async function checkApiHealth() {
  const { data } = await api.get("/health");
  return data;
}
