import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Button, Card, Col, Divider, Dropdown, Icon, Row } from 'antd';
import moment from 'moment';
import styles from './Jobs.less';

@connect(({ job, loading }) => ({
  job,
  loading: loading.models.rule,
}))
class Jobs extends Component {
  state = {
    // modalVisible: false,
    // updateModalVisible: false,
    // expandForm: false,
    selectedRows: [],
    // formValues: {},
    // stepFormValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'job/page',
      payload: {
        size: 10,
      },
    });
  }

  /**
   * @param option Job配置
   * @returns {*[]}
   */
  columns = option => [
    {
      title: '任务',
      dataIndex: 'key',
    },
    {
      title: '描述',
      dataIndex: 'config.description',
    },
    {
      title: '服务调用次数',
      dataIndex: 'scheduleCount',
      sorter: true,
      align: 'right',
      // render: val => `${val} 万`,
      // mark to display a total number
      needTotal: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: v => {
        const status = option.jobStatus.find(s => s.value === v);
        return <span>{status ? status.title : v}</span>;
      },
    },
    {
      title: '上次调度时间',
      dataIndex: 'lastScheduledAt',
      sorter: true,
      render: val => <span>{val ? moment(val).format('YYYY-MM-DD hh:mm:ss Z') : ''}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>
          <Divider type="vertical" />
          <a href="">订阅警报</a>
        </Fragment>
      ),
    },
  ];

  // handleModalVisible = flag => {
  //   this.setState({
  //     modalVisible: !!flag,
  //   });
  // };

  handleUpdateModalVisible = () => {
    // this.setState({
    // updateModalVisible: !!flag,
    // stepFormValues: record || {},
    // });
  };

  handleCreate = () => {
    router.push('/job/item-step');
  };

  render() {
    const {
      loading,
      job: { page, option },
    } = this.props;
    const { selectedRows } = this.state;

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const list = page.content || [];
    /*
    .map(item => {
      return {
        ...item,
      };
    });
    */
    const data = { list };

    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="总任务" value="8个任务" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="本周任务平均执行时间" value="32分钟" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="本周已执行任务次数" value="24个任务" />
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
                    <Dropdown>
                      <Button>
                        更多操作 <Icon type="down" />
                      </Button>
                    </Dropdown>
                  </span>
                )}
              </div>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                columns={this.columns(option)}
                data={data}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Jobs;
