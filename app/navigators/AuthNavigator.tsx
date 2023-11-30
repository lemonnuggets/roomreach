import { NavigationProp } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import { NAVIGATION_KEY } from "@/constants/navigationKeys";
import LoginScreen from "@/screens/LoginScreen";
import RegisterCustomerScreen from "@/screens/RegisterCustomerScreen";
import RegisterDelivererScreen from "@/screens/RegisterDelivererScreen";

export type AuthScreenNames = [
  NAVIGATION_KEY.login,
  NAVIGATION_KEY.registerCustomer,
  NAVIGATION_KEY.registerDeliverer,
];
export type AuthStackParamList = Record<AuthScreenNames[number], undefined>;
export type AuthStackNavigationProps = NavigationProp<AuthStackParamList>;

const Stack = createStackNavigator<AuthStackParamList>();
function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName={NAVIGATION_KEY.login}>
      <Stack.Screen name={NAVIGATION_KEY.login} component={LoginScreen} />
      <Stack.Screen
        name={NAVIGATION_KEY.registerCustomer}
        component={RegisterCustomerScreen}
      />
      <Stack.Screen
        name={NAVIGATION_KEY.registerDeliverer}
        component={RegisterDelivererScreen}
      />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
