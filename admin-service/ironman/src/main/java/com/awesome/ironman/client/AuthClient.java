package com.awesome.ironman.client;

import com.awesome.ironman.config.AuthFeignConfigInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Map;

/**
 * @author zhangpengcheng
 */
@FeignClient(name = "auth", configuration = AuthFeignConfigInterceptor.class)
@Service
public interface AuthClient {

    /**
     * get user token
     *
     * @param parameters parameters
     * @return token
     */
    @RequestMapping(method = RequestMethod.POST, value = "/auth/api/external/token")
    ResponseEntity<OAuth2AccessToken> getUserToken(@RequestBody Map<String, String> parameters);

}
