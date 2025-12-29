package datastruct

import(
	"fmt"
	"backend/model"
)

//图结构
type Graph struct {
	Adj map[string][]string //邻接表
	InDegree map[string]int //入度表
}
//其中这里的Adj为键值对，key为string,value为string切片数组(课程数组)，InDegree同理

//*************************图的操作**************************//

//图的初始化

func Init() *Graph{
	return &Graph{
		Adj: make(map[string][]string),
		InDegree: make(map[string]int),
	}
}

//添加节点

func (g *Graph) AddNode(id string){
	//判断是否为空，如果为空，则添加节点(键),将值赋值为空
	if _, ok := g.Adj[id]; !ok{
		g.Adj[id] = []string{}
	}
	if _, ok := g.InDegree[id]; !ok{
		g.InDegree[id] = 0
	}
}

//添加边

func (g* Graph) AddEdge(pre, cur string){
	g.AddNode(pre)
	g.AddNode(cur)

	g.Adj[pre] = append(g.Adj[pre], cur)
	g.InDegree[cur]++
}

//获取所有顶点

func (g *Graph) GetNodes() []string{
	nodes := make([]string,0,len(g.Adj))
	for node := range g.Adj{
		nodes = append(nodes, node)
	}
	return nodes
}

//获取后继节点

func (g *Graph) GetNeighbors(node string) []string{
	return g.Adj[node]
}

//获取某节点的入度

func (g *Graph) GetIndegree(node string) int{
	return g.InDegree[node]
}

//判断边是否存在

func (g *Graph) HasEdge(pre, curr string) bool{
	for _, v := range g.Adj[pre]{
		if v == curr {
			return true
		}
	}
	return false
}

//打印图

func (g *Graph) PrintGraph() {
	fmt.Println("Graph:\n")
	for node, nodes := range g.Adj{
		fmt.Printf("%s -> %v\n",node,nodes)
	}
	fmt.Println("InDegree:",g.InDegree)
}

//图的构建

func BuildGraph(courses []model.Course) *Graph{
	g := Init()
	for _, course := range courses{
		g.AddNode(course.ID)
		for _, pre := range course.PreCourse{
			g.AddEdge(pre,course.ID)
		}
	}
	return g
}

