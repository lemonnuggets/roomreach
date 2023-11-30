import React from "react";
import { RefreshControl, ScrollView, StyleSheet, Text } from "react-native";

import CustomerDeliveryRequest from "@/atoms/CustomerDeliveryRequest";
import { useCustomerDeliveryRequests } from "@/hooks/useCustomerDeliveryRequests";

function CustomerDeliveryRequests() {
  const { data, isLoading, isError, refetch } = useCustomerDeliveryRequests();

  console.log(data?.data.map((deliveryRequest) => deliveryRequest.delivererId));
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
            <CustomerDeliveryRequest
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
export default CustomerDeliveryRequests;
