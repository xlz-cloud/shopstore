<template>
    <div class="login">
        <login-panel @loginRequest="loginRequest"></login-panel>
    </div>
</template>

<script>
import $http  from 'network/http.js';

const loginPanel = ()=> import ( 'components/common/loginPanel')
export default {
    data(){
        return {}
    },
    methods:{
      loginRequest(form){
          $http({
                url:'login',
                method: 'post',
                params : form
            }).then(res=>{
                if(res.data.meta.status == 200 && res.data.meta.msg == '登录成功'){
                    window.sessionStorage.setItem("token",res.data.data.token);
                        this.$message({
                        message: '登录成功',
                        type: 'success'
                        });
                    this.$router.push('/home')
                }else{
                    this.$message.error('账号或密码错误！');
                }
            })
      }
    },
    components:{
        loginPanel
    }
}
</script>

<style scoped>
.login{
    width: 100%;
    height: 100%;
    background-color: rgb(55, 55, 102);
}

</style>