package main

//import "github.com/gin-gonic/gin"

import(
	"fmt"

	"backend/model"
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

	// courses, err := service.LoadCourses("data/courses.json")
	// if err!=nil{
	// 	panic(err)
	// }

	// for _, course := range courses{
	// 	fmt.Printf("%+v\n",course)
	// }

		// 新增课程
	service.AddCourse(model.Course{
		ID:        "CS501",
		Name:      "操作系统",
		Credit:    4,
		PreCourse: []string{"CS201"},
		IsCore:    true,
		IsBasic:   false,
	})

	// 查询
	courses, _ := service.GetAllCourses()
	fmt.Println(len(courses))

	// 删除
	service.DeleteCourse("CS301")
}
