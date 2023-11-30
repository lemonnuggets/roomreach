import { useMutation, useQueryClient } from "react-query";

import { QUERY_KEY } from "@/constants/queryKeys";
import { API_URL } from "@/constants/url";
import { DataResponse } from "@/types/response";

type CreateDeliveryResponse = DataResponse<string>;
type CreateDeliveryVariables = {
  pickupLocation: string;
  deliveryInstructions: string;
};

const createDeliveryRequest = async ({
  pickupLocation,
  deliveryInstructions,
}: CreateDeliveryVariables): Promise<CreateDeliveryResponse> => {
  const url = `${API_URL}/customer/deliveryRequest`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify({
        pickup_location: pickupLocation,
        delivery_instructions: deliveryInstructions,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("CreateDelivery Error: ", error);
    throw new Error("CreateDelivery failed");
  }
  if (!response.ok) {
    throw new Error("CreateDelivery failed");
  }
  const data: CreateDeliveryResponse = await response.json();
  return data;
};

export const useCreateDeliveryRequest = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    CreateDeliveryResponse,
    Error,
    CreateDeliveryVariables,
    unknown
  >({
    mutationFn: (variables) => createDeliveryRequest(variables),
    mutationKey: [QUERY_KEY.createDeliveryRequest],
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.customerDeliveryRequestList);
    },
  });
  return mutation;
};
