import { useQuery } from "react-query";

import { QUERY_KEY } from "@/constants/queryKeys";
import { API_URL } from "@/constants/url";
import { DelivererDeliveryRequestsListItem } from "@/types/deliveryRequest";
import { DataResponse } from "@/types/response";

type DelivererDeliveryRequestsResponseListItem = {
  id: number;
  pickup_location: string;
  status: number;
};
type DelivererDeliveryRequestsResponse = DataResponse<
  DelivererDeliveryRequestsListItem[]
>;

const getDelivererDeliveryRequests =
  async (): Promise<DelivererDeliveryRequestsResponse> => {
    const url = `${API_URL}/deliverer/deliveryRequests`;

    let response: Response;
    try {
      response = await fetch(url, {
        method: "GET",
      });
    } catch (error) {
      console.log("GetDelivererDeliveryRequests Error: ", error);
      throw new Error("GetDelivererDeliveryRequests failed");
    }
    if (!response.ok) {
      throw new Error("GetDelivererDeliveryRequests failed");
    }
    const data: DataResponse<
      DelivererDeliveryRequestsResponseListItem[] | null
    > = await response.json();
    return {
      message: data.message,
      data:
        data.data === null
          ? []
          : data.data.map(
              (item) =>
                ({
                  id: item.id,
                  pickupLocation: item.pickup_location,
                  status: item.status,
                }) as DelivererDeliveryRequestsListItem,
            ),
    };
  };

export const useDelivererDeliveryRequests = () =>
  useQuery(
    QUERY_KEY.delivererDeliveryRequestList,
    getDelivererDeliveryRequests,
  );
