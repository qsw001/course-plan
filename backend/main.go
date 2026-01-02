package main

import (
	"backend/router"
)

func main() {
	r := router.SetupRouter()

	//启动服务
	r.Run(":8080") 
}