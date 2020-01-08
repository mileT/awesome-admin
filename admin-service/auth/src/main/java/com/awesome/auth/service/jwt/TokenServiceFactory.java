package com.awesome.auth.service.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.oauth2.provider.ClientDetailsService;
import org.springframework.security.oauth2.provider.token.AuthorizationServerTokenServices;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.security.oauth2.provider.token.TokenEnhancerChain;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;
import org.springframework.security.oauth2.provider.token.store.KeyStoreKeyFactory;
import org.springframework.stereotype.Service;

import java.util.Arrays;

/**
 * @author zhangpengcheng
 */
@Service
public class TokenServiceFactory {

    private TokenKeyConfig tokenKeyConfig;
    private ClientDetailsService clientDetailsService;

    @Autowired
    public TokenServiceFactory(
            TokenKeyConfig tokenKeyConfig,
            ClientDetailsService clientDetailsService) {
        this.tokenKeyConfig = tokenKeyConfig;
        this.clientDetailsService = clientDetailsService;
    }

    @Bean
    @Primary
    public AuthorizationServerTokenServices JwtTokenService() {
        final TokenEnhancerChain tokenEnhancerChain = new TokenEnhancerChain();
        tokenEnhancerChain.setTokenEnhancers(Arrays.asList(tokenEnhancer(), accessTokenConverter()));

        return defaultTokenService(tokenEnhancerChain);
    }

    @Bean
    public AuthorizationServerTokenServices customJwtTokenService() {
        final TokenEnhancerChain tokenEnhancerChain = new TokenEnhancerChain();
        tokenEnhancerChain.setTokenEnhancers(Arrays.asList(new CustomTokenEnhancer(), accessTokenConverter()));
        return defaultTokenService(tokenEnhancerChain);
    }

    @Bean
    public JwtAccessTokenConverter accessTokenConverter() {
        final JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
        converter.setAccessTokenConverter(new CustomAccessTokenConverter());

        final KeyStoreKeyFactory keyStoreKeyFactory = new KeyStoreKeyFactory(
                new ClassPathResource(tokenKeyConfig.getPath()), tokenKeyConfig.getPassword().toCharArray());
        converter.setKeyPair(keyStoreKeyFactory.getKeyPair(tokenKeyConfig.getAlias()));

        return converter;
    }

    @Bean
    public TokenStore tokenStore() {
        return new JwtTokenStore(accessTokenConverter());
    }

    @Bean
    public TokenEnhancer tokenEnhancer() {
        return new TokenEnhancer();
    }

    private AuthorizationServerTokenServices defaultTokenService(TokenEnhancerChain tokenEnhancerChain) {
        final DefaultTokenServices defaultTokenServices = new DefaultTokenServices();
        defaultTokenServices.setTokenStore(tokenStore());
        defaultTokenServices.setSupportRefreshToken(true);
        defaultTokenServices.setTokenEnhancer(tokenEnhancerChain);
        defaultTokenServices.setClientDetailsService(clientDetailsService);
        return defaultTokenServices;
    }
}
