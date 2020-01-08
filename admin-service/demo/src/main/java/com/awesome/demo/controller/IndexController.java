package com.awesome.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author liwei
 * @version 1.0
 * @date 2019/12/28 01:46
 */
@RestController
@RequestMapping("/api/index")
public class IndexController {

    @GetMapping("hello")
    public String hello(){
        return "Hello World!";
    }
}
