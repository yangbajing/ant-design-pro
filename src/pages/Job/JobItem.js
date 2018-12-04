import React, { Component } from 'react';
import { Card, Divider } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import { connect } from 'dva';

@connect(({ job }) => ({
  job,
}))
export default class JobItem extends Component {
  componentDidMount() {
    const { dispatch, match } = this.props;
    if (!this.isAdd()) {
      dispatch({
        type: 'job/findItem',
        payload: match.params.jobKey,
      });
    }
  }

  isAdd = () => {
    const { match } = this.props;
    return match.params.jobKey === 'add';
  };

  render() {
    const { job, dispatch } = this.props;
    const title = this.isAdd() ? '创建作业' : '编辑作业';
    return (
      <PageHeaderWrapper title={title}>
        <Card title="作业信息">
          <Step1 job={job} dispatch={dispatch} />
        </Card>
        <Divider />
        <Card title="触发策略">
          <Step2 job={job} dispatch={dispatch} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
