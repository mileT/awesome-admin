import request from '@/utils/request';

export async function queryQuestionnaireResult(params) {
  return request('/crm-vnext/api/questionnaire/result', {
    method: 'post',
    data: params,
  });
}
