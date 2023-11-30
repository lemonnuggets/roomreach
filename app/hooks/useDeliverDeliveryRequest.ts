import { useMutation, useQueryClient } from "react-query";

import { QUERY_KEY } from "@/constants/queryKeys";
import { API_URL } from "@/constants/url";
import { CustomResponse } from "@/types/response";

type DeliverDeliveryRequestResponse = CustomResponse;
type DeliverDeliveryRequestVariables = {
  deliveryRequestId: number;
};

const deliver = async ({
  deliveryRequestId,
}: DeliverDeliveryRequestVariables): Promise<DeliverDeliveryRequestResponse> => {
  const url = `${API_URL}/deliverer/deliverDeliveryRequest`;

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
    console.log("deliverDeliveryRequest Error: ", error);
    throw new Error("deliverDeliveryRequest failed");
  }
  if (!response.ok) {
    console.log("deliverDeliveryRequest Error: ", response);
    throw new Error("deliverDeliveryRequest failed");
  }
  const data: DeliverDeliveryRequestResponse = await response.json();
  return data;
};

export const useDeliverDeliveryRequest = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    DeliverDeliveryRequestResponse,
    Error,
    DeliverDeliveryRequestVariables,
    unknown
  >({
    mutationFn: (variables) => deliver(variables),
    mutationKey: [QUERY_KEY.deliverDeliveryRequest],
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.delivererDeliveryRequestList);
    },
  });
  return mutation;
};
