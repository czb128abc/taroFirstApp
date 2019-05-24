export const playModeEnum = {
  SEQUENTIAL_PLAY: 0,
  RANDOM_PLAY: 1,
  SINGLE_TUNE_CIRCULATION: 2,
  LOOP_PLAY: 3,
};
export const playModeMap = {
  [playModeEnum.SEQUENTIAL_PLAY]: '顺序播放',
  [playModeEnum.RANDOM_PLAY]: '随机播放',
  [playModeEnum.SINGLE_TUNE_CIRCULATION]: '单曲循环播放',
  [playModeEnum.LOOP_PLAY]: '循环播放',
};

export function randomNum(start, end) {
  return Math.round(Math.random() * (end - start)) + start;
}
export const getSongInfoByStrategy = {
  _findSongIndex(currentPlayingKey, songList) {
    if (this._songListIsEmpty(songList)) {
      throw new Error('播放列表中暂无歌曲');
    }
    return songList.findIndex(item => `${item.id}` === currentPlayingKey);
  },
  _songIndexIsFirst(index, songList) {
    return index === 0;
  },
  _songIndexIsLast(index, songList) {
    return index === songList.length - 1;
  },
  _songListIsEmpty(songList) {
    return songList.length === 0;
  },
  _songListIsOnlyOneSong(songList) {
    return songList.length === 1;
  },
  [playModeEnum.SEQUENTIAL_PLAY](currentPlayingKey, songList, isNext) {
    const index = this._findSongIndex(currentPlayingKey, songList);
    if (this._songListIsOnlyOneSong(songList)) {
      return songList[index];
    }
    if (isNext) {
      if (this._songIndexIsLast(index, songList)) {
        return songList[0];
      } else {
        return songList[index + 1];
      }
    } else {
      if (this._songIndexIsFirst(index, songList)) {
        return songList[songList.length - 1];
      } else {
        return songList[index - 1];
      }
    }
  },
  [playModeEnum.RANDOM_PLAY](currentPlayingKey, songList) {
    const index = this._findSongIndex(currentPlayingKey, songList);
    if (this._songListIsOnlyOneSong(songList)) {
      return songList[index];
    }
    const unPlayIndexList = songList
      .map((item, sIndex) => {
        return sIndex;
      })
      .filter((item, sIndex) => sIndex !== index);
    const num = unPlayIndexList[randomNum(0, unPlayIndexList.length)];
    return songList[num];
  },
  [playModeEnum.SINGLE_TUNE_CIRCULATION](currentPlayingKey, songList) {
    const index = this._findSongIndex(currentPlayingKey, songList);
    return songList[index];
  },
  [playModeEnum.LOOP_PLAY](currentPlayingKey, songList, isNext) {
    return this[playModeEnum.SEQUENTIAL_PLAY](currentPlayingKey, songList, isNext);
  },
};

export function calTimePercent(currentTime, durationTime) {
  const num = (currentTime * 100) / durationTime;
  return num;
}
