import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';

@connect(({ job }) => ({
  job,
}))
class Step3 extends PureComponent {
  render() {
    const { job } = this.props;

    return (
      <Fragment>
        <h1>{JSON.stringify(job.job)}</h1>
      </Fragment>
    );
  }
}

export default Step3;
