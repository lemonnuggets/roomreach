import { Dialog } from "@rneui/base";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/colors";
import { DELIVERY_STATUS, DELIVERY_STATUS_MAPPED } from "@/data/deliveryStatus";
import { PICKUP_LOCATIONS_MAPPED } from "@/data/pickupLocations";
import { useApproveDeliveryRequest } from "@/hooks/useApproveDeliveryRequest";
import { useDelivererInfo } from "@/hooks/useDelivererInfo";
import { CustomerDeliveryRequestsListItem } from "@/types/deliveryRequest";

type Props = {
  deliveryRequest: CustomerDeliveryRequestsListItem;
};
function CustomerDeliveryRequest({ deliveryRequest }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const approveDeliveryRequestMutation = useApproveDeliveryRequest();
  const { data: delivererData, isLoading: delivererIsLoading } =
    useDelivererInfo(
      deliveryRequest.delivererId,
      DELIVERY_STATUS.REQUESTED === deliveryRequest.status ||
        DELIVERY_STATUS.ACCEPTED === deliveryRequest.status ||
        DELIVERY_STATUS.PICKED_UP === deliveryRequest.status ||
        DELIVERY_STATUS.DELIVERED === deliveryRequest.status,
    );

  const approve = (approved: boolean) => {
    approveDeliveryRequestMutation.mutate(
      {
        deliveryRequestId: deliveryRequest.id,
        approved,
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
              ) as "PENDING" | "REQUESTED" | "ACCEPTED" | "PICKED_UP" | "DELIVERED"
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
        {deliveryRequest.status === DELIVERY_STATUS.PENDING && (
          <>
            <Dialog.Title title="Waiting for deliverer" />
            <Text>
              Please be patient as we try to find a deliverer for you. Check
              back again later.
            </Text>
            <Dialog.Loading />
          </>
        )}
        {deliveryRequest.status === DELIVERY_STATUS.REQUESTED && (
          <>
            <Dialog.Title title="Approval confirmation" />
            {delivererIsLoading && <Dialog.Loading />}
            {!delivererIsLoading && delivererData && (
              <>
                <Text>
                  Allow {`"${delivererData.data.name}"`} to collect your
                  package?
                </Text>
                <Dialog.Actions>
                  <Dialog.Button
                    onPress={() => approve(false)}
                    title="Reject"
                  />
                  <Dialog.Button
                    onPress={() => approve(true)}
                    title="Approve"
                  />
                </Dialog.Actions>
              </>
            )}
          </>
        )}
        {deliveryRequest.status === DELIVERY_STATUS.ACCEPTED && (
          <>
            <Dialog.Title title="Waiting for pickup" />
            {delivererIsLoading && <Dialog.Loading />}
            {!delivererIsLoading && delivererData && (
              <>
                <Text>
                  Waiting for {`"${delivererData.data.name}"`} to pick up the
                  package.
                </Text>
                <Dialog.Loading />
              </>
            )}
          </>
        )}
        {deliveryRequest.status === DELIVERY_STATUS.PICKED_UP && (
          <>
            <Dialog.Title title="Waiting for pickup" />
            {delivererIsLoading && <Dialog.Loading />}
            {!delivererIsLoading && delivererData && (
              <>
                <Text>
                  {`"${delivererData.data.name}"`} has picked up the package.
                  Waiting for them to deliver the package.
                </Text>
                <Dialog.Loading />
              </>
            )}
          </>
        )}
        {deliveryRequest.status === DELIVERY_STATUS.DELIVERED && (
          <>
            <Dialog.Title title="Delivery complete" />
            {delivererIsLoading && <Dialog.Loading />}
            {!delivererIsLoading && delivererData && (
              <>
                <Text>
                  {`"${delivererData.data.name}"`} has delivered the package.
                </Text>
                <Dialog.Actions>
                  <Dialog.Button onPress={() => setIsDialogOpen(false)} />
                </Dialog.Actions>
              </>
            )}
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

export default CustomerDeliveryRequest;
