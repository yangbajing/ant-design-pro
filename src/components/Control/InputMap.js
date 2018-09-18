import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Icon, Input, Button } from 'antd';
import _isEqual from 'lodash/isEqual';

const InputGroup = Input.Group;

function mapToArray(defaultValue) {
  if (!defaultValue) return [];

  return Object.keys(defaultValue).map(key => ({ key, value: defaultValue[key] }));
}

class InputMap extends Component {
  state = {
    lines: mapToArray(
      this.props.defaultValue ||
        (this.props['data-__meta'] ? this.props['data-__meta'].initialState : [])
    ),
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      const lines = mapToArray(nextProps.value);
      if (!_isEqual(lines, this.state.lines)) {
        this.setState({ lines });
      }
    }
  }

  handleLineChange = (idx, typ, e) => {
    const lines = this.state.lines;
    const kv = lines[idx];
    const key = typ === 'key' ? e.target.value : kv.key;
    const value = typ === 'value' ? e.target.value : kv.value;
    lines[idx] = { key, value };
    // console.log(`handleLineChange ${idx}`, lines);
    if (this.props.onChange) {
      this.setOnChange(lines);
    }
    this.setState({ lines });
  };

  handleRemoveLine = idx => {
    let lines = this.state.lines;
    lines = lines.slice(0, idx).concat(lines.slice(idx + 1));
    this.setOnChange(lines);
    this.setState({ lines });
  };

  handleAddLine = () => {
    const lines = this.state.lines;
    lines.push({});
    // console.log('handleAddLine', this.state);
    this.setState({ lines });
  };

  setOnChange = lines => {
    const data = {};
    lines.forEach(kv => (data[kv.key] = kv.value));
    this.props.onChange(data);
  };

  render() {
    const controls = this.state.lines.map((line, idx) => (
      <div key={idx}>
        <InputGroup compact>
          <Input
            style={{ width: '40%' }}
            placeholder={this.props.keyPlaceholder}
            value={line.key}
            onChange={e => this.handleLineChange(idx, 'key', e)}
          />
          <Input
            style={{ width: '60%' }}
            placeholder={this.props.valuePlaceholder}
            value={line.value}
            onChange={e => this.handleLineChange(idx, 'value', e)}
            addonAfter={
              <Icon
                type="minus"
                theme="outlined"
                style={{ cursor: 'pointer' }}
                onClick={() => this.handleRemoveLine(idx)}
              />
            }
          />
        </InputGroup>
      </div>
    ));

    return (
      <Fragment>
        {controls}
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

InputMap.propTypes = {
  value: PropTypes.object,
  addLabel: PropTypes.any,
  delLabel: PropTypes.any,
  onChange: PropTypes.func,
};

InputMap.defaultProps = {
  keyPlaceholder: '在此输入key',
  valuePlaceholder: '在此输入value',
};

export default InputMap;
