package com.awesome.auth.service.implement;

import com.awesome.auth.model.app.AppCredential;
import com.awesome.auth.model.app.AppCredentialDetail;
import org.springframework.context.annotation.Primary;
import org.springframework.security.oauth2.provider.ClientDetails;
import org.springframework.security.oauth2.provider.ClientDetailsService;
import org.springframework.security.oauth2.provider.endpoint.TokenEndpoint;
import org.springframework.stereotype.Service;

/**
 * @author zhangpengcheng
 */
@Service
@Primary
public class ClientDetailsServiceImpl implements ClientDetailsService {


    @Override
    public ClientDetails loadClientByClientId(String s) {

        if ("weixin".equals(s) || "app".equals(s) || "mini_app".equals(s) || "global".equals(s)) {
            AppCredential credential = new AppCredential();
            credential.setAppId(s);
            credential.setAppSecret("testpassword");
            credential.setGrantTypes("authorization_code,client_credentials,password,refresh_token,mini_app");
            credential.setAccessExpireTime(3600 * 24);
            credential.setRefreshExpireTime(3600 * 24 * 30);
            credential.setRedirectUrl("http://localhost:3006,http://localhost:3006/auth,http://localhost:8000,http://localhost:8000/auth,http://admin.awesome-coder.com/auth");
            credential.setScopes("all");
            return new AppCredentialDetail(credential);
        }
        return null;
    }
}
