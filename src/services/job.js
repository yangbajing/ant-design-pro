import request from '@/utils/request';

export async function queryPageJob(params) {
  return request('/job/api/v1/job/page', { params });
}

export async function queryOptionAll() {
  return request('/job/api/v1/job/option/all');
}

export async function createJob(body) {
  return request('/job/api/v1/job', { method: 'POST', body });
}

export async function findItemByKey(key) {
  return request(`/job/api/v1/job/item/${key}`);
}
