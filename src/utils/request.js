import axios from "axios";
import { MessageBox, Message } from "element-ui";
import { message } from "./message.js";
import router from "@/router";
import store from "@/store";
import Vue from "vue";
import { getToken } from "@/utils/auth";
console.log("process.env.VUE_APP_BASE_API", process.env.VUE_APP_BASE_API);
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    // config.xsrfCookieName = 'laravel_session'
    // config.xsrfHeaderName = 'laravel_session'
    // config.headers['Access-Control-Allow-Credentials'] = true
    // config.headers['Access-Control-Allow-Origin'] = 'https://test-sepadmin.ikalaok.com'
    // do something before request is sent
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    // console.log(response,'-------------')
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    // Message.closeAll()
    if (res.code !== 0) {
      // Message({
      //   message: res.message || 'Error',
      //   type: 'error',
      //   duration: 3 * 1000
      // })
      message({
        message: res.message || "Error",
        duration: 2 * 1000,
        type: "error",
      });
      if (res.code === 841) {
        // to re-login
        store.dispatch("user/resetToken").then(() => {
          router.replace(`/login`);
        });
      }
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (
        res.code === 50008 ||
        res.code === 50012 ||
        res.code === 50014 ||
        res.code === 2
      ) {
        // to re-login
        MessageBox.confirm(
          "You have been logged out, you can cancel to stay on this page, or log in again",
          "Confirm logout",
          {
            confirmButtonText: "Re-Login",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        ).then(() => {
          store.dispatch("user/resetToken").then(() => {
            location.reload();
          });
        });
      }
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    // Message({
    // 	message: error.message,
    // 	type: 'error',
    // 	duration: 3 * 1000
    // })
    message({
      message: error.message,
      duration: 2 * 1000,
      type: "error",
    });

    return Promise.reject(error);
  }
);

export default service;
