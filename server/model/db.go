package model

import (
	"database/sql"

	_ "github.com/lib/pq"
)

var db *sql.DB

func InitDB() {
	var err error
	db, err = sql.Open("postgres", "host=localhost port=5432 user=postgres password=utilize-trustable-portly dbname=room_reach sslmode=disable")
	if err != nil {
		panic(err)
	}

	if err = db.Ping(); err != nil {
		panic(err)
	}
}
