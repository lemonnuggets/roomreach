package routes

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/lemonnuggets/roomreach-server/model"
)

func CurrentCustomer(c *fiber.Ctx) error {
	fmt.Println("\ncurrent customer")
	sess, err := store.Get(c)
	if err != nil {
		fmt.Println("error while getting session")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized",
		})
	}

	auth := sess.Get(AUTH_KEY)
	userId := sess.Get(USER_ID)
	role := sess.Get(ROLE)
	if auth == nil || userId == nil || role == nil {
		fmt.Println("error while getting session keys")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized",
		})
	}

	userAccount, err := model.GetUserAccount(fmt.Sprint(userId.(uint64)))
	if err != nil {
		fmt.Println("error while getting user account")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized",
		})
	}
	if userAccount.Role != model.CUSTOMER_ROLE {
		fmt.Println("error invalid role")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized",
		})
	}

	userAccountResponse := UserAccountResponse{
		ID:       userAccount.ID,
		Username: userAccount.Username,
		Role:     userAccount.Role,
	}

	customer, err := model.GetCustomerByUserId(fmt.Sprint(userId.(uint64)))
	if err != nil {
		fmt.Println("error while getting customer", err.Error())
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized",
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message":      "authorized",
		"customer":     customer,
		"user_account": userAccountResponse,
	})
}

func CreateDeliveryRequest(c *fiber.Ctx) error {
	fmt.Println("\ncreate delivery request")
	var data model.NewDeliveryRequest

	err := c.BodyParser(&data)
	if err != nil {
		fmt.Println("error while parsing body")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + err.Error(),
		})
	}

	sess, sessErr := store.Get(c)
	if sessErr != nil {
		fmt.Println("error while getting session")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + sessErr.Error(),
		})
	}

	customer_id := sess.Get(CUSTOMER_ID)
	if customer_id == nil {
		fmt.Println("error while getting customer_id")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + err.Error(),
		})
	}

	delivery_request_id, err := model.CreateDeliveryRequest(fmt.Sprint(customer_id), &data)
	if err != nil {
		fmt.Println("error while creating delivery request")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "delivery request created",
		"data":    delivery_request_id,
	})
}

func GetCustomerDeliveryRequests(c *fiber.Ctx) error {
	fmt.Println("\nget customer delivery requests")

	sess, sessErr := store.Get(c)
	if sessErr != nil {
		fmt.Println("error while getting session")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + sessErr.Error(),
		})
	}

	customer_id := sess.Get(CUSTOMER_ID)
	if customer_id == nil {
		fmt.Println("error while getting customer_id")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: invalid customer",
		})
	}

	delivery_requests, err := model.GetCustomerDeliveryRequests(fmt.Sprint(customer_id))
	if err != nil {
		fmt.Println("error while getting delivery requests", err.Error())
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + err.Error(),
		})
	}

	fmt.Println("SUCCESS!")
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "delivery requests retrieved",
		"data":    delivery_requests,
	})
}

type DelivererRequest struct {
	DelivererId uint64 `query:"deliverer_id"`
}

func GetDeliverer(c *fiber.Ctx) error {
	fmt.Println("\nget customer deliverer")

	var data DelivererRequest
	err := c.QueryParser(&data)
	if err != nil {
		fmt.Println("error while parsing body")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + err.Error(),
		})
	}

	deliverer, err := model.GetDeliverer(fmt.Sprint(data.DelivererId))
	if err != nil {
		fmt.Println("error while getting deliverer", data.DelivererId, err.Error())
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + err.Error(),
		})
	}

	fmt.Println("SUCCESS!")
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "deliverer retrieved",
		"data":    deliverer,
	})
}

type DeliveryRequestApproveRequest struct {
	DeliveryRequestId uint64 `json:"delivery_request_id"`
	Approved          bool   `json:"approved"`
}

func ApproveDeliveryRequest(c *fiber.Ctx) error {
	fmt.Println("\napprove delivery request")

	sess, sessErr := store.Get(c)
	if sessErr != nil {
		fmt.Println("error while getting session")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized",
		})
	}

	customer_id := sess.Get(CUSTOMER_ID)
	if customer_id == nil {
		fmt.Println("error while getting customer_id")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized",
		})
	}

	var data DeliveryRequestApproveRequest
	err := c.BodyParser(&data)
	if err != nil {
		fmt.Println("error while getting delivery_request_id and approved")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + err.Error(),
		})
	}

	err = model.ApproveDeliveryRequest(customer_id.(uint64), data.DeliveryRequestId, data.Approved)
	if err != nil {
		fmt.Println("error while approving delivery request", err.Error())
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + err.Error(),
		})
	}

	if data.Approved {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "approved delivery request",
		})
	} else {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "rejected delivery request",
		})
	}
}
