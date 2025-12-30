package main

//import "github.com/gin-gonic/gin"

import (
	"fmt"

	//"backend/datastruct"
	//"backend/model"
	"backend/service"
)

func main() {
	// router := gin.Default()
	// router.GET("/ping", func(c *gin.Context) {
	// 	c.JSON(200, gin.H{
	// 		"message": "pong",
	// 	})
	// })
	// router.Run()

	courses, err := service.LoadCourses("data/courses.json")
	if err!=nil{
		panic(err)
	}

	// for _, course := range courses{
	// 	fmt.Printf("%+v\n",course)
	// }

	c, _ := service.Schedule(courses,8,16)
	for a, b := range c{
		fmt.Printf("%v:",a)
		fmt.Printf("%+v\n",b)
	}
}
