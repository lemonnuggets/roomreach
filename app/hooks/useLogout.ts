import { useMutation, useQueryClient } from "react-query";

import { QUERY_KEY } from "@/constants/queryKeys";
import { API_URL } from "@/constants/url";
import { CustomResponse } from "@/types/response";

type LogoutResponse = CustomResponse;

const logout = async (): Promise<LogoutResponse> => {
  const url = `${API_URL}/auth/logout`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
    });
  } catch (error) {
    console.log("Logout Error: ", error);
    throw new Error("Logout failed");
  }
  if (!response.ok) {
    throw new Error("Logout failed");
  }
  const data: LogoutResponse = await response.json();
  return data;
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<LogoutResponse, Error, void, unknown>({
    mutationFn: () => logout(),
    mutationKey: [QUERY_KEY.logout],
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
  return mutation;
};
