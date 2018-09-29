import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, DatePicker, Form, Input, Radio, Row } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(({ job }) => ({
  job,
}))
@Form.create()
class Step2 extends PureComponent {
  handleValidateForm = () => {
    const {
      form,
      dispatch,
      job: { itemStep },
    } = this.props;
    const { validateFieldsAndScroll, setFields } = form;
    validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      if (values.startTime && values.endTime && values.endTime.isBefore(values.startTime)) {
        setFields({ endTime: { errors: [new Error('终止时间不能早于开始时间')] } });
        return;
      }

      const payload = {
        trigger: {
          ...itemStep.trigger,
          ...values,
        },
      };
      dispatch({
        type: 'job/submitItemStep',
        payload,
      });
    });
  };

  render() {
    const {
      form,
      job: { itemStep, option },
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const trigger = itemStep.trigger || {};
    const triggerType = getFieldValue('triggerType');

    let triggerControl = null;
    switch (triggerType) {
      case 1:
        triggerControl = (
          <Form.Item label="日历调度表达式" extra="示例：0 0 0 * * * ?">
            {getFieldDecorator('cronExpress', {
              initialValue: trigger.cronExpress,
              rules: [{ required: true, message: '请设置日历调度表达式' }],
            })(<Input />)}
          </Form.Item>
        );
        break;
      case 2:
        triggerControl = (
          <Form.Item
            label="间隔时间"
            extra="示例：10.millis、10.seconds、10.minutes、10.hours、10.days"
          >
            {getFieldDecorator('duration', {
              initialValue: trigger.duration,
              rules: [{ required: true, message: '请设置间隔周期' }],
            })(<Input />)}
          </Form.Item>
        );
        break;
      case 3:
        triggerControl = (
          <Form.Item label="触发事件">
            {getFieldDecorator('triggerEvent', {
              initialValue: trigger.duration,
              rules: [{ required: triggerType === 3, message: '请设置触发事件名' }],
            })(<Input />)}
          </Form.Item>
        );
        break;
      default:
        break;
    }

    return (
      <Form>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="触发器key">
              {getFieldDecorator('key', {
                initialValue: trigger.key || (itemStep.item ? itemStep.item.key : ''),
                rules: [{ required: true, message: '请设置触发器key' }],
              })(<Input placeholder="触发器key，需要全局唯一" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="触发器类型">
              {getFieldDecorator('triggerType', {
                initialValue: trigger.triggerType,
                rules: [{ required: true, message: '请设置触发器类型' }],
              })(
                <RadioGroup buttonStyle="solid">
                  {(option.triggerType || []).map(opt => (
                    <RadioButton key={opt.value} value={opt.value}>
                      {opt.title}
                    </RadioButton>
                  ))}
                </RadioGroup>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>{triggerControl}</Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="开始时间">
              {getFieldDecorator('startTime', {
                initialValue: trigger.startTime ? moment(trigger.startTime) : null,
              })(
                <DatePicker
                  showTime
                  locale={locale}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="启用调度开始时间"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="终止时间">
              {getFieldDecorator('endTime', {
                initialValue: trigger.endTime ? moment(trigger.endTime) : null,
              })(
                <DatePicker
                  showTime
                  locale={locale}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="终止启用开始时间"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="描述">
              {getFieldDecorator('description', {
                initialValue: trigger.description,
              })(<Input.TextArea rows={4} />)}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" onClick={this.handleValidateForm}>
            确认
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Step2;
