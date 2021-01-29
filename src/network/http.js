import axios from "axios";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default function(config){
        /**
         * 全局请求配置
         * @param  config为请求传递的配置
         */
        const instance = axios.create({
            baseURL:'http://timemeetyou.com:8889/api/private/v1/',
            timeout: 3600
        });
        
        /**
         * 如果是登陆请求就不需要使用拦截器
         */
       if(config.url != 'login'){
            instance.interceptors.request.use(config=>{
                NProgress.start()
                var token = window.sessionStorage.getItem("token");
                config.headers.Authorization = token;
                return config;
            });
            instance.interceptors.response.use(res=>{
                NProgress.done()
                return res.data;
            }); 
       }
      return instance(config);
    }
