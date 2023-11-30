package main

import (
	"github.com/lemonnuggets/roomreach-server/model"
	"github.com/lemonnuggets/roomreach-server/routes"
)

func main() {
	model.InitDB()
	routes.InitRouter()
}
