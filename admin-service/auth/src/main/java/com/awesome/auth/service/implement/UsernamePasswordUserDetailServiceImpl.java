package com.awesome.auth.service.implement;

import com.awesome.auth.service.interfaces.UsernamePasswordUserDetailService;
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
public class UsernamePasswordUserDetailServiceImpl implements UsernamePasswordUserDetailService {

    @Override
    public boolean verifyCredential(String username, String password) {
        return true;
    }

    @Override
    public Object getUserDetail(String username) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("user"));
        Map<String, Object> detail = new HashMap<>(2);
        detail.put("name", username);
        detail.put("roles", authorities);
        return detail;
    }
}
