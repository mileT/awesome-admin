package com.awesome.auth.service.ganter;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.*;
import org.springframework.security.oauth2.provider.request.DefaultOAuth2RequestFactory;
import org.springframework.security.oauth2.provider.token.AbstractTokenGranter;
import org.springframework.security.oauth2.provider.token.AuthorizationServerTokenServices;

/**
 * @author zhangpengcheng
 */
public class CustomTokenGranter extends AbstractTokenGranter {
    private static final String GRANT_TYPE = "mini_app";
    private boolean allowRefresh;
    private Authentication authentication;

    public CustomTokenGranter(
            AuthorizationServerTokenServices tokenServices,
            ClientDetailsService clientDetailsService,
            Authentication authentication) {
        super(tokenServices, clientDetailsService, new DefaultOAuth2RequestFactory(clientDetailsService), GRANT_TYPE);
        this.authentication = authentication;
    }

    @Override
    public OAuth2AccessToken grant(String grantType, TokenRequest tokenRequest) {
        OAuth2AccessToken token = super.grant(grantType, tokenRequest);
        if (token != null) {
            DefaultOAuth2AccessToken noRefresh = new DefaultOAuth2AccessToken(token);
            if (!this.allowRefresh) {
                noRefresh.setRefreshToken((null));
            }
            token = noRefresh;
        }

        return token;
    }

    @Override
    protected OAuth2Authentication getOAuth2Authentication(ClientDetails client, TokenRequest tokenRequest) {
        OAuth2Request storedOAuth2Request = this.getRequestFactory().createOAuth2Request(client, tokenRequest);
        return new OAuth2Authentication(storedOAuth2Request, authentication);
    }

    public void setAuthentication(Authentication authentication) {
        this.authentication = authentication;
    }

    public void setAllowRefresh(boolean allowRefresh) {
        this.allowRefresh = allowRefresh;
    }
}
