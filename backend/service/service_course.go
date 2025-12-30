package service

import (
	"encoding/json"
	"errors"
	"os"

	"backend/model"
	//"golang.org/x/text/unicode/rangetable"
)

//本文件主要负责文件内容的增删查改

const Path = "data/courses.json"

// 获得所有文件
func GetAllCourses() ([]model.Course, error) {
	//读文件
	data, err := os.ReadFile(Path)
	if err != nil {
		return nil, err
	}

	var courses []model.Course
	//反序列化
	err = json.Unmarshal(data, &courses)
	if err != nil {
		return nil, err
	}

	return courses, err
}

// 按课程号查询文件
func GetCourseById(id string) (*model.Course, error) {
	courses, err := GetAllCourses()
	if err != nil {
		return nil, err
	}

	for _, course := range courses {
		if course.ID == id {
			return &course, err
		}
	}

	return nil, errors.New("未查询到相应的id")
}

// 按名字查询文件
func GetCourseByName(name string) (*model.Course, error) {
	courses, err := GetAllCourses()
	if err != nil {
		return nil, err
	}

	for _, course := range courses {
		if course.Name == name {
			return &course, err
		}
	}

	return nil, errors.New("未查询到相应的课程name")
}

// 保存文件
func SaveCourses(courses []model.Course) error {
	data, err := json.MarshalIndent(courses, "", " ")
	if err != nil {
		return err
	}

	err = os.WriteFile(Path, data, 0644)
	return err
}

// 新加课程
func AddCourse(course model.Course) error {
	courses, err := GetAllCourses()
	if err != nil {
		return err
	}

	for _, c := range courses {
		if c.ID == course.ID || c.Name == course.Name {
			return errors.New("课程序列号或名字重复，请重新输入")
		}
	}

	courses = append(courses, course)

	return SaveCourses(courses)
}

// 更新课程
func UpdateCourse(newCourse model.Course) error {
	courses, err := GetAllCourses()
	if err != nil {
		return err
	}

	nowCourse, err := GetCourseById(newCourse.ID)
	if err != nil {
		return errors.New("更新失败")
	}

	//这里可能有问题
	nowCourse = &newCourse
	errors("err!!!!!!!!!!!!!!!")

}
