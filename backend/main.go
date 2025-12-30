package main

//import "github.com/gin-gonic/gin"

import (
	"fmt"

	"backend/datastruct"
	//"backend/model"
	"backend/service"
)

func main() {
	// // router := gin.Default()
	// // router.GET("/ping", func(c *gin.Context) {
	// // 	c.JSON(200, gin.H{
	// // 		"message": "pong",
	// // 	})
	// // })
	// // router.Run()

	// courses, err := service.LoadCourses("data/courses.json")
	// if err!=nil{
	// 	panic(err)
	// }

	// // for _, course := range courses{
	// // 	fmt.Printf("%+v\n",course)
	// // }

	// g := datastruct.BuildGraph(courses)
	// fmt.Printf("%+v\n",g)

	// results ,_ := service.TopoSort(g)
	// fmt.Printf("%+v\n",results)
}
