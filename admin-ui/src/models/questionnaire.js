import { queryQuestionnaireResult } from '@/services/questionnaire';

const QuestionnaireModel = {
  namespace: 'questionnaires',
  state: {
    questionnaires: {
      data: [],
      info: {},
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const data = yield call(queryQuestionnaireResult, payload);
      yield put({
        type: 'query',
        payload: data,
      });
    },
  },
  reducers: {
    query(state, { payload }) {
      return {
        ...state,
        data: payload.data,
        info: payload.info,
      };
    },
  },
}

export default QuestionnaireModel;
