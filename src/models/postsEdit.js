import { queryPosts, removePosts, savePosts } from '../services/posts';
import { getCategoryList, getTagList } from '../services/terms';

export default {
  namespace: 'postsEdit',

  state: {
    data: {},
    categoryData: [],
    tagData: [],
    loadingEdit: false,
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryPosts, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * fetchCategory({ payload }, { call, put }) {
      const response = yield call(getCategoryList, payload);
      yield put({
        type: 'saveCategory',
        payload: response,
      });
    },
    * fetchTag({ payload }, { call, put }) {
      const response = yield call(getTagList, payload);
      yield put({
        type: 'saveTag',
        payload: response,
      });
    },
    * remove({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(removePosts, payload.ids);
      yield put({
        type: 'fetch',
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback();
    },
    * save({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoadingEdit',
        payload: true,
      });
      yield call(savePosts, payload);
      yield put({
        type: 'changeLoadingEdit',
        payload: false,
      });
      if (callback) callback();
    },
  },

  reducers: {
    saveCategory(state, action) {
      return {
        ...state,
        categoryData: action.payload,
      };
    },
    saveTag(state, action) {
      return {
        ...state,
        tagData: action.payload,
      };
    },
    changeLoadingEdit(state, action) {
      return {
        ...state,
        loadingEdit: action.payload,
      };
    },
  },
};
