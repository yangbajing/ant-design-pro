import React, { PureComponent } from 'react';
import { Card, Steps } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../style.less';

const { Step } = Steps;

export default class ItemStep extends PureComponent {
  getCurrentStep = pathname => {
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'item':
        return 0;
      case 'trigger':
        return 1;
      case 'result':
        return 2;
      default:
        return 0;
    }
  };

  render() {
    const { location, children } = this.props;

    return (
      <PageHeaderWrapper title="创建任务" tabActiveKey={location.pathname}>
        <Card>
          <Steps current={this.getCurrentStep(location.pathname)} className={styles.steps}>
            <Step title="配置调度任务" />
            <Step title="配置触发策略" />
            <Step title="完成" />
          </Steps>
          {children}
        </Card>
      </PageHeaderWrapper>
    );
  }
}
