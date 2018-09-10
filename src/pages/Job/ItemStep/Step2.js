import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import {Form, Input, Button, Select, DatePicker, Radio} from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import InputArray from '@/components/Control/InputArray';
import InputMap from '@/components/Control/InputMap';
import styles from '../style.less';

const {Option} = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({job}) => ({
  job
}))
@Form.create()
class Step2 extends PureComponent {

  handleValidateForm = () => {
    const {form, dispatch, job: {itemStep}} = this.props;
    const {validateFieldsAndScroll, setFields} = form;
    validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      if (values.startTime && values.endTime && values.endTime.isBefore(values.startTime)) {
        setFields({endTime: {errors: [new Error('终止时间不能早于开始时间')]}});
        return;
      }

      const payload = {
        trigger: {
          ...itemStep.trigger,
          ...values
        }
      };
      console.log('payload', JSON.stringify(payload));
      dispatch({
        type: 'job/submitItemStep',
        payload: payload
      });
    });
  };

  render() {
    const {form, job: {itemStep, option}} = this.props;
    const {getFieldDecorator, getFieldValue} = form;
    const trigger = itemStep.trigger || {};
    const triggerType = getFieldValue('triggerType');

    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Form.Item {...formItemLayout} label="触发器key">
            {getFieldDecorator('key', {
              initialValue: trigger.key || (itemStep.item ? itemStep.item.key : ''),
              rules: [{required: true, message: '请设置触发器key'}],
            })(
              <Input placeholder="触发器key，需要全局唯一"/>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="触发器类型">
            {getFieldDecorator('triggerType', {
              initialValue: trigger.triggerType,
              rules: [{required: true, message: '请设置触发器类型'}],
            })(
              <RadioGroup buttonStyle="solid">
                {option.triggerType.map(opt =>
                  <RadioButton key={opt.value} value={opt.value}>{opt.title}</RadioButton>)}
              </RadioGroup>
            )}
          </Form.Item>
          {1 === triggerType ?
            <Form.Item {...formItemLayout} label="日历调度表达式" extra="示例：0 0 0 * * * ?">
              {getFieldDecorator('cronExpress', {
                initialValue: trigger.cronExpress,
                rules: [{required: true, message: '请设置日历调度表达式'}]
              })(
                <Input/>
              )}
            </Form.Item>
            : null}
          {2 === triggerType ?
            <Form.Item {...formItemLayout} label="间隔时间" extra="示例：10.millis、10.seconds、10.minutes、10.hours、10.days">
              {getFieldDecorator('duration', {
                initialValue: trigger.duration,
                rules: [{required: true, message: '请设置间隔周期'}]
              })(
                <Input/>
              )}
            </Form.Item>
            : null}
          {3 === triggerType ?
            <Form.Item {...formItemLayout} label="触发事件">
              {getFieldDecorator('triggerEvent', {
                initialValue: trigger.duration,
                rules: [{required: 3 === triggerType, message: '请设置触发事件名'}]
              })(
                <Input/>
              )}
            </Form.Item>
            : null}
          <Form.Item {...formItemLayout} label="开始时间">
            {getFieldDecorator('startTime', {
              initialValue: trigger.startTime ? moment(trigger.startTime) : null,
            })(
              <DatePicker showTime
                          locale={locale}
                          format="YYYY-MM-DD HH:mm:ss"
                          placeholder="启用调度开始时间"
              />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="终止时间">
            {getFieldDecorator('endTime', {
              initialValue: trigger.endTime ? moment(trigger.endTime) : null,
            })(
              <DatePicker showTime
                          locale={locale}
                          format="YYYY-MM-DD HH:mm:ss"
                          placeholder="终止启用开始时间"
              />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="描述">
            {getFieldDecorator('description', {
              initialValue: trigger.description
            })(
              <Input.TextArea rows={4}/>
            )}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: {span: 24, offset: 0},
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
          >
            <Button type="primary" onClick={this.handleValidateForm}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

export default Step2;
