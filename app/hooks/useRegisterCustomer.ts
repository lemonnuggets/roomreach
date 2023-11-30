import { useNavigation } from "@react-navigation/native";
import { useMutation } from "react-query";

import { NAVIGATION_KEY } from "@/constants/navigationKeys";
import { QUERY_KEY } from "@/constants/queryKeys";
import { ROLE } from "@/constants/roles";
import { API_URL } from "@/constants/url";
import { AuthStackNavigationProps } from "@/navigators/AuthNavigator";

type RegisterResponse = Response;
type RegisterVariables = {
  username: string;
  password: string;
  name: string;
  gender: string;
  phone: string;
  block: string;
  room: number;
};
const registerCustomer = async ({
  username,
  password,
  name,
  gender,
  phone,
  block,
  room,
}: RegisterVariables): Promise<RegisterResponse> => {
  const url = `${API_URL}/auth/register`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
        role: ROLE.CUSTOMER,
        name,
        gender,
        phone,
        block,
        room,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("Register Error: ", error);
    throw new Error("Register failed");
  }
  if (!response.ok) {
    throw new Error("Register failed");
  }
  const data: RegisterResponse = await response.json();
  return data;
};

export const useRegisterCustomer = () => {
  const navigation = useNavigation<AuthStackNavigationProps>();
  const mutation = useMutation<
    RegisterResponse,
    Error,
    RegisterVariables,
    unknown
  >({
    mutationFn: (variables) => registerCustomer(variables),
    mutationKey: [QUERY_KEY.registerCustomer],
    onSuccess: () => {
      navigation.navigate(NAVIGATION_KEY.login);
    },
  });
  return mutation;
};
