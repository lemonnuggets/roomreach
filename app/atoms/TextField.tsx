import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { COLORS } from "@/constants/colors";
type Props = {
  label: string;
  value?: string;
  setValue?: (value: string) => void;
  inputElement?: React.ReactNode;
} & React.ComponentProps<typeof TextInput>;
function LabelledInput({
  value,
  label,
  setValue,
  inputElement,
  ...rest
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {inputElement === undefined ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          {...rest}
        />
      ) : (
        inputElement
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 5,
  },
  label: {},
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
    color: COLORS.black,
  },
});

export type TextContentType =
  | "none"
  | "URL"
  | "addressCity"
  | "addressCityAndState"
  | "addressState"
  | "countryName"
  | "creditCardNumber"
  | "emailAddress"
  | "familyName"
  | "fullStreetAddress"
  | "givenName"
  | "jobTitle"
  | "location"
  | "middleName"
  | "name"
  | "namePrefix"
  | "nameSuffix"
  | "nickname"
  | "organizationName"
  | "postalCode"
  | "streetAddressLine1"
  | "streetAddressLine2"
  | "sublocality"
  | "telephoneNumber"
  | "username"
  | "password"
  | "newPassword"
  | "oneTimeCode";

export default LabelledInput;
