import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { COLORS } from "@/constants/colors";

export enum ButtonSize {
  small = "small",
  regular = "regular",
}
type Props = {
  label: string;
  onClick: () => void;
  size?: ButtonSize;
  loading?: boolean;
};
function CustomButton({ label, onClick, size, loading }: Props) {
  if (size === undefined) {
    size = ButtonSize.regular;
  }
  if (loading === undefined) {
    loading = false;
  }
  const buttonStyle =
    size === ButtonSize.regular ? styles.regularButton : styles.smallButton;
  const textStyle =
    size === ButtonSize.regular ? styles.regularText : styles.smallText;
  return (
    <Pressable style={[styles.button, buttonStyle]} onPress={onClick}>
      {loading && <ActivityIndicator color={COLORS.white} />}
      {!loading && <Text style={[styles.text, textStyle]}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.black,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  regularButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  smallButton: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  text: {
    color: COLORS.white,
  },
  regularText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  smallText: {
    fontSize: 14,
  },
});
export default CustomButton;
