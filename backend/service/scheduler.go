package service

import(
	"encoding/json"
	"os"

	"backend/model"
)

//将json文件转换为结构体

func LoadCourses(path string) ([]model.Course, error){
	//读取文件
	data, err := os.ReadFile(path)
	if err!=nil {
		return nil,err
	}

	//反序列化
	var courses []model.Course
	err = json.Unmarshal(data, &courses)
	if(err!=nil){
		return nil,err
	}

	return courses,err
}