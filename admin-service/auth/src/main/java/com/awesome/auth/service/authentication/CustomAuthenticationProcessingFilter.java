package com.awesome.auth.service.authentication;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;

/**
 * @author zhangpengcheng
 */
public class CustomAuthenticationProcessingFilter extends AbstractAuthenticationProcessingFilter {

    private static final String AUTH_TYPE = "auth_type";
    private static final String USERNAME = "username";
    private static final String CREDENTIALS = "credentials";
    private static final String OAUTH_TOKEN_URL = "/oauth/custom/token";
    private static final String HTTP_METHOD_POST = "POST";

    public CustomAuthenticationProcessingFilter() {
        super(new AntPathRequestMatcher(OAUTH_TOKEN_URL, "POST"));
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        if (!HTTP_METHOD_POST.equals(request.getMethod().toUpperCase())){
           throw  new AuthenticationServiceException("Authentication method not supported: " + request.getMethod());
        }

        AbstractAuthenticationToken authRequest = new CustomAuthenticationToken(
                request.getParameter(AUTH_TYPE), request.getParameter(USERNAME), request.getParameter(CREDENTIALS),
                request.getParameterMap(),new ArrayList<>()
        );

        this.setDetails(request, authRequest);

        return this.getAuthenticationManager().authenticate(authRequest);
    }

    protected void setDetails(HttpServletRequest request, AbstractAuthenticationToken authRequest) {
        authRequest.setDetails(authenticationDetailsSource.buildDetails(request));
    }

}
