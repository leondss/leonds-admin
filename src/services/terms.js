import { stringify } from 'qs';
import request from '../utils/request';

export async function getCategoryList(params) {
  return request(`/api/category/list?${stringify(params)}`);
}

export async function getTagList(params) {
  return request(`/api/tag/list?${stringify(params)}`);
}
