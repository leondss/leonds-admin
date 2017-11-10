import { stringify } from 'qs';
import request from '../utils/request';

export async function queryPosts(params) {
  return request(`/api/posts/list?${stringify(params)}`);
}

export async function savePosts(params) {
  return request('/api/posts/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function removePosts(params) {
  return request('/api/posts/remove', {
    method: 'POST',
    body: params,
  });
}

