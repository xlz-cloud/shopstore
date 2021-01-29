<template>
    <div>
        <el-dialog
        title="修改分类"
        :visible.sync="editDialogVisible"
        width="50%"
        :before-close="handleClose">
        <el-form status-icon label-width="80px" class="demo-ruleForm"  :rules="rules" :model="editCategoryInfo" ref="ruleForm">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="editCategoryInfo.cat_name"></el-input>
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
              roleName:'',
              roleDesc:''
          },
            rules: {
            cat_name: [
                { required: true, message: '请输入角色名称', trigger: 'blur' }]
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
       editCategoryInfo:{
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
           this.$emit("editCateFrom",{clearForm:()=>{this.$refs.ruleForm.resetFields();},ruleForm:this.editCategoryInfo});
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