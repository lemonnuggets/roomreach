import { useMutation, useQueryClient } from "react-query";

import { QUERY_KEY } from "@/constants/queryKeys";
import { API_URL } from "@/constants/url";
import { CustomResponse } from "@/types/response";

type ApplyForDeliveryRequestResponse = CustomResponse;
type ApplyForDeliveryRequestVariables = {
  deliveryRequestId: number;
};

const apply = async ({
  deliveryRequestId,
}: ApplyForDeliveryRequestVariables): Promise<ApplyForDeliveryRequestResponse> => {
  const url = `${API_URL}/deliverer/applyForDeliveryRequest`;

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
    console.log("applyForDeliveryRequest Error: ", error);
    throw new Error("applyForDeliveryRequest failed");
  }
  if (!response.ok) {
    console.log("applyForDeliveryRequest Error: ", response);
    throw new Error("applyForDeliveryRequest failed");
  }
  const data: ApplyForDeliveryRequestResponse = await response.json();
  return data;
};

export const useApplyForDeliveryRequest = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    ApplyForDeliveryRequestResponse,
    Error,
    ApplyForDeliveryRequestVariables,
    unknown
  >({
    mutationFn: (variables) => apply(variables),
    mutationKey: [QUERY_KEY.applyForDeliveryRequest],
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.availableDeliveryRequestList);
      queryClient.invalidateQueries(QUERY_KEY.delivererDeliveryRequestList);
    },
  });
  return mutation;
};
