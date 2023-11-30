import React from "react";
import { StyleSheet, View } from "react-native";

import { CreateDeliveryRequestFAB } from "@/molecules/CreateDeliveryRequestFAB";
import CustomerDeliveryRequests from "@/molecules/CustomerDeliveryRequests";

export const CustomerHomeScreen = () => {
  return (
    <View style={styles.container}>
      <CreateDeliveryRequestFAB />
      <CustomerDeliveryRequests />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 5,
    flexGrow: 1,
  },
});
