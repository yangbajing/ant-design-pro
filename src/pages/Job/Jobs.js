import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import {FormattedMessage} from 'umi/locale';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Jobs.less';
import {Badge, Button, Card, Col, Divider, Dropdown, Icon, Row} from "antd";
import moment from "moment";

@connect(({job, loading}) => ({
  job,
  loading: loading.models.rule,
}))
class Jobs extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'job/page',
      payload: {size: 10}
    });
  }

  columns = [
    {
      title: '任务',
      dataIndex: 'jobKey',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '服务调用次数',
      dataIndex: 'callNo',
      sorter: true,
      align: 'right',
      render: val => `${val} 万`,
      // mark to display a total number
      needTotal: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [
        {
          text: status[0],
          value: 0,
        },
        {
          text: status[1],
          value: 1,
        },
        {
          text: status[2],
          value: 2,
        },
        {
          text: status[3],
          value: 3,
        },
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]}/>;
      },
    },
    {
      title: '上次调度时间',
      dataIndex: 'updatedAt',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>
          <Divider type="vertical"/>
          <a href="">订阅警报</a>
        </Fragment>
      ),
    },
  ];

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleCreate = () => {
    router.push('/job/item-step')
  };

  render() {
    const {
      job,
      loading,
    } = this.props;
    const {selectedRows, modalVisible, updateModalVisible, stepFormValues} = this.state;

    const Info = ({title, value, bordered}) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em/>}
      </div>
    );

    console.log('job', job);

    const data = [];

    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="总任务" value="8个任务" bordered/>
              </Col>
              <Col sm={8} xs={24}>
                <Info title="本周任务平均执行时间" value="32分钟" bordered/>
              </Col>
              <Col sm={8} xs={24}>
                <Info title="本周已执行任务次数" value="24个任务"/>
              </Col>
            </Row>
          </Card>

          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={() => this.handleCreate()}>
                  新建
                </Button>
                {selectedRows.length > 0 && (
                  <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down"/>
                    </Button>
                  </Dropdown>
                </span>
                )}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                columns={this.columns}
                data={data}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
        </div>
      </PageHeaderWrapper>
    )
  }
}

export default Jobs;
