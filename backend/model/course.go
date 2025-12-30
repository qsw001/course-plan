package model

type Course struct {
	ID        string   `json:"id"`
	Name      string   `json:"name"`
	Credit    int      `json:"credit"`
	PreCourse []string `json:"preCourse"`
	IsCore    bool     `json:"isCore"`
	IsBasic   bool     `json:"isBasic"`
}

