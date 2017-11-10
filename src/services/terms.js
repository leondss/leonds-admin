import { stringify } from 'qs';
import request from '../utils/request';

export async function queryTerms(params) {
  return request(`/api/terms/list?${stringify(params)}`);
}

export async function queryTermsAll() {
  return request('/api/terms/all');
}

export async function addTermsTaxonomy(params) {
  return request('/api/terms/add-taxonomy', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

