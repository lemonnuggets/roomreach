package routes

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/session"
)

var (
	store        *session.Store
	AUTH_KEY     string = "authenticated"
	USER_ID      string = "user_id"
	ROLE         string = "role"
	CUSTOMER_ID  string = "customer_id"
	DELIVERER_ID string = "deliverer_id"
)

func InitRouter() {
	router := fiber.New()

	store = session.New(session.Config{
		CookieHTTPOnly: true,
		Expiration:     time.Hour * 5,
	})

	router.Use(NewMiddleware(), cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     "*",
		AllowHeaders:     "Access-Control-Allow-Origin, Content-Type, Origin, Accept",
	}))

	router.Post("/auth/register", Register)
	router.Post("/auth/login", Login)
	router.Post("/auth/logout", Logout)
	router.Get("/auth/current", Current)
	router.Get("/auth/healthcheck", HealthCheck)

	router.Get("/customer/current", CurrentCustomer)
	router.Get("/customer/deliverer", GetDeliverer)
	router.Get("/customer/deliveryRequests", GetCustomerDeliveryRequests)
	router.Put("/customer/deliveryRequest", CreateDeliveryRequest)
	router.Put("/customer/approveDeliveryRequest", ApproveDeliveryRequest)

	router.Get("/deliverer/current", CurrentDeliverer)
	router.Get("/deliverer/availableRequests", GetAvailableRequests)
	router.Get("/deliverer/deliveryRequests", GetDelivererDeliveryRequests)
	router.Put("/deliverer/applyForDeliveryRequest", ApplyForDeliveryRequest)
	router.Put("/deliverer/pickupDeliveryRequest", PickupDeliveryRequest)
	router.Put("/deliverer/deliverDeliveryRequest", DeliverDeliveryRequest)

	log.Fatal(router.Listen("192.168.84.152:3000"))
	// router.Listen(":3000")
	// go func() {
	// 	fmt.Println("Server starting...")
	// 	if err := router.Listen("192.168.222.57:3000"); err != nil {
	// 		fmt.Println("Error: ", err)
	// 		// os.Exit(255)
	// 	} else {
	// 		fmt.Println("Server started")
	// 	}
	// }()
	// router.Listen("172.17.76.203:3000")
}
