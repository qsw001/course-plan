package main

import (
	"fmt"
	"github.com/gin-gonic/gin"

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

	c, credit, _ := service.Schedule(courses,12)
	for a, b := range c{
		fmt.Printf("%v:",a)
		fmt.Printf("%v:",credit)
		fmt.Printf("%+v\n",b)
	}
}
