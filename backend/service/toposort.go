package service

import (
	"backend/datastruct"
	"errors"
	//"backend/model"
)

func TopoSort(g *datastruct.Graph) ([]string, error) {
	//初始化toposort的入度表
	indeg := make(map[string]int)
	for k, v := range g.InDegree{
		indeg[k] = v
	}
	
	//初始化队列，将所有入度未0的节点加入队列中
	queue := []string{}
	for node, deg := range indeg{
		if deg == 0{
			queue = append(queue, node)
		}
	}

	//初始化结果切片数组
	results := []string{}

	//通过广度优先搜索来遍历实现拓扑排序
	for len(queue)>0 {
		cur := queue[0]
		queue = queue[1:]	//模拟队列出队
		
		//将当前节点加入结果数组中
		results = append(results, cur)

		//遍历当前节点的邻接节点，将他们的度数减一，并将度数为0的节点入队
		for _, next := range g.Adj[cur] {
			indeg[next]--
			if indeg[next] == 0{
				queue = append(queue, next)
			}
		}
	}

	//判断图中是否存在环
	if len(results) != len(g.Adj){
		return nil, errors.New("当前图存在环结构，拓扑排序无法生成")
	}

	return results, nil
}