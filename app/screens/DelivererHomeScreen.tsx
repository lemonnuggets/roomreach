import React from "react";
import { StyleSheet, View } from "react-native";

import DelivererAvailableRequests from "@/molecules/DelivererAvailableRequests";

function DelivererHomeScreen() {
  return (
    <View style={styles.container}>
      <DelivererAvailableRequests />
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

export default DelivererHomeScreen;
