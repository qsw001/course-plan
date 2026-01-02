import { useState } from 'react';
import { Layout, Menu, Typography} from 'antd';
import { BookOutlined, CalendarOutlined, AppstoreOutlined } from '@ant-design/icons';
import { CourseTable } from './components/CourseTable';
import { PlanView } from './components/PlanView';
import './App.css';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const App = () => {
  const [selectedKey, setSelectedKey] = useState('1');
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    {
      key: '1',
      icon: <BookOutlined />,
      label: '课程管理',
    },
    {
      key: '2',
      icon: <CalendarOutlined />,
      label: '教学计划',
    },
  ];

  return (
    <Layout className="layout-container">
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        width={220}
        className='sider'
        style={{
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
          zIndex: 101
        }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <AppstoreOutlined style={{ fontSize: 24, color: '#1677ff', marginRight: collapsed ? 0 : 8 }} />
          {!collapsed && <span style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>CoursePlan</span>}
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['1']}
          selectedKeys={[selectedKey]}
          items={items}
          onClick={(e) => setSelectedKey(e.key)}
          style={{ borderRight: 0, marginTop: 16 }}
        />
      </Sider>
      <Layout>
        <Header className="site-header">
          <Title level={4} style={{ margin: 0 }}>
            {selectedKey === '1' ? '课程数据管理' : '智能教学计划生成'}
          </Title>
        </Header>
        <Content className="main-content">
          <div className="fade-in">
            {selectedKey === '1' ? <CourseTable /> : <PlanView />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
