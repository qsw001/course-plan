package model

type Course struct {
	ID        string   `json:"id"`
	Name      string   `json:"name"`
	Credit    int      `json:"credit"`
	PreCourse []string `json:"prerequisites"`
	IsCore    bool     `json:"is_core"`
	IsBasic   bool     `json:"is_basic"`
}