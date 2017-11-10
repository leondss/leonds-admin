import { stringify } from 'qs';
import request from '../utils/request';

export async function queryRole(params) {
  return request(`/api/role/list?${stringify(params)}`);
}

export async function addTermsTaxonomy(params) {
  return request('/api/terms/add-taxonomy', {
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

