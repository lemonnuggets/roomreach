import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import CustomButton from "@/atoms/CustomButton";
import { NAVIGATION_KEY } from "@/constants/navigationKeys";
import { useLogout } from "@/hooks/useLogout";
import DelivererHomeScreen from "@/screens/DelivererHomeScreen";
import DelivererRequestsScreen from "@/screens/DelivererRequestsScreen";

export type DelivererScreenNames = [NAVIGATION_KEY.delivererHome];
export type DelivererStackParamList = Record<
  DelivererScreenNames[number],
  undefined
>;
export type DelivererStackNavigationProps =
  NavigationProp<DelivererStackParamList>;

const Tab = createBottomTabNavigator();
function DelivererNavigator() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const logoutMutation = useLogout();
  return (
    <Tab.Navigator
      initialRouteName={NAVIGATION_KEY.delivererHome}
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
      <Tab.Screen
        name={NAVIGATION_KEY.delivererHome}
        component={DelivererHomeScreen}
      />
      <Tab.Screen
        name={NAVIGATION_KEY.delivererRequests}
        component={DelivererRequestsScreen}
      />
    </Tab.Navigator>
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

export default DelivererNavigator;
