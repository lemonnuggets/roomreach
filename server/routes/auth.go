package routes

import (
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/lemonnuggets/roomreach-server/model"
	"golang.org/x/crypto/bcrypt"
)

func NewMiddleware() fiber.Handler {
	return AuthMiddleware
}

func AuthMiddleware(c *fiber.Ctx) error {
	if strings.Split(c.Path(), "/")[1] == "auth" {
		return c.Next()
	}

	sess, err := store.Get(c)

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Unauthorized",
		})
	}

	if sess.Get(AUTH_KEY) == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Unauthorized",
		})
	}

	return c.Next()
}

type RegistrationData struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Role     uint64 `json:"role"`
	Name     string `json:"name"`
	Gender   string `json:"gender"`
	Phone    string `json:"phone"`
	Block    string `json:"block"`
	Room     uint64 `json:"room"`
}

func Register(c *fiber.Ctx) error {
	fmt.Println("\nregister")
	var data RegistrationData

	err := c.BodyParser(&data)
	if err != nil {
		fmt.Println("error while parsing body")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + err.Error(),
		})
	}

	password, bcErr := bcrypt.GenerateFromPassword([]byte(data.Password), 14)
	if bcErr != nil {
		fmt.Println("error while hashing password")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + err.Error(),
		})
	}

	dbUserAccount := model.UserAccount{
		Username: data.Username,
		Password: string(password),
		Role:     data.Role,
	}
	if data.Role == model.CUSTOMER_ROLE {
		dbCustomer := model.Customer{
			Name:   data.Name,
			Gender: data.Gender,
			Phone:  data.Phone,
			Block:  data.Block,
			Room:   data.Room,
		}
		_, err = model.CreateCustomer(&dbCustomer, &dbUserAccount)
		if err != nil {
			fmt.Println("error while creating customer")
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"message": "something went wrong: " + err.Error(),
			})
		}
	} else if data.Role == model.DELIVERER_ROLE {
		dbDeliverer := model.Deliverer{
			Name:   data.Name,
			Gender: data.Gender,
			Phone:  data.Phone,
		}
		_, err = model.CreateDeliverer(&dbDeliverer, &dbUserAccount)
		if err != nil {
			fmt.Println("error while creating deliverer")
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"message": "something went wrong: " + err.Error(),
			})
		}
	} else {
		fmt.Println("error invalid role")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: invalid role",
		})
	}

	fmt.Println("SUCCESS!")
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "user account created",
	})
}

type LoginDetails struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func Login(c *fiber.Ctx) error {
	fmt.Println("\nlogin")
	var data LoginDetails

	err := c.BodyParser(&data)
	if err != nil {
		fmt.Println("error while parsing body")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + err.Error(),
		})
	}

	var dbUserAccount model.UserAccount
	if !model.CheckUsername(data.Username, &dbUserAccount) {
		fmt.Println("error while checking username")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized",
		})
	}

	err = bcrypt.CompareHashAndPassword([]byte(dbUserAccount.Password), []byte(data.Password))
	if err != nil {
		fmt.Println("error while comparing password")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized",
		})
	}

	sess, sessErr := store.Get(c)
	if sessErr != nil {
		fmt.Println("error while getting session")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + sessErr.Error(),
		})
	}

	sess.Set(AUTH_KEY, true)
	sess.Set(USER_ID, dbUserAccount.ID)
	sess.Set(ROLE, dbUserAccount.Role)
	if dbUserAccount.Role == model.CUSTOMER_ROLE {
		customer, err := model.GetCustomerByUserId(fmt.Sprint(dbUserAccount.ID))
		if err != nil {
			fmt.Println("error while getting customer")
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"message": "something went wrong: " + err.Error(),
			})
		}
		sess.Set(CUSTOMER_ID, customer.ID)
	} else if dbUserAccount.Role == model.DELIVERER_ROLE {
		deliverer, err := model.GetDelivererByUserId(fmt.Sprint(dbUserAccount.ID))
		if err != nil {
			fmt.Println("error while getting deliverer", err.Error())
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"message": "something went wrong: " + err.Error(),
			})
		}
		sess.Set(DELIVERER_ID, deliverer.ID)
	} else {
		fmt.Println("error invalid role")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: invalid role",
		})
	}

	err = sess.Save()
	if err != nil {
		fmt.Println("error while saving session")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + err.Error(),
		})
	}

	fmt.Println("SUCCESS!")
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "logged in",
		"role":    dbUserAccount.Role,
	})
}

func Logout(c *fiber.Ctx) error {
	fmt.Println("\nlogout")
	sess, err := store.Get(c)
	if err != nil {
		fmt.Println("error while getting session")
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "logged out (no session)",
		})
	}

	err = sess.Destroy()
	if err != nil {
		fmt.Println("error while destroying session")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "something went wrong: " + err.Error(),
		})
	}

	fmt.Println("SUCCESS!")
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "logged out",
	})
}

func HealthCheck(c *fiber.Ctx) error {
	sess, err := store.Get(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized",
		})
	}

	auth := sess.Get(AUTH_KEY)
	if auth == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "not authorized",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "authorized",
		"role":    sess.Get(ROLE),
	})
}

type UserAccountResponse struct {
	ID       uint64 `json:"user_id"`
	Username string `json:"username"`
	Role     uint64 `json:"role"`
}

func Current(c *fiber.Ctx) error {
	fmt.Println("\ncurrent")
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
	userAccountResponse := UserAccountResponse{
		ID:       userAccount.ID,
		Username: userAccount.Username,
		Role:     userAccount.Role,
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message":      "authorized",
		"user_account": userAccountResponse,
	})
}
