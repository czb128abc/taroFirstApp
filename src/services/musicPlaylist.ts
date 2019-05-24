import { get } from './../utils/request';

export function queryTopPayList(param: { limit: 10, order: 'hot' }) {
  return get('/top/playlist', param);
}

export function queryTopPayDetail(id) {
  return get('/playlist/detail', { id });
}

export async function querySongInfo(songId) {
  const param = { id: songId };
  const result = {
    success: false,
    message: '由于版权原因,音乐不能播放',
    data: {},
  };
  const checkResult = await get('/check/music', param);
  if (checkResult.success) {
    const songResult = await get('/song/url', param);
    const lyricReulst = await get('/lyric', param);
    result.data = {
      url: songResult.data[0].url,
      lyric: lyricReulst.lrc.lyric,
      songKey: `${songId}`,
    };
    result.success = true;
  }
  return result;
}
