import { Dialog } from "@rneui/base";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/colors";
import { HOSTEL_BLOCKS_MAPPED } from "@/data/hostelBlocks";
import { PICKUP_LOCATIONS_MAPPED } from "@/data/pickupLocations";
import { useApplyForDeliveryRequest } from "@/hooks/useApplyForDeliveryRequest";
import { AvailableDeliveryRequestsListItem } from "@/types/deliveryRequest";

type Props = {
  deliveryRequest: AvailableDeliveryRequestsListItem;
};
function AvailableRequest({ deliveryRequest }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const applyForDeliveryRequestMutation = useApplyForDeliveryRequest();
  return (
    <>
      <Pressable
        key={deliveryRequest.id}
        onPress={() => {
          setIsDialogOpen(true);
        }}
      >
        <View style={styles.container}>
          <View>
            <Text style={styles.text}>
              Pickup: {PICKUP_LOCATIONS_MAPPED[deliveryRequest.pickupLocation]}
            </Text>
            <Text style={styles.text}>
              Dropoff: {HOSTEL_BLOCKS_MAPPED[deliveryRequest.block]}
            </Text>
          </View>
          <Text style={styles.text}>ID: {deliveryRequest.id}</Text>
        </View>
      </Pressable>
      <Dialog
        isVisible={isDialogOpen}
        onBackdropPress={() => setIsDialogOpen(false)}
        overlayStyle={{
          backgroundColor: COLORS.white,
        }}
      >
        <Dialog.Title title="Application confirmation" />
        <Text>Are you sure you want to apply for this request?</Text>
        <Dialog.Actions>
          <Dialog.Button
            onPress={() => setIsDialogOpen(false)}
            title="Cancel"
          />
          <Dialog.Button
            onPress={() => {
              applyForDeliveryRequestMutation.mutate(
                {
                  deliveryRequestId: deliveryRequest.id,
                },
                {
                  onSettled: () => {
                    setIsDialogOpen(false);
                  },
                },
              );
            }}
            title="Confirm"
          />
        </Dialog.Actions>
      </Dialog>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.darkGray,
    borderRadius: 10,
    marginVertical: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 300,
    backgroundColor: COLORS.darkGray,
  },
  text: {
    fontSize: 24,
    color: COLORS.white,
  },
  PENDING: {
    color: COLORS.red,
  },
  REQUESTED: {
    color: COLORS.orange,
  },
  ACCEPTED: {
    color: COLORS.yellow,
  },
  PICKED_UP: {
    color: COLORS.lightGreen,
  },
  DELIVERED: {
    color: COLORS.green,
  },
});

export default AvailableRequest;
