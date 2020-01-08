import request from '@/utils/request';
import dictionary from '@/pages/Dictionary';

const { contract: { attachmentType } } = dictionary;

export async function getCustomerBank(customerId) {
  return request(`/crm-vnext/api/customer/bank?customerId=${customerId}`);
}

export async function getManagerCustomer() {
  return request('/crm-vnext/api/customer/mine');
}

export async function createContract(params) {
  return request('/crm-vnext/api/contract', {
    method: 'POST',
    data: params,
  });
}

export async function getAttachment(contractId) {
  return request(`/crm-vnext/api/contract/attachments?contractId=${contractId}`)
}

export async function queryContractUploadPolicy() {
  return request('/crm-vnext/api/contract/introduction/upload/policy');
}

export async function queryFileLink(path) {
  return request(`/crm-vnext/api/oss/file/link?path=${path}`);
}

export async function queryContracts(params) {
  return request('/crm-vnext/api/contract/creator', {
    method: 'POST',
    data: params,
  });
}

export async function queryAllContracts(params) {
  return request('/crm-vnext/api/contract/all', {
    method: 'POST',
    data: params,
  });
}

export async function updateContract(params) {
  return request(
    '/crm-vnext/api/contract', {
      method: 'PUT',
      data: params,
    });
}

export async function deleteContract(id) {
  return request(
    `/crm-vnext/api/contract?contractId=${id}`, {
      method: 'DELETE',
    });
}

export async function queryProductSelectOptions() {
  return request('/crm-vnext/api/product/options')
}

export async function queryPayments(contractId) {
  return request(`/crm-vnext/api/contract/payment?contractId=${contractId}`)
}

export async function queryProductSimpleInfo(productId) {
  return request(`/crm-vnext/api/product/simple/info?productId=${productId}`)
}

export async function queryProduct(params) {
  return request('/crm-vnext/api/product/info', {
    method: 'POST',
    data: params,
  });
}

export function formUpdateModel(data, values, status) {
  const videos = values.videos && values.videos.fileList
    ? values.videos.fileList.map(item => ({
      ...item, type: item.type ? item.type.val : attachmentType.video.val }))
    : [];
  const pictures = values.pictures && values.pictures.fileList
    ? values.pictures.fileList.map(item => ({
      ...item, type: item.type ? item.type.val : attachmentType.picture.val }))
    : [];
  const params = {
    id: data.id,
    ...values,
    videos,
    pictures,
    status: status.val,
  };
  return params;
}
