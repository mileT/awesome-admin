import request from '@/utils/request';

export async function queryProduct(params) {
  return request('/crm-vnext/api/product/info', {
    method: 'POST',
    data: params,
  });
}

export async function queryMyProduct(params) {
  return request('/crm-vnext/api/product/info/mine', {
    method: 'POST',
    data: params,
  });
}

export async function queryProductDetail(productId) {
  return request(`/crm-vnext/api/external/product/online/detail?productId=${productId}`);
}

export async function queryFileLink(path) {
  return request(`/crm-vnext/api/oss/file/link?path=${path}`);
}

export async function submitProduct(params) {
  return request('/crm-vnext/api/product/submit', {
    method: 'POST',
    data: params,
  });
}

export async function saveProduct(params) {
  return request('/crm-vnext/api/product/create', {
    method: 'POST',
    data: params,
  });
}

export async function deleteProduct(id) {
  return request(`/crm-vnext/api/product?id=${id}`, {
    method: 'DELETE',
  });
}

export async function updateProduct(params) {
  return request('/crm-vnext/api/product', {
    method: 'PUT',
    data: params,
  });
}

export async function queryIntroductionUploadPolicy() {
  return request('/crm-vnext/api/product/introduction/upload/policy');
}

export async function queryContractUploadPolicy() {
  return request('/crm-vnext/api/product/contract/upload/policy');
}

export async function queryProjects() {
  return request('/crm-vnext/api/project/simple/info');
}

export async function queryApplyWorkflow() {
  return request('/crm-vnext/api/project/workflow');
}

export async function queryBanks() {
  return request('/crm-vnext/api/product/bank');
}
