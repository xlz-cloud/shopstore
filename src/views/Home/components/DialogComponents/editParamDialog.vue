<template>
    <div>
        <el-dialog
        :title="'修改'+dialogTitle"
        :visible.sync="editDialogVisible"
        width="50%"
        :before-close="handleClose">
        
        <el-form status-icon label-width="80px" class="demo-ruleForm"  :rules="rules" :model="editObj" ref="ruleForm">
            <el-form-item :label="dialogTitle" prop="attr_name">
                <el-input v-model="editObj.attr_name"></el-input>
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
            rules: {
            attr_name: [
                { required: true, message: '请输入参数属性', trigger: 'blur' }]
      }
      }
    },
    props:{
        editDialogVisible:{
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
        },
        editObj:{
            type:Object,
            default(){
                return {}
            }
        },
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
           this.$emit("editParamAndPropFrom",{clearForm:()=>{this.$refs.ruleForm.resetFields();},ruleForm:this.editObj});
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