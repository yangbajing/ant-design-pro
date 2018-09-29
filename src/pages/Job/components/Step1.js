import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Radio, Row } from 'antd';
import InputArray from '@/components/Control/InputArray';
import InputMap from '@/components/Control/InputMap';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(({ job }) => ({
  job,
}))
@Form.create()
class Step1 extends Component {
  state = {
    selectProgram: undefined,
  };

  handleProgramChange = e => {
    const { value } = e.target;
    const { selectProgram } = this.state;
    const { job, form } = this.props;
    const programVersion = job.option.programVersion || {};
    if (selectProgram !== value) {
      const versions = programVersion[value];
      if (versions && versions[0]) {
        form.setFieldsValue({ programVersion: versions[0].value });
      }
      this.setState({ selectProgram: value });
    }
  };

  handleValidateForm = () => {
    const {
      form,
      dispatch,
      job: { itemStep },
    } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (err) {
        return;
      }

      const payload = {
        item: {
          ...itemStep.item,
          ...values,
          resources: itemStep.item.resources || {},
          data: itemStep.item.data || {},
          programOptions: values.programOptions || [],
          programArgs: values.programArgs || [],
        },
      };
      dispatch({
        type: 'job/saveItemStep',
        payload,
      });
      // router.push('/job/item-step/trigger');
    });
  };

  render() {
    const {
      form,
      job: { itemStep, option },
    } = this.props;
    if (!option.programVersion) {
      return <div />;
    }
    const { selectProgram } = this.state;
    const { getFieldDecorator } = form;
    const item = itemStep.item || {};

    const programVersionDecorator = getFieldDecorator('programVersion', {
      initialValue: item.programVersion,
      rules: [{ required: true, message: '请选择任务执行程序版本' }],
    })(
      <RadioGroup buttonStyle="solid">
        {(option.programVersion[selectProgram] || []).map(opt => (
          <RadioButton key={opt.value} value={opt.value}>
            {opt.title}
          </RadioButton>
        ))}
      </RadioGroup>
    );

    return (
      <Form>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="任务key">
              {getFieldDecorator('key', {
                initialValue: item.key,
                rules: [{ required: true, message: '请设置任务key' }],
              })(<Input placeholder="任务key，需要全局唯一" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="程序主类/文件">
              {getFieldDecorator('programMain', {
                initialValue: item.programMain,
                rules: [{ required: true, message: '请输入程序主类或可执行主文件名' }],
              })(<Input placeholder="程序主类或可执行主文件名" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="程序类型">
              {getFieldDecorator('program', {
                initialValue: item.program,
                rules: [{ required: true, message: '请选择任务执行程序类型' }],
              })(
                <RadioGroup buttonStyle="solid" onChange={this.handleProgramChange}>
                  {option.program.map(opt => (
                    <RadioButton key={opt.value} value={opt.value}>
                      {opt.title}
                    </RadioButton>
                  ))}
                </RadioGroup>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="程序版本">{programVersionDecorator}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="程序选项">
              {getFieldDecorator('programOptions', {
                initialValue: item.programOptions,
              })(<InputArray delLabel="移除选项" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="程序参数">
              {getFieldDecorator('programArgs', {
                initialValue: item.programArgs,
              })(<InputArray delLabel="移除参数" />)}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="任务Data">
          {getFieldDecorator('data', {
            initialState: item.data,
          })(<InputMap delLabel="移除参数" />)}
        </Form.Item>
        <Form.Item label="描述">
          {getFieldDecorator('description', {
            initialValue: item.description,
          })(<Input.TextArea rows={4} />)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={this.handleValidateForm}>
            确认
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Step1;
