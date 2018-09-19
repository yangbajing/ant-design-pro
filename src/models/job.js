import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { queryPageJob, createJob, queryOptionAll } from '@/services/job';

export default {
  namespace: 'job',

  state: {
    page: {},
    itemStep: { item: {}, trigger: {} },
    option: {},
  },

  effects: {
    *page({ payload }, { call, put }) {
      const resp = yield call(queryPageJob, payload);
      yield put({
        type: 'queryPage',
        payload: resp || {},
      });
    },
    *fetchOptionAll(args, { call, put }) {
      const resp = yield call(queryOptionAll, {});
      yield put({
        type: 'saveOptionAll',
        payload: resp || {},
      });
    },
    *submitItemStep({ payload }, { call, put, select }) {
      yield put({
        type: 'saveItemStep',
        payload,
      });
      const itemStep = yield select(state => state.job.itemStep);
      const resp = yield call(createJob, itemStep);
      message.success('创建作业成功');
      yield put({
        type: 'saveJob',
        payload: resp,
      });
      yield put(routerRedux.push('/job/item-step/result'));
    },
  },

  reducers: {
    queryPage(state, { payload }) {
      return {
        ...state,
        page: payload,
      };
    },
    saveOptionAll(state, { payload }) {
      const option = {
        ...payload,
        programVersion: payload.programVersion.reduce((obj, item) => {
          const o = { ...obj };
          o[item.programId] = item.versions;
          return o;
        }, {}),
      };
      return {
        ...state,
        option,
      };
    },
    saveJob(state, { payload }) {
      return {
        ...state,
        job: {
          ...state.job,
          ...payload,
        },
      };
    },
    saveItemStep(state, { payload }) {
      return {
        ...state,
        itemStep: {
          ...state.itemStep,
          ...payload,
        },
      };
    },
  },
};
