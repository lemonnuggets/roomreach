package model

import "fmt"

type Deliverer struct {
	ID     uint64 `json:"id"`
	UserID uint64 `json:"user_id"`
	Name   string `json:"name"`
	Gender string `json:"gender"`
	Phone  string `json:"phone"`
}

func CreateDeliverer(deliverer *Deliverer, userAccount *UserAccount) (string, error) {
	tx, err := db.Begin()
	if err != nil {
		return "", err
	}
	newUserAccountId, err := CreateUserAccount(userAccount)
	if err != nil {
		tx.Rollback()
		return "", err
	}

	statement := `insert into deliverer (user_id, name, gender, phone) values ($1, $2, $3, $4) returning id;`
	err = db.QueryRow(statement, newUserAccountId, deliverer.Name, deliverer.Gender, deliverer.Phone).Scan(&deliverer.ID)
	if err != nil {
		tx.Rollback()
		return "", err
	}

	err = tx.Commit()
	if err != nil {
		return "", err
	}
	return fmt.Sprint(deliverer.ID), nil
}

func GetDeliverer(id string) (Deliverer, error) {
	var deliverer Deliverer

	statement := `select id, user_id, name, gender, phone from deliverer where id = $1;`

	err := db.QueryRow(statement, id).Scan(&deliverer.ID, &deliverer.UserID, &deliverer.Name, &deliverer.Gender, &deliverer.Phone)
	return deliverer, err
}

func GetDelivererByUserId(userId string) (Deliverer, error) {
	var deliverer Deliverer

	statement := `select id, user_id, name, gender, phone from deliverer where user_id = $1;`

	err := db.QueryRow(statement, userId).Scan(&deliverer.ID, &deliverer.UserID, &deliverer.Name, &deliverer.Gender, &deliverer.Phone)
	return deliverer, err
}
