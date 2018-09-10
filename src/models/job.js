import {routerRedux} from 'dva/router';
import { message } from 'antd';
import {queryPageJob, createJob, queryOptionAll} from '@/services/job';

export default {
  namespace: 'job',

  state: {
    page: {},
    itemStep: {item: {}, trigger: {}}
  },

  effects: {
    * page({payload}, {call, put}) {
      const response = yield call(queryPageJob, payload);
      yield put({
        type: 'queryPage',
        payload: response || {}
      })
    },
    * fetchOptionAll({}, {call, put}) {
      const resp = yield call(queryOptionAll);
      yield put({
        type: 'optionAll',
        payload: resp || {}
      })
    },
    * submitItemStep({payload}, {call, put, select}) {
      yield put({
        type: 'saveItemStep',
        payload
      });
      const itemStep = yield select(state => state.job.itemStep);
      const resp = yield call(createJob, itemStep);
      message.success('创建作业成功');
      yield put(routerRedux.push('/job/item-step/result'));
    }
  },

  reducers: {
    queryPage(state, {payload}) {
      return {
        ...state,
        page: payload,
      };
    },
    optionAll(state, {payload}) {
      const option = {
        program: payload.program.filter(item => item.value !== 0),
        triggerType: payload.triggerType.filter(item => item.value !== 0),
        programVersion: payload.programVersion.reduce((obj, item) => {
          obj[item.programId] = item.versions;
          return obj;
        }, {}),
      };
      return {
        ...state,
        option
      };
    },
    saveItemStep(state, {payload}) {
      return {
        ...state,
        itemStep: {
          ...state.itemStep,
          ...payload
        }
      };
    }
  },
};
