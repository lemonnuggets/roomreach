# roomreach-server

## About

RoomReach is a novel service designed to enhance the package delivery experience for hostel residents on campus. We understand the challenges students face in coordinating package pickups and the time constraints involved. To address these issues, we've created a platform that allows hostel inmates to request package deliveries directly to their rooms. How does it work? Students can sign up to become Deliverers, offering their assistance in collecting and delivering packages within the hostel. When a delivery request is made, a Deliverer ensures the package reaches its destination promptly, and a small fee is charged for this convenience. The primary focus of our service is to provide an efficient and hassle-free solution that fosters a sense of community and cooperation among hostel residents. Our goal is to make hostel life more convenient and enjoyable for everyone involved.

## Schema

### User

| Field    | Type   | Description                            |
| -------- | ------ | -------------------------------------- |
| id       | Int    | Unique identifier for the user         |
| username | String | Unique username for the user           |
| password | String | Hashed password for the user           |
| role     | String | Role of the user (Customer, Deliverer) |

### Customer

| Field   | Type   | Description                        |
| ------- | ------ | ---------------------------------- |
| id      | Int    | Unique identifier for the customer |
| user_id | Int    | Foreign key referencing User(id)   |
| name    | String | Name of the customer               |
| gender  | Bit    | Gender of the customer             |
| phone   | String | Phone number of the customer       |
| block   | Char   | Block of the customer's hostel     |
| room    | Int    | Room number of the customer        |

### Deliverer

| Field   | Type   | Description                         |
| ------- | ------ | ----------------------------------- |
| id      | Int    | Unique identifier for the deliverer |
| user_id | Int    | Foreign key referencing User(id)    |
| name    | String | Name of the deliverer               |
| gender  | Bit    | Gender of the deliverer             |
| phone   | String | Phone number of the deliverer       |

### DeliveryRequest

| Field                 | Type   | Description                                   |
| --------------------- | ------ | --------------------------------------------- |
| id                    | Int    | Unique identifier for the delivery request    |
| customer_id           | Int    | Foreign key referencing Customer(id)          |
| deliverer_id          | Int    | Foreign key referencing Deliverer(id)         |
| status                | Int    | Status of the delivery request                |
| pickup_location       | String | Pickup location of the delivery request       |
| delivery_instructions | String | Delivery instructions of the delivery request |
