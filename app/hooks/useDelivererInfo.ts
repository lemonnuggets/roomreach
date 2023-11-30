import { useQuery } from "react-query";

import { QUERY_KEY } from "@/constants/queryKeys";
import { API_URL } from "@/constants/url";
import { DataResponse } from "@/types/response";
import { Deliverer } from "@/types/user";

type DelivererInfoResponse = DataResponse<Deliverer>;

const getDelivererInfo = async (
  delivererId: number,
): Promise<DelivererInfoResponse> => {
  const url = `${API_URL}/customer/deliverer?deliverer_id=${delivererId}`;
  console.log("Get deliverer url: ", url);

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
    console.log("Get deliverer response: ", response);
    throw new Error("Get deliverer failed");
  }
  const data = await response.json();
  console.log("Get deliverer data: ", data);
  return data;
};

export const useDelivererInfo = (
  delivererId: number | null,
  enabled: boolean,
) =>
  useQuery({
    queryFn: () => getDelivererInfo(delivererId!),
    queryKey: [QUERY_KEY.delivererInfo, delivererId],
    enabled: enabled && delivererId !== null,
  });
