package handler

import(
	"github.com/gin-gonic/gin"
	"fmt"
	"net/http"

	"backend/service"
	"backend/datastruct"
	"backend/model"
)

//需要这些api
//*******************************
//1.浏览所有课程
//2.查询课程id/name
//3.修改课程
//4.删除课程
//5.添加课程
//6.更新课程
//*******************************
//7.按学期对课程进行排序

func GetAllCourses(c* gin.Context){
	
}