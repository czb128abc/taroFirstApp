import * as servies from "../services/musicPlaylist";

export default {
  namespace: "musicPlaylist",
  state: {
    // 推荐歌单
    topPayList: [],
    topPayListCondition: {},
    topPayDetail: null
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  },
  effects: {
    *queryTopPayList({ payload }, { call, put }) {
      const data = yield call(servies.queryTopPayList, payload);
      const { code, playlists, ...other } = data;
      if (code !== 200) {
        throw new Error(data.code);
      }
      yield put({
        type: "save",
        payload: {
          topPayList: playlists,
          topPayListCondition: other
        }
      });
    },
    *queryTopPayDetail(
      {
        payload: { id }
      },
      { call, put }
    ) {
      yield put({
        type: "save",
        payload: {
          topPayDetail: null
        }
      });
      const data = yield call(servies.queryTopPayDetail, id);
      const { code, playlist } = data;
      if (code !== 200) {
        throw new Error(data.code);
      }
      console.log("...data", data);
      yield put({
        type: "save",
        payload: {
          topPayDetail: playlist
        }
      });
    }
  }
};
