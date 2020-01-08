package com.awesome.auth.service.authentication;

import com.awesome.auth.service.interfaces.UsernamePasswordUserDetailService;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.List;

/**
 * @author zhangpengcheng
 */

public class UsernamePasswordAuthenticationProvider implements AuthenticationProvider {

    private UsernamePasswordUserDetailService userDetailService;

    public UsernamePasswordAuthenticationProvider(UsernamePasswordUserDetailService userDetailService) {
        this.userDetailService = userDetailService;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        String password = authentication.getCredentials().toString();

        // 验证用户名和密码
        if (userDetailService.verifyCredential(username, password)) {

            List<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("user"));
            UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(username, password, authorities);
            token.setDetails(userDetailService.getUserDetail(username));
            return token;
        }
        return null;
    }

    @Override
    public boolean supports(Class<?> aClass) {
        // 用户名和密码登录时，使用该provider认证
        return (UsernamePasswordAuthenticationToken.class.isAssignableFrom(aClass));
    }
}
