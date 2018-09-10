import React, {Fragment, PureComponent} from 'react';
import {Select} from 'antd';
import {connect} from 'dva';

@connect(({job}) => ({
  job
}))
export default class Step3 extends PureComponent {

  render() {
    const {job} = this.props;

    return (
      <Fragment>
        <h1>{JSON.stringify(job.itemStep)}</h1>
      </Fragment>
    );
  }

}
