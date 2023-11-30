import { useMutation, useQueryClient } from "react-query";

import { QUERY_KEY } from "@/constants/queryKeys";
import { API_URL } from "@/constants/url";
import { CustomResponse } from "@/types/response";

type PickupDeliveryRequestResponse = CustomResponse;
type PickupDeliveryRequestVariables = {
  deliveryRequestId: number;
};

const pickup = async ({
  deliveryRequestId,
}: PickupDeliveryRequestVariables): Promise<PickupDeliveryRequestResponse> => {
  const url = `${API_URL}/deliverer/pickupDeliveryRequest`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify({
        delivery_request_id: deliveryRequestId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("pickupDeliveryRequest Error: ", error);
    throw new Error("pickupDeliveryRequest failed");
  }
  if (!response.ok) {
    console.log("pickupDeliveryRequest Error: ", response);
    throw new Error("pickupDeliveryRequest failed");
  }
  const data: PickupDeliveryRequestResponse = await response.json();
  return data;
};

export const usePickupDeliveryRequest = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    PickupDeliveryRequestResponse,
    Error,
    PickupDeliveryRequestVariables,
    unknown
  >({
    mutationFn: (variables) => pickup(variables),
    mutationKey: [QUERY_KEY.pickupDeliveryRequest],
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.delivererDeliveryRequestList);
    },
  });
  return mutation;
};
