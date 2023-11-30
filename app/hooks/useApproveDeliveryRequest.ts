import { useMutation, useQueryClient } from "react-query";

import { QUERY_KEY } from "@/constants/queryKeys";
import { API_URL } from "@/constants/url";
import { CustomResponse } from "@/types/response";

type ApproveDeliveryRequestResponse = CustomResponse;
type ApproveDeliveryRequestVariables = {
  deliveryRequestId: number;
  approved: boolean;
};

const approve = async ({
  deliveryRequestId,
  approved,
}: ApproveDeliveryRequestVariables): Promise<ApproveDeliveryRequestResponse> => {
  const url = `${API_URL}/customer/approveDeliveryRequest`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify({
        delivery_request_id: deliveryRequestId,
        approved,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("approveDeliveryRequest Error: ", error);
    throw new Error("approveDeliveryRequest failed");
  }
  if (!response.ok) {
    console.log("approveDeliveryRequest Error: ", response);
    throw new Error("approveDeliveryRequest failed");
  }
  const data: ApproveDeliveryRequestResponse = await response.json();
  return data;
};

export const useApproveDeliveryRequest = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    ApproveDeliveryRequestResponse,
    Error,
    ApproveDeliveryRequestVariables,
    unknown
  >({
    mutationFn: (variables) => approve(variables),
    mutationKey: [QUERY_KEY.approveDeliveryRequest],
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.customerDeliveryRequestList);
    },
  });
  return mutation;
};
