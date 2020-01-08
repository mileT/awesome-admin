package com.awesome.auth.service.implement;

import com.awesome.auth.service.authentication.CustomAuthenticationToken;
import com.awesome.auth.service.interfaces.CustomAuthenticationTokeService;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author zhangpengcheng
 */
@Service
public class CustomAuthenticationTokenServiceImpl implements CustomAuthenticationTokeService {


    @Override
    public CustomAuthenticationToken createAuthenticationToken(String clientId, Map<String, String> params) {
        if (!params.containsKey("principal") || !params.containsKey("auth_type")) {
            return null;
        }

        if (params.get("auth_type").equals("auth_finished")) {

            List<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("user"));
            Map<String, Object> detail = new HashMap<>(1);
            detail.put("principal", params.get("principal"));

            CustomAuthenticationToken token = new CustomAuthenticationToken(
                    params.get("auth_type"), params.get("username"), null, null, authorities);
            token.setDetails(detail);
            return token;
        }

        return null;
    }
}
