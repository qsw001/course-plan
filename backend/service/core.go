package service

import(
	"fmt"
	
	"backend/datastruct"
	"backend/model"
)

func Schedule(courses []model.Course, totalSemester int) ([][]model.Course, int, error) {
	// 构建图
	g := datastruct.BuildGraph(courses)

	//检查是否有环
	_, err := TopoSort(g)
	if err != nil{
		return nil, 0, err
	}

	// 课程索引
	courseMap := make(map[string]model.Course)
	for _, c := range courses {
		courseMap[c.ID] = c
	}

	// 初始化可选课程（入度为0）
	available := []string{}
	for id, deg := range g.InDegree {
		if deg == 0 {
			available = append(available, id)
		}
	}

	//初步估算出最大的学分
	var totalCredit int
	for _, course := range courses{
		totalCredit += course.Credit
	}
	
	variable := GetVariable(totalSemester)

	maxCredit := totalCredit/totalSemester + variable

	plan := make([][]model.Course, 0)

	// 已修课程数
	finished := 0
	total := len(courses)

	for sem := 1; sem <= totalSemester; sem++ {
		curCredit := 0
		curSem := []model.Course{}

		// 排序available
		SortAvailable(available, courseMap)

		nextAvailable := []string{}

		for _, cid := range available {
			c := courseMap[cid]

			if curCredit + c.Credit > maxCredit {
				nextAvailable = append(nextAvailable, cid)
				continue
			}

			// 选课
			curSem = append(curSem, c)
			curCredit += c.Credit
			finished++

			// 更新图
			for _, nxt := range g.Adj[cid] {
				g.InDegree[nxt]--
				if g.InDegree[nxt] == 0 {
					nextAvailable = append(nextAvailable, nxt)
				}
			}
		}

		plan = append(plan, curSem)
		available = nextAvailable

		if finished == total {
			break
		}
	}

	maxCredit = GetMaxCredit(plan)

	if finished < total {
		fmt.Println("无法在规定学期内完成所有课程")
		return nil, maxCredit, fmt.Errorf("错误")
	}

	return plan, maxCredit, nil
}

//将可以安排的课程按专业课和核心课的顺序进行排序
func SortAvailable(ids []string, courseMap map[string]model.Course) {
	n := len(ids)

	for i := 1; i < n; i++ {
		key := ids[i]
		j := i - 1

		for j >= 0 && HigherPriority(courseMap[key], courseMap[ids[j]]) {
			ids[j+1] = ids[j]
			j--
		}

		ids[j+1] = key
	}
}

func HigherPriority(a, b model.Course) bool {
	// a 是否比 b 优先

	// 1. 核心课优先
	if a.IsCore != b.IsCore {
		return a.IsCore
	}

	// 2. 基础课其次
	if a.IsBasic != b.IsBasic {
		return a.IsBasic
	}

	// 3. 学分小的优先
	return a.Credit < b.Credit
}

func GetMaxCredit(plan [][]model.Course) int {
	var temp int
	for _, semesterCourses := range plan{
		var semesterCredit int
		for _, course := range semesterCourses{
			semesterCredit += course.Credit
		}
		if semesterCredit > temp{
			temp = semesterCredit
		}
	}
	return temp
} 

func GetVariable(totalSemester int) int {
	if totalSemester == 6 {
		return 10
	}
	if totalSemester == 8 {
		return 5
	}
	if totalSemester == 12 {
		return 3
	}
	return 12
}