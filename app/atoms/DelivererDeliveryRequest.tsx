import { Dialog } from "@rneui/base";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/colors";
import { DELIVERY_STATUS, DELIVERY_STATUS_MAPPED } from "@/data/deliveryStatus";
import { PICKUP_LOCATIONS_MAPPED } from "@/data/pickupLocations";
import { useDeliverDeliveryRequest } from "@/hooks/useDeliverDeliveryRequest";
import { usePickupDeliveryRequest } from "@/hooks/usePickupDeliveryRequest";
import { DelivererDeliveryRequestsListItem } from "@/types/deliveryRequest";

type Props = {
  deliveryRequest: DelivererDeliveryRequestsListItem;
};
function DelivererDeliveryRequest({ deliveryRequest }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const pickupDeliveryRequestMutation = usePickupDeliveryRequest();
  const deliverDeliveryRequestMutation = useDeliverDeliveryRequest();

  const pickup = () => {
    pickupDeliveryRequestMutation.mutate(
      {
        deliveryRequestId: deliveryRequest.id,
      },
      {
        onSettled: () => {
          setIsDialogOpen(false);
        },
      },
    );
  };
  const deliver = () => {
    deliverDeliveryRequestMutation.mutate(
      {
        deliveryRequestId: deliveryRequest.id,
      },
      {
        onSettled: () => {
          setIsDialogOpen(false);
        },
      },
    );
  };

  return (
    <>
      <Pressable
        onPress={() => {
          setIsDialogOpen(true);
        }}
      >
        <View key={deliveryRequest.id} style={styles.deliveryRequestContainer}>
          <View>
            <Text style={[styles.deliveryRequestText, styles.info]}>
              ID: {deliveryRequest.id}
            </Text>
            <Text style={[styles.deliveryRequestText, styles.info]}>
              Pickup: {PICKUP_LOCATIONS_MAPPED[deliveryRequest.pickupLocation]}
            </Text>
          </View>
          <Text
            /* eslint-disable */
            style={{
              ...styles[
              DELIVERY_STATUS_MAPPED[deliveryRequest.status].replaceAll(
                " ",
                "_",
              ) as "REQUESTED" | "ACCEPTED" | "PICKED_UP" | "DELIVERED"
              ],
              ...styles.deliveryRequestText,
            }}
          /* eslint-enable */
          >
            {DELIVERY_STATUS_MAPPED[deliveryRequest.status]}
          </Text>
        </View>
      </Pressable>
      <Dialog
        isVisible={isDialogOpen}
        onBackdropPress={() => setIsDialogOpen(false)}
        overlayStyle={{
          backgroundColor: COLORS.white,
        }}
      >
        {deliveryRequest.status === DELIVERY_STATUS.REQUESTED && (
          <>
            <Dialog.Title title="Waiting for Approval" />
            <Text>Waiting for customer's approval</Text>
            <Dialog.Loading />
          </>
        )}
        {deliveryRequest.status === DELIVERY_STATUS.ACCEPTED && (
          <>
            <Dialog.Title title="Mark as Picked Up" />
            <Dialog.Actions>
              <Dialog.Button title="Pick Up" onPress={() => pickup()} />
            </Dialog.Actions>
          </>
        )}
        {deliveryRequest.status === DELIVERY_STATUS.PICKED_UP && (
          <>
            <Dialog.Title title="Mark as Delivered" />
            <Dialog.Actions>
              <Dialog.Button title="Delivered" onPress={() => deliver()} />
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </>
  );
}

const styles = StyleSheet.create({
  deliveryRequestContainer: {
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
  deliveryRequestText: {
    fontSize: 18,
  },
  info: {
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

export default DelivererDeliveryRequest;
