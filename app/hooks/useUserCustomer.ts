import { useQuery } from "react-query";

import { QUERY_KEY } from "@/constants/queryKeys";
import { API_URL } from "@/constants/url";
import { CustomResponse } from "@/types/response";
import { Customer, UserAccount } from "@/types/user";

type UserCustomerResponse = CustomResponse<{
  user_account: UserAccount;
  customer: Customer;
}>;

const getUserCustomer = async (): Promise<UserCustomerResponse> => {
  const url = `${API_URL}/customer/current`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
    });
  } catch (error) {
    console.log("Get customer Error: ", error);
    throw new Error("Get customer failed");
  }
  if (!response.ok) {
    throw new Error("Get customer failed");
  }
  const data = await response.json();
  return data;
};

export const useUserCustomer = () =>
  useQuery<UserCustomerResponse, Error>(
    [QUERY_KEY.userCustomer],
    getUserCustomer,
  );
