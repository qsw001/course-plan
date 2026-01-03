import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Switch, message, Select, Tag, Card, Row, Col, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, BookOutlined } from '@ant-design/icons';
import type { Course } from '../types';
import { api } from '../api';

export const CourseTable = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await api.getAllCourses();
      setCourses(data);
      setFilteredCourses(data);
    } catch (error) {
      message.error('获取课程列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const lower = searchText.toLowerCase();
    const filtered = courses.filter(c => 
      c.name.toLowerCase().includes(lower) || 
      c.id.toLowerCase().includes(lower)
    );
    setFilteredCourses(filtered);
  }, [searchText, courses]);

  const handleAdd = () => {
    setEditingCourse(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: Course) => {
    setEditingCourse(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteCourse(id);
      message.success('删除成功');
      fetchCourses();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingCourse) {
        await api.updateCourse({ ...values, id: editingCourse.id });
        message.success('修改成功');
      } else {
        await api.addCourse(values);
        message.success('添加成功');
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns = [
    {
      title: '课程代码',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (text: string) => <Tag>{text}</Tag>
    },
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>
    },
    {
      title: '学分',
      dataIndex: 'credit',
      key: 'credit',
      width: 80,
      align: 'center' as const,
    },
    {
      title: '先修课程',
      dataIndex: 'preCourse',
      key: 'preCourse',
      render: (preCourse: string[]) => (
        <Space size={[0, 4]} wrap>
          {preCourse && preCourse.length > 0 ? (
            preCourse.map((courseId) => (
              <Tag key={courseId} color="default">{courseId}</Tag>
            ))
          ) : <span style={{ color: '#ccc' }}>无</span>}
        </Space>
      ),
    },
    {
      title: '属性',
      key: 'attributes',
      width: 150,
      render: (_: any, record: Course) => (
        <Space>
          {record.isCore && <Tag color="blue" bordered={false}>核心</Tag>}
          {record.isBasic && <Tag color="green" bordered={false}>基础</Tag>}
          {!record.isCore && !record.isBasic && <Tag color="default" bordered={false}>必修</Tag>}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: Course) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ color: '#1677ff' }} />
          </Tooltip>
          <Tooltip title="删除">
            <Button type="text" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="content-card">
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
           <Input 
             placeholder="搜索课程名或代码..." 
             prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
             style={{ width: 250 }}
             allowClear
             value={searchText}
             onChange={e => setSearchText(e.target.value)}
           />
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
            新建课程
          </Button>
        </Col>
      </Row>

      <Table 
        columns={columns} 
        dataSource={filteredCourses} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: true }} 
      />

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOutlined /> {editingCourse ? '编辑课程' : '添加课程'}
          </div>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="id"
                label="课程代码"
                rules={[{ required: true, message: '请输入课程代码' }]}
              >
                <Input disabled={!!editingCourse} placeholder="例如：CS101" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="credit"
                label="学分"
                rules={[{ required: true, message: '请输入学分' }]}
              >
                <InputNumber min={1} max={10} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="name"
            label="课程名称"
            rules={[{ required: true, message: '请输入课程名称' }]}
          >
            <Input placeholder="例如：程序设计基础" />
          </Form.Item>
          
          <Form.Item
            name="preCourse"
            label="先修课程"
            tooltip="必须先修完这些课程才能学习本课程"
          >
            <Select mode="multiple" allowClear placeholder="选择先修课程">
              {courses.filter(c => c.id !== editingCourse?.id).map(c => (
                <Select.Option key={c.id} value={c.id}>{c.name} ({c.id})</Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
               <Form.Item name="isCore" valuePropName="checked" label="核心课程" style={{ marginBottom: 0 }}>
                <Switch checkedChildren="是" unCheckedChildren="否" />
              </Form.Item>
            </Col>
            <Col span={12}>
               <Form.Item name="isBasic" valuePropName="checked" label="基础课程" style={{ marginBottom: 0 }}>
                <Switch checkedChildren="是" unCheckedChildren="否" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
