package com.awesome.auth.service.jwt;

import com.awesome.auth.service.authentication.CustomAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.TokenEnhancer;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * @author zhangpengcheng
 */
public class CustomTokenEnhancer implements TokenEnhancer {

    @Override
    public OAuth2AccessToken enhance(OAuth2AccessToken accessToken, OAuth2Authentication authentication) {
        final Map<String, Object> additionalInfo = new HashMap<>();
        Set<GrantedAuthority> rolesInfo = new HashSet<>();

        Authentication userAuthentication = authentication.getUserAuthentication();

        // client credential认证，加入管理员角色
        if (authentication.isClientOnly()) {
            rolesInfo.add(new SimpleGrantedAuthority("admin"));
        }

        // 自定义认证，增加detail
        if (CustomAuthenticationToken.class.isAssignableFrom(userAuthentication.getClass())) {
            rolesInfo.addAll(userAuthentication.getAuthorities());
            additionalInfo.put("userInfo", userAuthentication.getDetails());
        }

        // 加入角色
        additionalInfo.put("authorities", rolesInfo.stream().map(auth -> auth.getAuthority()).toArray());
        ((DefaultOAuth2AccessToken) accessToken).setAdditionalInformation(additionalInfo);
        return accessToken;
    }
}
