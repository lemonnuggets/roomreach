import React from "react";
import { StyleSheet, View } from "react-native";

import DelivererDeliveryRequests from "@/molecules/DelivererDeliveryRequests";

function DelivererRequestsScreen() {
  return (
    <View style={styles.container}>
      <DelivererDeliveryRequests />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 5,
    flexGrow: 1,
  },
});

export default DelivererRequestsScreen;
