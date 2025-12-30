package service

import(
	"fmt"
	
	"backend/datastruct"
	"backend/model"
)

func Schedule(courses []model.Course, totalSemester int) ([][]model.Course, int, error) {
 
	// 课程索引
	courseMap := make(map[string]model.Course)
	for _, c := range courses {
		courseMap[c.ID] = c
	}

	// 构建图
	g := datastruct.BuildGraph(courses)

	// 初始化可选课程（入度为0）
	available := []string{}
	for id, deg := range g.InDegree {
		if deg == 0 {
			available = append(available, id)
		}
	}

	plan := make([][]model.Course, 0)

	// 已修课程数
	finished := 0
	total := len(courses)

	for sem := 1; sem <= totalSemester; sem++ {
		curCredit := 0
		curSem := []model.Course{}

		// 排序 available（策略）
		sortAvailable(available, courseMap)

		nextAvailable := []string{}

		for _, cid := range available {
			c := courseMap[cid]

			if curCredit+c.Credit > maxCredit {
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

	if finished < total {
		return nil, fmt.Errorf("无法在规定学期内完成所有课程")
	}

	return plan, nil
}

func sortAvailable(ids []string, courseMap map[string]model.Course) {
	n := len(ids)

	for i := 1; i < n; i++ {
		key := ids[i]
		j := i - 1

		for j >= 0 && higherPriority(courseMap[key], courseMap[ids[j]]) {
			ids[j+1] = ids[j]
			j--
		}

		ids[j+1] = key
	}
}

func higherPriority(a, b model.Course) bool {
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