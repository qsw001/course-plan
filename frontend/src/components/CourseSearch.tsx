import { useState } from 'react';
import { Input, Radio, Button, Card, Descriptions, Tag, Alert, Space, Typography, Empty, Spin } from 'antd';
import { SearchOutlined, BookOutlined } from '@ant-design/icons';
import { api } from '../api';
import type { Course } from '../types';

const { Title } = Typography;
const { Search } = Input;

export const CourseSearch = () => {
  const [searchType, setSearchType] = useState<'id' | 'name'>('id');
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const onSearch = async (value: string) => {
    if (!value.trim()) return;
    
    setLoading(true);
    setError(null);
    setCourse(null);
    setHasSearched(true);

    try {
      let result;
      if (searchType === 'id') {
        result = await api.getCourseById(value);
      } else {
        result = await api.getCourseByName(value);
      }
      setCourse(result);
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setError('未找到该课程，请检查输入是否正确');
      } else {
        setError('查询出错，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card bordered={false} className="content-card" style={{ marginBottom: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2}>课程查询</Title>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <Radio.Group 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="id">按课程代码查询</Radio.Button>
            <Radio.Button value="name">按课程名称查询</Radio.Button>
          </Radio.Group>

          <Search
            placeholder={searchType === 'id' ? "请输入课程代码 (如: CS101)" : "请输入课程名称 (如: 程序设计基础)"}
            allowClear
            enterButton={<Button type="primary" icon={<SearchOutlined />}>查询</Button>}
            size="large"
            onSearch={onSearch}
            style={{ maxWidth: 500, width: '100%' }}
          />
        </div>
      </Card>

      <div className="fade-in">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : error ? (
          <Alert
            message="查询失败"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        ) : course ? (
          <Card 
            title={
              <Space>
                <BookOutlined style={{ color: '#1677ff' }} />
                <span>课程详情</span>
              </Space>
            }
            bordered={false} 
            className="content-card"
          >
            <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
              <Descriptions.Item label="课程代码">
                <Tag color="geekblue" style={{ fontSize: 16, padding: '4px 10px' }}>{course.id}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="课程名称">
                <span style={{ fontWeight: 600, fontSize: 16 }}>{course.name}</span>
              </Descriptions.Item>
              <Descriptions.Item label="学分">
                <Tag color="gold" style={{ fontSize: 14 }}>{course.credit} 学分</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="课程属性">
                <Space>
                  {course.isCore && <Tag color="blue">核心课程</Tag>}
                  {course.isBasic && <Tag color="green">基础课程</Tag>}
                  {!course.isCore && !course.isBasic && <Tag>选修课程</Tag>}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="先修课程" span={2}>
                {course.preCourse && course.preCourse.length > 0 ? (
                  <Space wrap>
                    {course.preCourse.map(pre => (
                      <Tag key={pre}>{pre}</Tag>
                    ))}
                  </Space>
                ) : (
                  <span style={{ color: '#999' }}>无先修课程</span>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        ) : hasSearched ? (
           <Empty description="未找到相关课程" style={{ marginTop: 40 }} />
        ) : null}
      </div>
    </div>
  );
};