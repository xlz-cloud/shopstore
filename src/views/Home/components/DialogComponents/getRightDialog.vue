<template>
    <div>
        <el-dialog
        title="设置角色权限"
        :visible.sync="rightDialogVisible"
        width="50%"
        :before-close="handleClose">
        <!-- //树形控件 -->
       <el-tree
          :data="rightList.data"
          show-checkbox
          node-key="id"
          :default-checked-keys="currentUserRight"
          :props="bindprops"
         default-expand-all
         ref="treeRef"
         >
        </el-tree>

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
        bindprops: {
          children: 'children',
          label: 'authName'
      },
      }
    },
    
    props:{
       rightDialogVisible:{
           type:Boolean,
           default(){
               return false
           }
       },
       rightList:{
           type:Object,
           default(){
               return {}
           }
       },
       currentUserRight:{
           type:Array,
           default(){
               return []
           }
       },
    },

    methods: {
      handleClose() {
        this.$emit("close");
      },
      submitForm() {
        const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
        this.$emit("rights",keys)
      },
      resetForm() {
        this.$emit("close");
      }
    }
  };
</script>

<style scoped>
    
</style>