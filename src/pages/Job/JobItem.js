import React, { PureComponent } from 'react';
import { Card, Divider } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Step1 from './components/Step1';
import Step2 from './components/Step2';

export default class JobItem extends PureComponent {
  isAdd = () => {
    const { match } = this.props;
    return match.params.jobKey === 'add';
  };

  render() {
    const title = this.isAdd() ? '创建作业' : '编辑作业';
    return (
      <PageHeaderWrapper title={title}>
        <Card title="作业信息">
          <Step1 />
        </Card>
        <Divider />
        <Card title="触发策略">
          <Step2 />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
