import { NavigationProp } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import CustomButton from "@/atoms/CustomButton";
import { NAVIGATION_KEY } from "@/constants/navigationKeys";
import { useLogout } from "@/hooks/useLogout";
import { CustomerHomeScreen } from "@/screens/CustomerHomeScreen";

export type CustomerScreenNames = [NAVIGATION_KEY.customerHome];
export type CustomerStackParamList = Record<
  CustomerScreenNames[number],
  undefined
>;
export type CustomerStackNavigationProps =
  NavigationProp<CustomerStackParamList>;

const Stack = createStackNavigator();
function CustomerNavigator() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const logoutMutation = useLogout();
  return (
    <Stack.Navigator
      initialRouteName={NAVIGATION_KEY.customerHome}
      screenOptions={{
        headerTitle(props) {
          return (
            <View style={styles.header}>
              <View>
                <Text style={styles.headerText}>{props.children}</Text>
              </View>
              <CustomButton
                label="Logout"
                onClick={() => {
                  logoutMutation.mutate();
                  setIsLoggingOut(true);
                }}
                loading={isLoggingOut}
              />
            </View>
          );
        },
      }}
    >
      <Stack.Screen
        name={NAVIGATION_KEY.customerHome}
        component={CustomerHomeScreen}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default CustomerNavigator;
