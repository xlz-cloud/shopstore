<template>
    <div>
        <div class="panel">
            <img src="~assets/img/head.jpeg" alt="">
            <el-form :model="form" label-width="30px" class="form" :rules="rules" ref="form">
                <el-form-item prop="username">
                    <el-input v-model="form.username" placeholder="用户名称" prefix-icon="iconfont iconuser"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="form.password" placeholder="用户密码" show-password prefix-icon="iconfont iconi-pwd"></el-input>
                </el-form-item>
                 <el-form-item class="btns">
                     <el-button type="primary" @click="login">登陆</el-button>
                     <el-button type="info" @click="reset">重置</el-button>
                 </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
   data(){
        return {
            form:{
                username:'admin',
                password:'123456'
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 11, message: '长度在 3 到 11 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入用户密码', trigger: 'blur' },
                    { min: 5, max: 11, message: '长度在 5 到 11 个字符', trigger: 'blur' }
                ]
        }
    }
    },
    methods:{
          login(){
            this.$refs.form.validate(tag=>{
                if(tag){
                     this.$emit('loginRequest',this.form);
                }else{
                    this.$message.error('用户名或密码格式错误！');
                }
            })
        },
         reset(){
            this.$refs.form.resetFields();
        }
    }
}
</script>

<style scoped>
    .panel{
    width: 500px;
    height: 350px;
    background-color: white;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom:0;
    margin: auto;
    border-radius: 10px;
}
.panel img{width: 160px;height: 160px;position: absolute;left: calc((100% - 160px)/2);top: -40px;
border-radius: 50%;}
.panel .form{margin-top: 150px;padding-right: 30px;position: relative;}
.panel .form .btns{display: flex;justify-content: flex-end;} 
</style>