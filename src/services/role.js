import { stringify } from 'qs';
import request from '../utils/request';

export async function queryRole(params) {
  return request(`/api/role/list?${stringify(params)}`);
}

export async function saveRole(params) {
  return request('/api/role/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function removeRole(params) {
  return request('/api/role/remove', {
    method: 'POST',
    body: params,
  });
}

