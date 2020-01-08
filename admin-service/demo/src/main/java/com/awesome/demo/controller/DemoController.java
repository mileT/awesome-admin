package com.awesome.demo.controller;

import io.swagger.annotations.ApiOperation;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author zhangpengcheng
 */

@RestController
@RequestMapping("/api/")
public class DemoController {

    @ApiOperation(value = "获取用户实名信息")
    @RequestMapping(path = "/test", method = RequestMethod.GET)
    @PreAuthorize("hasAnyAuthority('user')")
    public String demo() {
        return "hello world!";
    }
}
