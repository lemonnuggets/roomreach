import { useQuery } from "react-query";

import { QUERY_KEY } from "@/constants/queryKeys";
import { API_URL } from "@/constants/url";
import { CustomerDeliveryRequestsListItem } from "@/types/deliveryRequest";
import { DataResponse } from "@/types/response";

type CustomerDeliveryRequestsResponseListItem = {
  id: number;
  status: number;
  deliverer_id: {
    Int64: number;
    Valid: boolean;
  };
  pickup_location: string;
  delivery_instructions: string;
};
type CustomerDeliveryRequestsResponse = DataResponse<
  CustomerDeliveryRequestsListItem[]
>;

const getCustomerDeliveryRequests =
  async (): Promise<CustomerDeliveryRequestsResponse> => {
    const url = `${API_URL}/customer/deliveryRequests`;

    let response: Response;
    try {
      response = await fetch(url, {
        method: "GET",
      });
    } catch (error) {
      console.log("GetDelivery Error: ", error);
      throw new Error("GetDelivery failed");
    }
    if (!response.ok) {
      throw new Error("GetDelivery failed");
    }
    const data: DataResponse<
      CustomerDeliveryRequestsResponseListItem[] | null
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
                  status: item.status,
                  pickupLocation: item.pickup_location,
                  deliveryInstructions: item.delivery_instructions,
                  delivererId: item.deliverer_id.Valid
                    ? item.deliverer_id.Int64
                    : null,
                }) as CustomerDeliveryRequestsListItem,
            ),
    };
  };

export const useCustomerDeliveryRequests = () =>
  useQuery(QUERY_KEY.customerDeliveryRequestList, getCustomerDeliveryRequests);
