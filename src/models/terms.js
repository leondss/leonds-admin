import { queryTerms, addTermsTaxonomy, queryTermsAll } from '../services/terms';

export default {
  namespace: 'terms',

  state: {
    data: {
      rows: [],
      current: 0,
      rowCount: 10,
      total: 0,
    },
    loading: true,
    loadingSave: false,
    termsData: [],
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryTerms, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * queryTermsAll({ payload }, { call, put }) {
      const response = yield call(queryTermsAll, payload);
      yield put({
        type: 'saveTerms',
        payload: response,
      });
    },
    * add({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoadingEdit',
        payload: true,
      });
      yield call(addTermsTaxonomy, payload);
      yield put({
        type: 'changeLoadingEdit',
        payload: false,
      });
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveTerms(state, action) {
      return {
        ...state,
        termsData: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    changeLoadingEdit(state, action) {
      return {
        ...state,
        loadingSave: action.payload,
      };
    },
  },
};
