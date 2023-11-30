import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import AuthNavigator from "./AuthNavigator";
import CustomerNavigator from "./CustomerNavigator";
import DelivererNavigator from "./DelivererNavigator";

import { COLORS } from "@/constants/colors";
import { ROLE } from "@/constants/roles";
import { useUser } from "@/hooks/useUser";

function RootNavigator() {
  const { data, isLoading, isError } = useUser();
  if (isLoading)
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.logoText}>RoomReach</Text>
        <ActivityIndicator size="large" color={COLORS.black} />
      </View>
    );
  return (
    <NavigationContainer>
      {isError && <AuthNavigator />}
      {!isError && data && data.user_account.role === ROLE.CUSTOMER && (
        <CustomerNavigator />
      )}
      {!isError && data && data.user_account.role === ROLE.DELIVERER && (
        <DelivererNavigator />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.black,
  },
});

export default RootNavigator;
