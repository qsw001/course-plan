package router

import (
	"backend/handler"

	"github.com/gin-gonic/gin"
)

//采用restful分格的api即
//GET：获取资源
//POST：创建资源
//PUT：更新资源
//DELETE：删除资源

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// CORS Middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	r.GET("/courses", handler.GetAllCourses)
	r.GET("/courses/id/:id", handler.GetCourseById)
	r.GET("/courses/name/:name", handler.GetCourseByName)

	r.POST("/courses", handler.AddCourse)
	r.PUT("/courses", handler.UpdateCourse)
	r.DELETE("/courses/id/:id", handler.DeleteCourse)

	r.GET("/schedule/:semester", handler.Schedule)

	return r
}
