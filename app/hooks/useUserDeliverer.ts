import { useQuery } from "react-query";

import { QUERY_KEY } from "@/constants/queryKeys";
import { API_URL } from "@/constants/url";
import { CustomResponse } from "@/types/response";
import { Customer, UserAccount } from "@/types/user";

type UserDelivererResponse = CustomResponse<{
  user_account: UserAccount;
  customer: Customer;
}>;

const getUserDeliverer = async (): Promise<UserDelivererResponse> => {
  const url = `${API_URL}/deliverer/current`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
    });
  } catch (error) {
    console.log("Get deliverer Error: ", error);
    throw new Error("Get deliverer failed");
  }
  if (!response.ok) {
    throw new Error("Get deliverer failed");
  }
  const data = await response.json();
  return data;
};

export const useDelivererUser = () =>
  useQuery<UserDelivererResponse, Error>(
    [QUERY_KEY.userDeliverer],
    getUserDeliverer,
  );
