import React from "react";
import { RefreshControl, ScrollView, StyleSheet, Text } from "react-native";

import DelivererDeliveryRequest from "@/atoms/DelivererDeliveryRequest";
import { COLORS } from "@/constants/colors";
import { useDelivererDeliveryRequests } from "@/hooks/useDelivererDeliveryRequests";

function DelivererDeliveryRequests() {
  const { data, isLoading, isError, refetch } = useDelivererDeliveryRequests();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={() => {
            refetch();
          }}
        />
      }
    >
      {isError && <Text>Something went wrong</Text>}
      {!isError && !isLoading && data && data.data.length === 0 && (
        <Text>Your delivery requests will appear here.</Text>
      )}
      {!isError &&
        !isLoading &&
        data &&
        data.data.length > 0 &&
        [...data.data]
          .reverse()
          .map((deliveryRequest) => (
            <DelivererDeliveryRequest
              deliveryRequest={deliveryRequest}
              key={deliveryRequest.id}
            />
          ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 5,
  },
  deliveryRequestContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.darkGray,
    borderRadius: 10,
    marginVertical: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 300,
  },
  deliveryRequestText: {
    fontSize: 24,
  },
  PENDING: {
    color: COLORS.red,
  },
  REQUESTED: {
    color: COLORS.orange,
  },
  ACCEPTED: {
    color: COLORS.yellow,
  },
  PICKED_UP: {
    color: COLORS.lightGreen,
  },
  DELIVERED: {
    color: COLORS.green,
  },
});
export default DelivererDeliveryRequests;
