import { queryRole, removeRole, saveRole } from '../services/role';

export default {
  namespace: 'role',

  state: {
    data: {
      rows: [],
      current: 0,
      rowCount: 10,
      total: 0,
    },
    loading: true,
    loadingSave: false,
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryRole, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * add({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoadingEdit',
        payload: true,
      });
      yield call(saveRole, payload);
      yield put({
        type: 'changeLoadingEdit',
        payload: false,
      });
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    * remove({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(removeRole, payload.ids);
      yield put({
        type: 'fetch',
      });
      yield put({
        type: 'changeLoading',
        payload: false,
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
