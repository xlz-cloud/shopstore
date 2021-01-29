<template>
    <div>
        <el-dialog
        :title="'添加'+dialogTitle"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose">
        
        <el-form status-icon label-width="80px" class="demo-ruleForm"  :rules="rules" :model="ruleForm" ref="ruleForm">
            <el-form-item :label="dialogTitle" prop="attr_name">
                <el-input v-model="ruleForm.attr_name"></el-input>
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
       
      return {
          ruleForm:{
              attr_name:'',
          },
            rules: {
            attr_name: [
                { required: true, message: '请输入参数属性', trigger: 'blur' }]
      }
      }
    },
    props:{
        dialogVisible:{
            type:Boolean,
            default(){
                return false
            }
        },
        dialogTitle:{
            type:String,
            default(){
                return ' '
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
           this.$emit("addParamAndPropFrom",{clearForm:()=>{this.$refs.ruleForm.resetFields();},ruleForm:this.ruleForm});
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