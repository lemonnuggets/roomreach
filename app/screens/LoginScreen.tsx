import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import CustomButton, { ButtonSize } from "@/atoms/CustomButton";
import LabelledInput from "@/atoms/TextField";
import { COLORS } from "@/constants/colors";
import { NAVIGATION_KEY } from "@/constants/navigationKeys";
import { useLogin } from "@/hooks/useLogin";
import { AuthStackNavigationProps } from "@/navigators/AuthNavigator";

function LoginScreen() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const loginMutation = useLogin();
  const navigation = useNavigation<AuthStackNavigationProps>();

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <LabelledInput
          label="Username"
          value={username}
          setValue={(value) => {
            setUsername(value.trim());
          }}
          textContentType="username"
          autoCapitalize="none"
        />
        <LabelledInput
          label="Password"
          value={password}
          setValue={(value) => {
            setPassword(value.trim());
          }}
          textContentType="password"
          autoCapitalize="none"
          secureTextEntry
        />
        <CustomButton
          label="Login"
          onClick={() => {
            loginMutation.mutate({ username, password });
          }}
        />
      </View>
      <View style={styles.registerActionsContainer}>
        <Text>Don't have an account yet?</Text>
        <View style={styles.registerActions}>
          <CustomButton
            onClick={() => {
              navigation.navigate(NAVIGATION_KEY.registerCustomer);
            }}
            label="Register as Customer"
            size={ButtonSize.small}
          />
          <CustomButton
            onClick={() => {
              navigation.navigate(NAVIGATION_KEY.registerDeliverer);
            }}
            label="Register as Deliverer"
            size={ButtonSize.small}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    gap: 40,
  },
  innerContainer: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: COLORS.lightGray,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  registerActionsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 3,
  },
  registerActions: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
});
export default LoginScreen;
