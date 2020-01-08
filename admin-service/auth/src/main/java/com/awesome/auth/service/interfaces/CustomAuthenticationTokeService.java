package com.awesome.auth.service.interfaces;

import com.awesome.auth.service.authentication.CustomAuthenticationToken;

import java.util.Map;

/**
 * @author zhangpengcheng
 */
public interface CustomAuthenticationTokeService {

    /**
     * 获取 authentication token
     * @param clientId appId
     * @param params params
     * @return token
     */
    CustomAuthenticationToken createAuthenticationToken(String clientId, Map<String, String> params);
}
