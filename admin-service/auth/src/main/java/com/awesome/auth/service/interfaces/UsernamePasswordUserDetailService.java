package com.awesome.auth.service.interfaces;

/**
 * @author zhangpengcheng
 */
public interface UsernamePasswordUserDetailService {

    /**
     * 验证用户名和密码
     * @param username 用户名
     * @param password 密码
     * @return 是否正确
     */
    boolean verifyCredential(String username, String password);

    /**
     * 获取用户详情
     * @param username 用户名
     * @return 用户详情
     */
    Object getUserDetail(String username);
}
