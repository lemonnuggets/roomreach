import { useQuery } from "react-query";

import { QUERY_KEY } from "@/constants/queryKeys";
import { API_URL } from "@/constants/url";
import { AvailableDeliveryRequestsListItem } from "@/types/deliveryRequest";
import { DataResponse } from "@/types/response";

type AvailableDeliveryRequestsResponseListItem = {
  id: number;
  pickup_location: string;
  dropoff_block: string;
};
type AvailableDeliveryRequestsResponse = DataResponse<
  AvailableDeliveryRequestsListItem[]
>;

const getAvailableDeliveryRequests =
  async (): Promise<AvailableDeliveryRequestsResponse> => {
    const url = `${API_URL}/deliverer/availableRequests`;

    let response: Response;
    try {
      response = await fetch(url, {
        method: "GET",
      });
    } catch (error) {
      console.log("GetAvailableDeliveryRequests Error: ", error);
      throw new Error("GetAvailableDeliveryRequests failed");
    }
    if (!response.ok) {
      throw new Error("GetAvailableDeliveryRequests failed");
    }
    const data: DataResponse<
      AvailableDeliveryRequestsResponseListItem[] | null
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
                  block: item.dropoff_block,
                }) as AvailableDeliveryRequestsListItem,
            ),
    };
  };

export const useAvailableDeliveryRequests = () =>
  useQuery(
    QUERY_KEY.availableDeliveryRequestList,
    getAvailableDeliveryRequests,
  );
