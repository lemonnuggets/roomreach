import { Dialog, FAB } from "@rneui/base";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

import LabelledInput from "../atoms/TextField";

import { COLORS } from "@/constants/colors";
import { GENDER } from "@/constants/gender";
import {
  MENS_PICKUP_LOCATIONS,
  WOMENS_PICKUP_LOCATIONS,
} from "@/data/pickupLocations";
import { useCreateDeliveryRequest } from "@/hooks/useCreateDeliveryRequest";
import { useUserCustomer } from "@/hooks/useUserCustomer";

export const CreateDeliveryRequestFAB = () => {
  const { data, isLoading } = useUserCustomer();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPickupLocationDropdownOpen, setIsPickupLocationDropdownOpen] =
    useState(false);
  const [pickupLocation, setPickupLocation] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const createDeliveryRequestMutation = useCreateDeliveryRequest();
  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  const openDialog = () => {
    setIsDialogOpen(true);
  };
  const createDeliveryRequest = () => {
    console.log("createDeliveryRequest");
    createDeliveryRequestMutation.mutate(
      {
        pickupLocation,
        deliveryInstructions,
      },
      {
        onSuccess: () => {
          closeDialog();
        },
      },
    );
  };
  return (
    <>
      <FAB
        style={styles.fab}
        icon={{ name: "add", color: COLORS.white }}
        color={COLORS.black}
        placement="right"
        onPress={openDialog}
      />
      <Dialog
        isVisible={isDialogOpen}
        onBackdropPress={closeDialog}
        overlayStyle={{
          backgroundColor: COLORS.white,
        }}
      >
        {isLoading ? (
          <Text>Loading...</Text>
        ) : data === undefined ? (
          <Text>Error fetching user. Logout and login again.</Text>
        ) : (
          <>
            <Dialog.Title title="Create new delivery request" />
            <View style={styles.dialogContent}>
              <LabelledInput
                label="Pickup Location"
                inputElement={
                  <DropDownPicker
                    style={styles.input}
                    multiple={false}
                    open={isPickupLocationDropdownOpen}
                    setOpen={setIsPickupLocationDropdownOpen}
                    value={pickupLocation}
                    setValue={setPickupLocation}
                    items={
                      data.customer.gender === GENDER.M
                        ? MENS_PICKUP_LOCATIONS
                        : WOMENS_PICKUP_LOCATIONS
                    }
                    dropDownContainerStyle={{
                      maxWidth: 200,
                      zIndex: 1000,
                      elevation: 1000,
                    }}
                  />
                }
              />
              <LabelledInput
                label="Delivery Instructions"
                value={deliveryInstructions}
                setValue={setDeliveryInstructions}
              />
              <Dialog.Actions>
                <Dialog.Button onPress={closeDialog} title="Cancel" />
                <Dialog.Button onPress={createDeliveryRequest} title="Create" />
              </Dialog.Actions>
            </View>
          </>
        )}
      </Dialog>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {},
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  input: {
    width: 200,
  },
});
