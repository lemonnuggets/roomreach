import React from "react";
import { RefreshControl, ScrollView, StyleSheet, Text } from "react-native";

import AvailableRequest from "@/atoms/AvailableRequest";
import { useAvailableDeliveryRequests } from "@/hooks/useAvailableDeliveryRequests";

function DelivererAvailableRequests() {
  const { data, isLoading, isError, refetch } = useAvailableDeliveryRequests();

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
        <Text>No delivery requests available now. Check back later.</Text>
      )}
      {!isError &&
        !isLoading &&
        data &&
        data.data.length > 0 &&
        [...data.data]
          .reverse()
          .map((deliveryRequest) => (
            <AvailableRequest
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
});
export default DelivererAvailableRequests;
