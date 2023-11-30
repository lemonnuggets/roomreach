package routes

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/lemonnuggets/roomreach-server/model"
)

func CurrentDeliverer(c *fiber.Ctx) error {
	fmt.Println("\ncurrent deliverer")
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
	if userAccount.Role != model.DELIVERER_ROLE {
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

	deliverer, err := model.GetDelivererByUserId(fmt.Sprint(userId.(uint64)))
	if err != nil {
		fmt.Println("error while getting deliverer", err.Error())
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized",
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message":      "authorized",
		"deliverer":    deliverer,
		"user_account": userAccountResponse,
	})
}

func GetAvailableRequests(c *fiber.Ctx) error {
	fmt.Println("\nget available delivery requests")

	sess, sessErr := store.Get(c)
	if sessErr != nil {
		fmt.Println("error while getting session")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + sessErr.Error(),
		})
	}

	deliverer_id := sess.Get(DELIVERER_ID)
	if deliverer_id == nil {
		fmt.Println("error while getting deliverer_id")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: invalid deliverer",
		})
	}

	availableRequests, err := model.GetAvailableRequests(fmt.Sprint(deliverer_id))
	if err != nil {
		fmt.Println("error while getting delivery requests", err.Error())
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "delivery requests retrieved",
		"data":    availableRequests,
	})
}

func GetDelivererDeliveryRequests(c *fiber.Ctx) error {
	fmt.Println("\nget deliverer delivery requests")

	sess, sessErr := store.Get(c)
	if sessErr != nil {
		fmt.Println("error while getting session")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + sessErr.Error(),
		})
	}

	deliverer_id := sess.Get(DELIVERER_ID)
	if deliverer_id == nil {
		fmt.Println("error while getting deliverer_id")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: invalid deliverer",
		})
	}

	delivererRequests, err := model.GetDelivererDeliveryRequests(fmt.Sprint(deliverer_id))
	if err != nil {
		fmt.Println("error while getting delivery requests", err.Error())
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "delivery requests retrieved",
		"data":    delivererRequests,
	})
}

type DeliveryRequestApplyRequest struct {
	DeliveryRequestId uint64 `json:"delivery_request_id"`
}

func ApplyForDeliveryRequest(c *fiber.Ctx) error {
	fmt.Println("\napply for delivery request")

	sess, sessErr := store.Get(c)
	if sessErr != nil {
		fmt.Println("error while getting session")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized",
		})
	}

	deliverer_id := sess.Get(DELIVERER_ID)
	if deliverer_id == nil {
		fmt.Println("error while getting deliverer_id")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized",
		})
	}

	var data DeliveryRequestApplyRequest
	err := c.BodyParser(&data)
	if err != nil {
		fmt.Println("error while getting delivery_request_id")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + err.Error(),
		})
	}

	err = model.ApplyForDeliveryRequest(deliverer_id.(uint64), data.DeliveryRequestId)
	if err != nil {
		fmt.Println("error while applying for delivery request", err.Error())
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "applied for delivery request",
	})
}

func PickupDeliveryRequest(c *fiber.Ctx) error {
	fmt.Println("\npickup delivery request")

	sess, sessErr := store.Get(c)
	if sessErr != nil {
		fmt.Println("error while getting session")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized",
		})
	}

	deliverer_id := sess.Get(DELIVERER_ID)
	if deliverer_id == nil {
		fmt.Println("error while getting deliverer_id")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized",
		})
	}

	var data DeliveryRequestApplyRequest
	err := c.BodyParser(&data)
	if err != nil {
		fmt.Println("error while getting delivery_request_id")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + err.Error(),
		})
	}

	err = model.PickupDeliveryRequest(deliverer_id.(uint64), data.DeliveryRequestId)
	if err != nil {
		fmt.Println("error while picking up delivery request", err.Error())
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "picked up delivery request",
	})
}

func DeliverDeliveryRequest(c *fiber.Ctx) error {
	fmt.Println("\ncomplete delivery request")

	sess, sessErr := store.Get(c)
	if sessErr != nil {
		fmt.Println("error while getting session")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized",
		})
	}

	deliverer_id := sess.Get(DELIVERER_ID)
	if deliverer_id == nil {
		fmt.Println("error while getting deliverer_id")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized",
		})
	}

	var data DeliveryRequestApplyRequest
	err := c.BodyParser(&data)
	if err != nil {
		fmt.Println("error while getting delivery_request_id")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + err.Error(),
		})
	}

	err = model.CompleteDeliveryRequest(deliverer_id.(uint64), data.DeliveryRequestId)
	if err != nil {
		fmt.Println("error while completing delivery request", err.Error())
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "completed delivery request",
	})
}
