package com.awesome.auth.model.app;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotEmpty;

/**
 * @author zhangpengcheng
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AppCredential{

    @Length(min=1, max=127)
    private String appId;

    @Length(min=1, max=255)
    private String appSecret;

    @NotEmpty
    private String grantTypes;

    private String redirectUrl;

    @NotEmpty
    private String scopes;

    @NotEmpty
    private int accessExpireTime;

    @NotEmpty
    private int refreshExpireTime;



    public String getAppId() {
        return appId;
    }

    public void setAppId(String appId) {
        this.appId = appId;
    }

    public String getAppSecret() {
        return appSecret;
    }

    public void setAppSecret(String appSecret) {
        this.appSecret = appSecret;
    }

    public String getGrantTypes() {
        return grantTypes;
    }

    public void setGrantTypes(String grantTypes) {
        this.grantTypes = grantTypes;
    }

    public String getRedirectUrl() {
        return redirectUrl;
    }

    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }

    public String getScopes() {
        return scopes;
    }

    public void setScopes(String scopes) {
        this.scopes = scopes;
    }

    public int getAccessExpireTime() {
        return accessExpireTime;
    }

    public void setAccessExpireTime(int accessExpireTime) {
        this.accessExpireTime = accessExpireTime;
    }

    public int getRefreshExpireTime() {
        return refreshExpireTime;
    }

    public void setRefreshExpireTime(int refreshExpireTime) {
        this.refreshExpireTime = refreshExpireTime;
    }

}
