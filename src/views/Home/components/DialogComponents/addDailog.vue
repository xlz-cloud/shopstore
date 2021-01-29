<template>
    <div>
        <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose">
        
        <el-form status-icon label-width="70px" class="demo-ruleForm"  :rules="rules" :model="ruleForm" ref="ruleForm">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="ruleForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
                <el-input v-model="ruleForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="resetForm">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
        </span>
        </el-dialog>

    </div>
</template>
<script>
  export default {
    name:'add',
    data() {
        // 校验邮箱是否合法
        var checkEmail = (rule,value,cb)=>{
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-z0-9_-])+(\.[a-zA-Z0-9_-])+/;
            if (regEmail.test(value)) {
                //合法的邮箱
                return cb();
            }
            cb(new Error("请输入合法的邮箱"));
        }
        // 校验电话是否合法
        var checkPhone = (rule,value,cb)=>{
            const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
            if (regMobile.test(value)) {
                //合法的邮箱
                return cb();
            }
            cb(new Error("请输入合法的手机号"));
        }
      return {
          ruleForm:{
              username:'',
              password:'',
              email:'',
              mobile:''
          },
            rules: {
            username: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 3, max: 20, message: '长度在 3 到 20 之间', trigger: 'blur' }],
            password:[
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 7, max: 20, message: '长度在 7 到 20 之间', trigger: 'blur' }],
            email:[
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                { validator:checkEmail,trigger: 'blur' }],
            mobile:[
                { required: true, message: '请输入电话', trigger: 'blur' },
                { validator:checkPhone, trigger: 'blur' }],
            },
      }
    },
    props:{
        dialogVisible:{
            type:Boolean,
            default(){
                return false
            }
        }
    },

    methods: {
      handleClose() {
        this.$emit("close");
        this.$refs.ruleForm.resetFields();
      },
      submitForm() {
        
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            //校验成功将表单数据发送出去
           this.$emit("addUserFrom",{clearForm:()=>{this.$refs.ruleForm.resetFields();},ruleForm:this.ruleForm});
           this.$emit("close");
          } else {
            return false;
          }
        });
      },

      resetForm() {
        this.$emit("close");
        this.$refs.ruleForm.resetFields();
      }
    }
  };
</script>

<style scoped>
    
</style>