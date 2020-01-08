package com.awesome.auth.service.jwt;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;

import java.util.*;


/**
 * @author zhangpengcheng
 */
public class TokenEnhancer implements org.springframework.security.oauth2.provider.token.TokenEnhancer {

    @Override
    public OAuth2AccessToken enhance(OAuth2AccessToken accessToken, OAuth2Authentication authentication) {
        final Map<String, Object> additionalInfo = new HashMap<>(2);

        Authentication userAuthentication = authentication.getUserAuthentication();
        if (authentication.isClientOnly()) {
            List<String> authorities = new ArrayList<>(1);
            authorities.add("admin");
            additionalInfo.put("authorities", authorities);

        } else {
            additionalInfo.put("userInfo", userAuthentication.getDetails());

            // 将authorities转换为string类型，便于json序列化
            Set<GrantedAuthority> rolesInfo = new HashSet<>(userAuthentication.getAuthorities());
            additionalInfo.put("authorities", rolesInfo.stream().map(auth -> auth.getAuthority()).toArray());
        }

        ((DefaultOAuth2AccessToken) accessToken).setAdditionalInformation(additionalInfo);
        return accessToken;
    }
}
