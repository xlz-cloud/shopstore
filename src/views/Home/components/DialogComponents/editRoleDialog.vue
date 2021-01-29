<template>
    <div>
        <el-dialog
        title="添加角色"
        :visible.sync="editRoleDialogVisible"
        width="50%"
        :before-close="handleClose">
        <el-form status-icon label-width="80px" class="demo-ruleForm"  :rules="rules" :model="editRoleInfo" ref="ruleForm">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="editRoleInfo.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="editRoleInfo.roleDesc"></el-input>
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
            roleName: [
                { required: true, message: '请输入角色名称', trigger: 'blur' }],
            roleDesc:[
                { required: true, message: '请输入角色描述', trigger: 'blur' }]
            }
        }
    },
    
    props:{
       editRoleDialogVisible:{
           type:Boolean,
           default(){
               return false
           }
       },
       editRoleInfo:{
           type:Object,
           default(){
               return {}
           }
       }
    },

    methods: {
      handleClose() {
        this.$emit("close");
        this.$refs.ruleForm.resetFields();
      },
      submitForm() {
        
        this.$refs.ruleForm.validate( async (valid) => {
          if (valid) {
            //校验成功将表单数据发送出去
           this.$emit("EditRoleFrom",{clearForm:()=>{this.$refs.ruleForm.resetFields();},editRoleInfo:this.editRoleInfo});
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