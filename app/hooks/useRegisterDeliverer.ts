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
};
const registerDeliverer = async ({
  username,
  password,
  name,
  gender,
  phone,
}: RegisterVariables): Promise<RegisterResponse> => {
  const url = `${API_URL}/auth/register`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
        role: ROLE.DELIVERER,
        name,
        gender,
        phone,
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

export const useRegisterDeliverer = () => {
  const navigation = useNavigation<AuthStackNavigationProps>();
  const mutation = useMutation<
    RegisterResponse,
    Error,
    RegisterVariables,
    unknown
  >({
    mutationFn: (variables) => registerDeliverer(variables),
    mutationKey: [QUERY_KEY.registerDeliverer],
    onSuccess: () => {
      navigation.navigate(NAVIGATION_KEY.login);
    },
  });
  return mutation;
};
