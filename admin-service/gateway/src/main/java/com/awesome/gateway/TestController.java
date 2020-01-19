package com.awesome.gateway;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * @author liwei
 * @version 1.0
 * @date 2020/1/19 10:40
 */
@RestController
public class TestController {

    @Value("${server.port}")
    private String port;

    /**
     * 测试调用请求
     * @param time
     * @return
     */
    @RequestMapping(value = "/get/{time}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<String> get(@PathVariable("time") long time) {
        try {
            Thread.sleep(time);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(port + " get ok.", HttpStatus.OK);
    }

    /**
     * 发生熔断调用的请求
     * @return
     */
    @RequestMapping(value = "/fallback", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<String> fallback() {
        return new ResponseEntity<>("error.", HttpStatus.OK);
    }

}

