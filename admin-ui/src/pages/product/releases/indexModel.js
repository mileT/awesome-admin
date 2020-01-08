import { queryMyProduct } from './service';

const Model = {
  namespace: 'myProducts',
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
      const response = yield call(queryMyProduct, payload);
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
