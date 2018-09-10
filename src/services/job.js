import request from '@/utils/request';

export async function queryPageJob(params) {
  return request('/api/v1/job/page', {params});
}

export async function queryOptionAll() {
  return request('/api/v1/job/option/all')
}

export async function createJob(body) {
  return request('/api/v1/job', {method: 'POST', body});
}
