package service

import(
	"os"
	"encoding/json"
	"errors"

	"backend/model"
)

//本文件主要负责文件内容的增删查改

const Path = "data/courses.json"

//获得所有文件
func GetAllCourses() ([]model.Course, error){
	//读文件
	data, err := os.ReadFile(Path)
	if err!=nil{
		return nil,err
	}

	var courses []model.Course
	//反序列化
	err = json.Unmarshal(data,&courses)
	if err!=nil{
		return nil,err
	}

	return courses,err
}

//按课程号查询文件
func GetCourseById(id string) (*model.Course, error){

}