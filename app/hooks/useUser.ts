import { useQuery } from "react-query";

import { QUERY_KEY } from "@/constants/queryKeys";
import { API_URL } from "@/constants/url";
import { CustomResponse } from "@/types/response";
import { UserAccount } from "@/types/user";

type UserResponse = CustomResponse<{
  user_account: UserAccount;
}>;

const getUser = async (): Promise<UserResponse> => {
  const url = `${API_URL}/auth/current`;
  console.log("url: ", url);

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
    });
  } catch (error) {
    console.log("Get user Error: ", error);
    throw new Error("Get user failed");
  }
  if (!response.ok) {
    throw new Error("Get user failed");
  }
  const data = await response.json();
  return data;
};

export const useUser = () =>
  useQuery<UserResponse, Error>([QUERY_KEY.user], getUser);
