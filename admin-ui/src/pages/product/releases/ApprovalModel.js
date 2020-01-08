import { queryProduct } from './service';

const Model = {
  namespace: 'products',
  state: {
    info: null,
    data: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryProduct, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
export default Model;
