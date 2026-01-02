package handler

import (
	"net/http"
	"strconv"
	"github.com/gin-gonic/gin"

	"backend/model"
	"backend/service"
)

//需要这些api
//*******************************
//1.浏览所有课程
//2.查询课程id/name
//3.更新课程
//4.删除课程
//5.添加课程
//*******************************
//6.按学期对课程进行排序

func GetAllCourses(c* gin.Context) {
	courses, err := service.GetAllCourses()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":"无法获取课程列表"})
		return 
	}

	c.JSON(http.StatusOK, courses)
}

func GetCourseById(c *gin.Context) {
	id := c.Param("id")
	course, err := service.GetCourseById(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error":"未找到相应的课程，请重新输入"})
		return
	}

	c.JSON(http.StatusOK,course)
}

func GetCourseByName(c *gin.Context) {
	name := c.Param("name")
	course, err := service.GetCourseByName(name)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error":"未找到相应的课程，请重新输入"})
		return
	}

	c.JSON(http.StatusOK,course)
}

func UpdateCourse(c *gin.Context) {
	var course model.Course
	err := c.ShouldBindJSON(&course)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"err":err.Error()})
		return
	}

	err = service.UpdateCourse(course)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"err":err.Error()})
		return
	}

	c.JSON(http.StatusOK,gin.H{"message":"修改成功"})
}

func DeleteCourse(c *gin.Context) {
	id := c.Param("id")
	err := service.DeleteCourse(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"err":"未找到要删除的课程"})
		return 
	}

	c.JSON(http.StatusOK, gin.H{"message":"删除成功"})
}

func AddCourse(c *gin.Context) {
	var course model.Course
	err := c.ShouldBindJSON(&course)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"err":err.Error()})
		return 
	}

	err = service.AddCourse(course)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"err":err.Error()})
		return
	}

	c.JSON(http.StatusOK,gin.H{"message":"添加成功"})
}

func Schedule(c *gin.Context) {
	//获取学期，从前端返回
	totalSemester, _ := strconv.Atoi(c.Param("semester"))
	//获取课程，从文件读取
	courses, err := service.LoadCourses("data/courses.json")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"err":"文件读取失败"})
		return
	}

	sortCourses, credit, err := service.Schedule(courses, totalSemester)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"err":err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"max_credit": credit,
		"schedule":   sortCourses,
	})
}