package model

import "fmt"

type UserAccount struct {
	ID       uint64 `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	Role     uint64 `json:"role"`
}

var (
	CUSTOMER_ROLE  uint64 = 1
	DELIVERER_ROLE uint64 = 2
)

func CreateUserAccount(userAccount *UserAccount) (string, error) {
	statement := `insert into user_account (username, password, role) values ($1, $2, $3) returning id;`

	var id uint64
	err := db.QueryRow(statement, userAccount.Username, userAccount.Password, userAccount.Role).Scan(&id)
	if err != nil {
		return "", err
	}

	return fmt.Sprint(id), nil
}

func GetUserAccount(id string) (UserAccount, error) {
	var userAccount UserAccount

	statement := `select id, username, password, role from user_account where id = $1;`

	err := db.QueryRow(statement, id).Scan(&userAccount.ID, &userAccount.Username, &userAccount.Password, &userAccount.Role)

	return userAccount, err
}

func CheckUsername(username string, userAccount *UserAccount) bool {
	statement := `select id, username, password, role from user_account where username = $1;`

	err := db.QueryRow(statement, username).Scan(&userAccount.ID, &userAccount.Username, &userAccount.Password, &userAccount.Role)

	return err == nil
}
