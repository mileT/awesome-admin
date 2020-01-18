package com.awesome.auth.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;

/**
 * @author zhangpengcheng
 */
@Configuration
@EnableResourceServer
public class ResourceServerConfig extends ResourceServerConfigurerAdapter {

    @Override
    public void configure(HttpSecurity http) throws Exception {

        http.requestMatchers().antMatchers("/api/**", "/users/**", "/static/**", "/actuator/**")
                .and()
                .authorizeRequests()
                .antMatchers("/actuator/**").permitAll()
                .antMatchers("/api/**", "/users/**").authenticated();
    }
}
