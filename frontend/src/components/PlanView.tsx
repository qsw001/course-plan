import { useState } from 'react';
import { Card, Radio, Button, List, Tag, Alert, Row, Col, Statistic, Empty, Typography, Divider } from 'antd';
import { DownloadOutlined, RocketOutlined, SafetyCertificateOutlined, TrophyOutlined } from '@ant-design/icons';
import { api } from '../api';
import type { Course, ScheduleResponse } from '../types';

const { Title, Text } = Typography;

export const PlanView = () => {
  const [semesterType, setSemesterType] = useState(8);
  const [plan, setPlan] = useState<ScheduleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const data = await api.getSchedule(semesterType);
      setPlan(data);
    } catch (err: any) {
        if (err.response && err.response.data && err.response.data.err) {
            setError(err.response.data.err);
        } else {
            setError('生成计划失败，可能存在环或无法满足条件');
        }
    } finally {
      setLoading(false);
    }
  };

  const downloadPlan = () => {
    if (!plan) return;
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teaching-plan-${semesterType}-semesters.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTotalCredits = () => {
    if (!plan) return 0;
    return plan.schedule.reduce((total, sem) => total + sem.reduce((acc, c) => acc + c.credit, 0), 0);
  };

  return (
    <div>
      <Card bordered={false} className="content-card" style={{ marginBottom: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2}>教学计划生成器</Title>
          <Text type="secondary">选择适合的学制，智能生成最优课程安排路径</Text>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, marginBottom: 24 }}>
          <Radio.Group 
            value={semesterType} 
            onChange={(e) => setSemesterType(e.target.value)}
            size="large"
            buttonStyle="solid"
          >
            <Radio.Button value={6}>6 学期 (紧凑)</Radio.Button>
            <Radio.Button value={8}>8 学期 (标准)</Radio.Button>
            <Radio.Button value={12}>12 学期 (宽松)</Radio.Button>
          </Radio.Group>
          
          <Button 
            type="primary" 
            size="large" 
            icon={<RocketOutlined />} 
            onClick={handleGenerate} 
            loading={loading}
            style={{ paddingLeft: 32, paddingRight: 32 }}
          >
            立即生成
          </Button>
        </div>

        {error && <Alert message="生成失败" description={error} type="error" showIcon style={{ maxWidth: 600, margin: '0 auto' }} />}
      </Card>

      {plan && (
        <div className="fade-in">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 24 }}>
            <div style={{ flex: '1 1 250px', minWidth: 0 }}>
              <Card bordered={false} className="content-card">
                <Statistic title="每学期最大推荐学分" value={plan.max_credit} prefix={<SafetyCertificateOutlined />} valueStyle={{ color: '#3f8600' }} />
              </Card>
            </div>
            <div style={{ flex: '1 1 250px', minWidth: 0 }}>
              <Card bordered={false} className="content-card">
                <Statistic title="毕业总学分" value={getTotalCredits()} prefix={<TrophyOutlined />} valueStyle={{ color: '#1677ff' }} />
              </Card>
            </div>
            <div style={{ flex: '1 1 250px', minWidth: 0 }}>
               <Card bordered={false} className="content-card" bodyStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Button type="dashed" icon={<DownloadOutlined />} size="large" onClick={downloadPlan} block>
                    导出计划文件 (JSON)
                  </Button>
               </Card>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {plan.schedule.map((semesterCourses, index) => {
               const semesterCredit = semesterCourses.reduce((acc, cur) => acc + cur.credit, 0);
               const isHeavy = semesterCredit > plan.max_credit - 2;
               
               return (
                <div key={index} style={{ flex: '1 1 300px', minWidth: 0 }}>
                  <Card 
                    title={`第 ${index + 1} 学期`} 
                    extra={<Tag color={isHeavy ? 'orange' : 'cyan'}>{semesterCredit} 学分</Tag>}
                    bordered={false}
                    className="content-card"
                    headStyle={{ borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                    bodyStyle={{ padding: '12px 16px', minHeight: 200 }}
                    hoverable
                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  >
                    <div style={{ flex: 1 }}>
                    <List
                      dataSource={semesterCourses}
                      renderItem={(course: Course) => (
                        <div style={{ 
                          marginBottom: 12, 
                          padding: 12, 
                          background: course.isCore ? '#e6f7ff' : (course.isBasic ? '#f6ffed' : '#f9f9f9'), 
                          borderRadius: 8,
                          border: '1px solid',
                          borderColor: course.isCore ? '#91caff' : (course.isBasic ? '#b7eb8f' : '#f0f0f0'),
                          position: 'relative'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{ fontWeight: 600, fontSize: 14, color: '#333' }}>{course.name}</span>
                            <Tag style={{ marginRight: 0 }}>{course.credit}</Tag>
                          </div>
                          <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666' }}>
                             <span>{course.id}</span>
                             <div>
                               {course.isCore && <Tag color="blue" style={{ margin: 0, fontSize: 10, lineHeight: '18px' }}>核心</Tag>}
                               {course.isBasic && <Tag color="green" style={{ margin: 0, marginLeft: 4, fontSize: 10, lineHeight: '18px' }}>基础</Tag>}
                             </div>
                          </div>
                        </div>
                      )}
                    />
                    {semesterCourses.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="本学期无课程" />}
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
