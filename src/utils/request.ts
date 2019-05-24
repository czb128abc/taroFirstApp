import Taro from '@tarojs/taro';
import queryString from 'query-string';
const config = {
  baseUrl: 'http://localhost:3000',
  noConsole: false,
};
const { baseUrl, noConsole } = config;

const request_data = {
  platform: 'wap',
  rent_mode: 2,
};

const request = options => {
  if (!noConsole) {
    console.log(
      `${new Date().toLocaleString()}【 M=${options.url} 】P=${JSON.stringify(options.data)}`
    );
  }
  return Taro.request(options).then(res => {
    const { statusCode, data } = res;
    if (statusCode >= 200 && statusCode < 300) {
      if (!noConsole) {
        console.log(`${new Date().toLocaleString()}【 M=${options.url} 】【接口响应：】`, res.data);
      }
      if (data.status !== 'ok') {
        Taro.showToast({
          title: `${res.data.error.message}~` || res.data.error.code,
          icon: 'none',
          mask: true,
        });
      }
      return data;
    } else {
      throw new Error(`网络请求错误，状态码${statusCode}`);
    }
  });
};

export function get(funUrl, queryStrObj = {}) {
  const finalUrl = baseUrl + funUrl;

  const urls = [finalUrl, finalUrl.includes('?') ? '' : '?', queryString.stringify(queryStrObj)];
  return request({
    url: urls.join(''),
    method: 'GET',
    header: {
      'Content-Type': 'application/json',
    },
  });
}

export function post(funUrl, params = {}) {
  const finalUrl = baseUrl + funUrl;
  return request({ url: finalUrl, method: 'POST', body: JSON.stringify(params) });
}

export default request;
