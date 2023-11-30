package model

import "fmt"

type Customer struct {
	ID     uint64 `json:"id"`
	UserID uint64 `json:"user_id"`
	Name   string `json:"name"`
	Gender string `json:"gender"`
	Phone  string `json:"phone"`
	Block  string `json:"block"`
	Room   uint64 `json:"room"`
}

func CreateCustomer(customer *Customer, userAccount *UserAccount) (string, error) {
	// TODO: Find why transaction rollback is not working
	tx, err := db.Begin()
	if err != nil {
		return "", err
	}
	newUserAccountId, err := CreateUserAccount(userAccount)
	if err != nil {
		tx.Rollback()
		return "", err
	}

	statement := `insert into customer (user_id, name, gender, phone, block, room) values ($1, $2, $3, $4, $5, $6) returning id;`
	err = db.QueryRow(statement, newUserAccountId, customer.Name, customer.Gender, customer.Phone, customer.Block, customer.Room).Scan(&customer.ID)
	if err != nil {
		tx.Rollback()
		return "", err
	}

	err = tx.Commit()
	if err != nil {
		return "", err
	}
	return fmt.Sprint(customer.ID), nil
}

func GetCustomer(id string) (Customer, error) {
	var customer Customer

	statement := `select id, user_id, name, gender, phone, block, room from customer where id = $1;`

	err := db.QueryRow(statement, id).Scan(&customer.ID, &customer.UserID, &customer.Name, &customer.Gender, &customer.Phone, &customer.Block, &customer.Room)
	return customer, err
}

func GetCustomerByUserId(userId string) (Customer, error) {
	var customer Customer

	statement := `select id, user_id, name, gender, phone, block, room from customer where user_id = $1;`

	err := db.QueryRow(statement, userId).Scan(&customer.ID, &customer.UserID, &customer.Name, &customer.Gender, &customer.Phone, &customer.Block, &customer.Room)
	return customer, err
}
