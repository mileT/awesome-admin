package com.awesome.auth.config;

import com.awesome.auth.service.authentication.*;
import com.awesome.auth.service.interfaces.UsernamePasswordUserDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * @author zpc
 */
@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    CustomLogoutSuccessHandler customLogoutSuccessHandler;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsernamePasswordUserDetailService usernamePasswordUserDetailService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // 默认支持./login实现authorization_code认证
        http
            .formLogin().loginPage("/index.html").loginProcessingUrl("/login")
            .and()
            .authorizeRequests()
            .antMatchers("/index.html", "/login", "/resources/**", "/static/**").permitAll()
            .anyRequest() // 任何请求
            .authenticated()// 都需要身份认证
            .and()
            .logout().invalidateHttpSession(true).deleteCookies("JSESSIONID").logoutSuccessHandler(customLogoutSuccessHandler).permitAll()
            .and()
            .csrf().disable();

        // 自定义认证filter，支持./oauth/custom/token实现authorization_code认证
        http.addFilterAfter(externalAuthenticationProcessingFilter(), UsernamePasswordAuthenticationFilter.class);
    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) {
        // 定义认证的provider用于实现用户名和密码认证
        auth.authenticationProvider(new UsernamePasswordAuthenticationProvider(usernamePasswordUserDetailService));
        // 自定义provider用于实现自定义的登录认证
        auth.authenticationProvider(new CustomerAuthenticationProvider());
    }

    @Bean
    public CustomAuthenticationProcessingFilter externalAuthenticationProcessingFilter() {
        // 自定义认证filter，需要实现CustomAuthenticationProcessingFilter和CustomerAuthenticationProvider
        // filter将过滤url并把认证信息塞入authentication作为CustomerAuthenticationProvider.authenticate的入参
        CustomAuthenticationProcessingFilter filter = new CustomAuthenticationProcessingFilter();

        // 默认自定义认证方式grant_type为authorization_code方式，如果直接返回内容，则需自定义success和fail handler
        // filter.setAuthenticationSuccessHandler(new CustomAuthenticationSuccessHandler());
        // filter.setAuthenticationFailureHandler(new CustomAuthenticationFailureHandler());

        filter.setAuthenticationManager(authenticationManager);
        return filter;
    }

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}