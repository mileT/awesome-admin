package com.awesome.auth.model.app;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.provider.ClientDetails;

import java.util.*;

/**
 * @author zhangpengcheng
 */
public class AppCredentialDetail implements ClientDetails {

    private AppCredential appCredential;
    private PasswordEncoder encoder = new BCryptPasswordEncoder();

    public AppCredentialDetail(AppCredential appCredential) {
        this.appCredential = appCredential;
    }

    @Override
    public String getClientId() {
        return appCredential.getAppId();
    }

    @Override
    public Set<String> getResourceIds() {
        return null;
    }

    @Override
    public boolean isSecretRequired() {
        return true;
    }

    @Override
    public String getClientSecret() {
        return encoder.encode(appCredential.getAppSecret());
    }

    @Override
    public boolean isScoped() {
        return true;
    }

    @Override
    public Set<String> getScope() {
        return new HashSet<>(Arrays.asList(appCredential.getScopes().split(",")));
    }

    @Override
    public Set<String> getAuthorizedGrantTypes() {
        return new HashSet<>(Arrays.asList(appCredential.getGrantTypes().split(",")));
    }

    @Override
    public Set<String> getRegisteredRedirectUri() {
        return new HashSet<>(Arrays.asList(appCredential.getRedirectUrl().split(",")));
    }

    @Override
    public Collection<GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();
        return authorities;
    }

    @Override
    public Integer getAccessTokenValiditySeconds() {
        return appCredential.getAccessExpireTime();
    }

    @Override
    public Integer getRefreshTokenValiditySeconds() {
        return appCredential.getRefreshExpireTime();
    }

    @Override
    public boolean isAutoApprove(String s) {
        return true;
    }

    @Override
    public Map<String, Object> getAdditionalInformation() {
        return null;
    }

}
