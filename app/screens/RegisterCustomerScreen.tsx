import { useNavigation } from "@react-navigation/native";
import { ButtonGroup } from "@rneui/base";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import MaskInput from "react-native-mask-input";

import CustomButton from "@/atoms/CustomButton";
import LabelledInput from "@/atoms/TextField";
import { COLORS } from "@/constants/colors";
import { NAVIGATION_KEY } from "@/constants/navigationKeys";
import { MENS_HOSTEL_BLOCKS, WOMENS_HOSTEL_BLOCKS } from "@/data/hostelBlocks";
import { PHONE_MASK } from "@/data/phoneMask";
import { useRegisterCustomer } from "@/hooks/useRegisterCustomer";
import { AuthStackNavigationProps } from "@/navigators/AuthNavigator";

function RegisterCustomerScreen() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [genderIndex, setGenderIndex] = React.useState(0);
  const [phone, setPhone] = React.useState("");
  const [block, setBlock] = React.useState("");
  const [blockDropdownOpen, setBlockDropdownOpen] = React.useState(false);
  const [room, setRoom] = React.useState(0);
  const registerMutation = useRegisterCustomer();
  const navigation = useNavigation<AuthStackNavigationProps>();
  const items = genderIndex === 0 ? MENS_HOSTEL_BLOCKS : WOMENS_HOSTEL_BLOCKS;

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <LabelledInput
          label="Username"
          value={username}
          setValue={(value) => setUsername(value.trim())}
          textContentType="username"
          autoCapitalize="none"
        />
        <LabelledInput
          label="Password"
          value={password}
          setValue={(value) => setPassword(value.trim())}
          textContentType="password"
          autoCapitalize="none"
          secureTextEntry
        />
        <LabelledInput
          label="Name"
          value={name}
          setValue={setName}
          textContentType="name"
          autoCapitalize="words"
        />
        <View style={{ width: 200 }}>
          <Text>Gender</Text>
          <ButtonGroup
            buttons={["Male", "Female"]}
            selectedIndex={genderIndex}
            onPress={(value) => {
              setGenderIndex(value);
            }}
            underlayColor={COLORS.lightGray}
          />
        </View>
        <LabelledInput
          label="Phone"
          inputElement={
            <MaskInput
              value={phone}
              onChangeText={(masked, unmasked) => {
                setPhone(masked);
              }}
              keyboardType="phone-pad"
              mask={PHONE_MASK}
              style={styles.input}
            />
          }
        />
        <LabelledInput
          label="Block"
          inputElement={
            <DropDownPicker
              open={blockDropdownOpen}
              setOpen={setBlockDropdownOpen}
              value={block}
              items={items}
              setValue={setBlock}
              multiple={false}
              style={styles.input}
              dropDownContainerStyle={{
                maxWidth: 200,
                zIndex: 1000,
                elevation: 1000,
              }}
            />
          }
        />
        <LabelledInput
          label="Room"
          value={room.toString()}
          setValue={(value) => {
            if (isNaN(parseInt(value, 10))) {
              setRoom(0);
              return;
            }
            setRoom(parseInt(value, 10));
          }}
          keyboardType="numeric"
        />
        <CustomButton
          label="Register"
          onClick={() => {
            const registerData = {
              username,
              password,
              name,
              gender: genderIndex === 0 ? "M" : "F",
              phone,
              block,
              room,
            };
            console.log("registerData", registerData);
            registerMutation.mutate(registerData);
          }}
        />
        <Text>
          Already have an account?
          <Text
            onPress={() => {
              navigation.navigate(NAVIGATION_KEY.login);
            }}
          >
            {" "}
            Click Here to Login.
          </Text>
        </Text>
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
export default RegisterCustomerScreen;
