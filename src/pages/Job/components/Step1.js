import React from 'react';
import { Button, Col, Form, Input, Radio, Row, Upload, Icon } from 'antd';
import InputArray from '@/components/Control/InputArray';
import InputMap from '@/components/Control/InputMap';
import request from '@/utils/request';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@Form.create()
class Step1 extends React.PureComponent {
  state = {
    selectProgram: undefined,
    fileList: [],
    uploading: false,
    jobItem: {},
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
    });
  };

  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach((file, idx) => {
      formData.append(encodeURIComponent(`files-${idx}`), file);
    });

    this.setState({
      uploading: true,
    });
    console.log('formData', formData);

    request(`/job/api/v1/job/upload_file`, {
      method: 'POST',
      body: formData,
    }).then(response => {
      // TODO 上传成功后返回资源文件在服务端的路径，再存入state中。
      const { jobItem } = this.state;
      console.log('/job/api/v1/job/upload_file response: ', response);
      const newJobItem = { ...jobItem, fileResources: [] };
      this.setState({ jobItem: newJobItem });
    });
    setTimeout(() => this.setState({ uploading: false }), 5000);
  };

  render() {
    const {
      form,
      job: { itemStep, option },
    } = this.props;
    const { uploading } = this.state;
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

    const fileProps = {
      onRemove: file => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      },
      fileList: this.state.fileList,
    };

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
          <Col span={12}>
            <Form.Item label="任务Data">
              {getFieldDecorator('data', {
                initialState: item.data,
              })(<InputMap delLabel="移除参数" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="资源文件">
              <Upload {...fileProps}>
                <Button>
                  <Icon type="upload" /> 选择资源文件
                </Button>
              </Upload>
              <Button
                type="primary"
                onClick={this.handleUpload}
                disabled={this.state.fileList.length === 0}
                loading={uploading}
              >
                {uploading ? '上传中……' : '开始上传'}
              </Button>
            </Form.Item>
          </Col>
        </Row>
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
