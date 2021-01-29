<template>
    <div>
        <el-dialog
        title="权限设置"
        :visible.sync="rightDialogVisible"
        width="40%"
        :before-close="handleClose">
        <span style="width:60px">当前用户：<span>{{currentUser.username}}</span></span><br><br><br>
        <span style="width:60px">当前角色：<span>{{currentUser.role_name}}</span></span><br><br>
        <el-form status-icon 
        class="demo-ruleForm" 
        ref="ruleForm">
            <el-form-item label="新分配的角色：" >
              <el-select placeholder="请选择角色" v-model="selectRloe">
                  <el-option
                  v-for="item in rightControlInfo"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                ></el-option>
              </el-select>
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
    data() {
      return {
          selectRloe:''
      }
    },
    props:{
        rightDialogVisible:{
            type:Boolean,
            default(){
                return false
            }
        },
        rightControlInfo:{
            type:Array,
            default(){
                return []
            }
        },
        currentUser:{
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
      this.$emit("RightFrom",{clearForm:()=>{this.$refs.ruleForm.resetFields();},rightControlInfo:this.selectRloe});
      this.$emit("close");
  
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