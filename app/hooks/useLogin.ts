import { useMutation, useQueryClient } from "react-query";

import { QUERY_KEY } from "@/constants/queryKeys";
import { API_URL } from "@/constants/url";
import { CustomResponse } from "@/types/response";

type LoginResponse = CustomResponse<{ role: number }>;
type LoginVariables = {
  username: string;
  password: string;
};

const login = async ({
  username,
  password,
}: LoginVariables): Promise<LoginResponse> => {
  const url = `${API_URL}/auth/login`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("Login Error: ", error);
    throw new Error("Login failed");
  }
  if (!response.ok) {
    throw new Error("Login failed");
  }
  const data: LoginResponse = await response.json();
  return data;
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<LoginResponse, Error, LoginVariables, unknown>({
    mutationFn: (variables) => login(variables),
    mutationKey: [QUERY_KEY.login],
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
  return mutation;
};
