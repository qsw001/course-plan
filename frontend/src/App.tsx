import { useState } from 'react';
import { Layout, Menu, theme, Typography, ConfigProvider } from 'antd';
import { BookOutlined, CalendarOutlined, AppstoreOutlined, SearchOutlined } from '@ant-design/icons';
import { CourseTable } from './components/CourseTable';
import { PlanView } from './components/PlanView';
import { CourseSearch } from './components/CourseSearch';
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
    {
      key: '3',
      icon: <SearchOutlined />,
      label: '课程查询',
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <CourseTable />;
      case '2':
        return <PlanView />;
      case '3':
        return <CourseSearch />;
      default:
        return <CourseTable />;
    }
  };

  const getTitle = () => {
    switch (selectedKey) {
      case '1':
        return '课程数据管理';
      case '2':
        return '智能教学计划生成';
      case '3':
        return '课程详细查询';
      default:
        return '课程数据管理';
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
          fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        },
      }}
    >
      <Layout className="layout-container">
        <Sider 
          collapsible 
          collapsed={collapsed} 
          onCollapse={(value) => setCollapsed(value)}
          theme="light"
          width={220}
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
              {getTitle()}
            </Title>
          </Header>
          <Content className="main-content">
            <div className="fade-in">
              {renderContent()}
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
