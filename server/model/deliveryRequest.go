package model

import (
	"database/sql"
	"fmt"
	"strconv"
)

type DeliveryRequest struct {
	ID                   uint64 `json:"id"`
	CustomerID           uint64 `json:"customer_id"`
	DelivererID          uint64 `json:"deliverer_id"`
	Status               uint64 `json:"status"`
	PickupLocation       string `json:"pickup_location"`
	DeliveryInstructions string `json:"delivery_instructions"`
}

var (
	STATUS_PENDING   uint64 = 0
	STATUS_REQUESTED uint64 = 1
	STATUS_ACCEPTED  uint64 = 2
	STATUS_PICKED_UP uint64 = 3
	STATUS_DELIVERED uint64 = 4
)

type NewDeliveryRequest struct {
	PickupLocation       string `json:"pickup_location"`
	DeliveryInstructions string `json:"delivery_instructions"`
}

func CreateDeliveryRequest(customerIdStr string, newDeliveryRequest *NewDeliveryRequest) (string, error) {
	customerId, err := strconv.ParseUint(string(customerIdStr), 10, 64)
	if err != nil {
		return "", err
	}
	deliveryRequest := DeliveryRequest{
		CustomerID:           customerId,
		Status:               0,
		PickupLocation:       newDeliveryRequest.PickupLocation,
		DeliveryInstructions: newDeliveryRequest.DeliveryInstructions,
	}

	var id uint64
	statement := `insert into delivery_request (customer_id, status, pickup_location, delivery_instructions) values ($1, $2, $3, $4) returning id;`

	err = db.QueryRow(statement, deliveryRequest.CustomerID, deliveryRequest.Status, deliveryRequest.PickupLocation, deliveryRequest.DeliveryInstructions).Scan(&id)
	if err != nil {
		return "", err
	}
	return fmt.Sprint(id), nil
}

type CustomerDeliveryRequestsListItem struct {
	ID                   uint64        `json:"id"`
	DelivererId          sql.NullInt64 `json:"deliverer_id"`
	Status               uint64        `json:"status"`
	PickupLocation       string        `json:"pickup_location"`
	DeliveryInstructions string        `json:"delivery_instructions"`
}

func GetCustomerDeliveryRequests(customerIdStr string) ([]CustomerDeliveryRequestsListItem, error) {
	customerId, err := strconv.ParseUint(string(customerIdStr), 10, 64)
	var deliveryRequests []CustomerDeliveryRequestsListItem
	if err != nil {
		return deliveryRequests, err
	}

	statement := `select id, deliverer_id, status, pickup_location, delivery_instructions from delivery_request where customer_id = $1;`

	rows, err := db.Query(statement, customerId)
	if err != nil {
		return deliveryRequests, err
	}

	for rows.Next() {
		var deliveryRequest CustomerDeliveryRequestsListItem
		err := rows.Scan(&deliveryRequest.ID, &deliveryRequest.DelivererId, &deliveryRequest.Status, &deliveryRequest.PickupLocation, &deliveryRequest.DeliveryInstructions)
		if err != nil {
			return deliveryRequests, err
		}
		deliveryRequests = append(deliveryRequests, deliveryRequest)
	}

	return deliveryRequests, nil
}

type AvailableRequestsListItem struct {
	ID             uint64 `json:"id"`
	PickupLocation string `json:"pickup_location"`
	DropoffBlock   string `json:"dropoff_block"`
}

func GetAvailableRequests(delivererIdStr string) ([]AvailableRequestsListItem, error) {
	var availableRequests []AvailableRequestsListItem

	deliverer, err := GetDeliverer(delivererIdStr)
	if err != nil {
		return availableRequests, err
	}

	statement := `select delivery_request.id, delivery_request.pickup_location, customer.block from delivery_request, customer where customer.gender = $1 and delivery_request.status = 0 and delivery_request.customer_id = customer.id;`

	rows, err := db.Query(statement, deliverer.Gender)
	if err != nil {
		return availableRequests, err
	}

	for rows.Next() {
		var deliveryRequest AvailableRequestsListItem
		err := rows.Scan(&deliveryRequest.ID, &deliveryRequest.PickupLocation, &deliveryRequest.DropoffBlock)
		if err != nil {
			return availableRequests, err
		}
		availableRequests = append(availableRequests, deliveryRequest)
	}

	return availableRequests, nil
}

type PartialDeliveryRequest struct {
	ID             uint64 `json:"id"`
	Status         uint64 `json:"status"`
	PickupLocation string `json:"pickup_location"`
}

func GetDelivererDeliveryRequests(delivererIdStr string) ([]PartialDeliveryRequest, error) {
	var deliveryRequests []PartialDeliveryRequest

	delivererId, err := strconv.ParseUint(string(delivererIdStr), 10, 64)
	if err != nil {
		return deliveryRequests, err
	}

	statement := `select id, status, pickup_location from delivery_request where deliverer_id = $1;`

	rows, err := db.Query(statement, delivererId)
	if err != nil {
		return deliveryRequests, err
	}

	for rows.Next() {
		var deliveryRequest PartialDeliveryRequest
		err := rows.Scan(&deliveryRequest.ID, &deliveryRequest.Status, &deliveryRequest.PickupLocation)
		if err != nil {
			return deliveryRequests, err
		}
		deliveryRequests = append(deliveryRequests, deliveryRequest)
	}

	return deliveryRequests, nil
}

func ApplyForDeliveryRequest(delivererId uint64, deliveryRequestId uint64) error {
	statement := `update delivery_request set status = 1, deliverer_id = $1 where id = $2;`

	_, err := db.Exec(statement, delivererId, deliveryRequestId)
	return err
}

func ApproveDeliveryRequest(customerId uint64, deliveryRequestId uint64, approved bool) error {
	var statement string
	if approved {
		statement = `update delivery_request set status = 2 where id = $1 and customer_id = $2 and status = 1;`
	} else {
		// set status to 0 and deliverer_id to null
		statement = `update delivery_request set status = 0, deliverer_id = null where id = $1 and customer_id = $2 and status = 1;`
	}

	_, err := db.Exec(statement, deliveryRequestId, customerId)
	return err
}

func PickupDeliveryRequest(delivererId uint64, deliveryRequestId uint64) error {
	statement := `update delivery_request set status = 3 where id = $1 and deliverer_id = $2 and status = 2;`

	_, err := db.Exec(statement, deliveryRequestId, delivererId)
	return err
}

func CompleteDeliveryRequest(delivererId uint64, deliveryRequestId uint64) error {
	statement := `update delivery_request set status = 4 where id = $1 and deliverer_id = $2 and status = 3;`

	_, err := db.Exec(statement, deliveryRequestId, delivererId)
	return err
}
