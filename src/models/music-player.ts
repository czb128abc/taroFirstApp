import * as servies from '../services/musicPlaylist';
import { playModeEnum, getSongInfoByStrategy } from '../utils/music/consts';

// const songInfoCacheMap = {};

export default {
  namespace: 'musicPlayer',
  state: {
    songList: [],
    playMode: playModeEnum.LOOP_PLAY,
    currentPlayingKey: null,
    currentPlayingSong: null,
    currentTime: 0,
    durationTime: 0,
    playerIsPause: true,
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    playerAddSongs(state, { payload }) {
      const songList = state.songList.map(item => item);
      songList.push(...payload);
      return {
        ...state,
        songList,
      };
    },
    playerRemoveSongs(state, { payload }) {
      const songList = state.songList.filter(item => {
        return payload.find(song => {
          return `${song.id}` === `${item.id}`;
        });
      });
      return {
        ...state,
        songList,
      };
    },
    playerClearSongs(state) {
      const songList = [];
      return {
        ...state,
        songList,
      };
    },
  },
  effects: {
    *playNewSong({ payload: { id } }, { call, put }) {
      const { success, message, data } = yield call(servies.querySongInfo, id);
      if (!success) {
        throw new Error(message);
      }
      const currentPlayingKey = data.songKey;
      const currentPlayingSong = data;
      yield put({
        type: 'save',
        payload: {
          currentPlayingSong,
          currentPlayingKey,
        },
      });
    },
    *playNextSomeSongByRule({ payload }, saga) {
      console.log('...playNextSomeSongByRule');
      const { isNext = true } = payload;
      const { songList, playMode, currentPlayingKey } = yield saga.select(
        state => state.musicPlayer
      );
      const nextSong = getSongInfoByStrategy[playMode](currentPlayingKey, songList, isNext);
      console.log('nextSong', nextSong);
      if (nextSong) {
        yield saga.put({
          type: 'playNewSong',
          payload: nextSong,
        });
      }
    },
  },
};
