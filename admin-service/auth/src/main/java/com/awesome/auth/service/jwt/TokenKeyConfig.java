package com.awesome.auth.service.jwt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * @author zhangpengcheng
 */
@Configuration
public class TokenKeyConfig {

    @Value("${jwt.key.password}")
    private String password;

    @Value("${jwt.key.path}")
    private String path;

    @Value("${jwt.key.alias}")
    private String alias;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }
}
