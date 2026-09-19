import axios from "axios";

export type LoginData = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: {
    id: number;
    name: string;
    email: string;
  };
  token: string;
};

export const login = async (data: LoginData): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    "http://localhost:8000/api/login",
    data,
  );

  return response.data;
};
