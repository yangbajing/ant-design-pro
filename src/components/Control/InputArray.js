import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Icon, Input, Button } from 'antd';
import _isEqual from 'lodash/isEqual';

class InputArray extends Component {
  state = {
    lines: this.props.defaultValue || [],
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.value && !_isEqual(nextProps.value, this.state.lines)) {
      this.setState({ lines: nextProps.value });
    }
  }

  handleLineChange = (idx, e) => {
    const lines = this.state.lines;
    lines[idx] = e.target.value;
    if (this.props.onChange) {
      this.props.onChange(lines);
    }
    this.setState({ lines });
  };

  handleRemoveLine = idx => {
    let lines = this.state.lines;
    lines = lines.slice(0, idx).concat(lines.slice(idx + 1));
    this.setState({ lines });
  };

  handleAddLine = () => {
    const lines = this.state.lines;
    lines.push('');
    // console.log('handleAddLine', this.state);
    this.setState({ lines });
  };

  render() {
    const lines = this.state.lines.map((line, idx) => (
      <div key={idx}>
        <Input
          value={line}
          name={`${idx}`}
          addonAfter={
            <Icon
              type="minus"
              theme="outlined"
              style={{ cursor: 'pointer' }}
              onClick={() => this.handleRemoveLine(idx)}
            />
          }
          onChange={e => this.handleLineChange(idx, e)}
        />
      </div>
    ));
    // console.log('lines', lines);
    return (
      <Fragment>
        {lines}
        <div style={{ textAlign: 'center' }}>
          <Button placeholder={this.props.placeholder} onClick={this.handleAddLine}>
            <Icon type="plus" theme="outlined" />
            {this.props.addLabel}
          </Button>
        </div>
      </Fragment>
    );
  }
}

InputArray.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  addLabel: PropTypes.any,
  delLabel: PropTypes.any,
  onChange: PropTypes.func,
};

export default InputArray;
