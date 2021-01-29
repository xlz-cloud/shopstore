<template>
    <div>
        <el-dialog
        title="添加分类"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose">
        <el-form status-icon label-width="80px" class="demo-ruleForm" :model="CateFormData" :rules="rules" ref="ruleForm">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="CateFormData.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父类分类">
                <!-- change-on-select="true"可以选中任意一级分类 -->
                <el-cascader
                :options="categoryInfo"
                :props="Props"
                v-model="selectedIds"
                @change="CateChanged"
                expand-trigger="hover"
                clearable>
                 </el-cascader>
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
                cat_name: [
                { required: true, message: "请输入分类名称", trigger: "blur" }
                ]
            },
            //指定级联选择器的配置对象
            Props:{
                checkStrictly:"true",
                value:'cat_id',
                label:'cat_name',
                children:'children',
            },
            selectedIds:[],
            CateFormData: {
                //将要添加的分类的名称
                cat_name: "",
                //父级分类的id
                cat_pid: 0,
                //分类的等级，默认要添加的是1级分类
                cat_level: 0
            },
        }
    },
    
    props:{
       dialogVisible:{
           type:Boolean,
           default(){
               return false
           }
       },
       categoryInfo:{
           type:Array,
           default(){
               return []
           }
       }
    },

    methods: {
        CateChanged(){
            if(this.selectedIds.length>0){
                this.CateFormData.cat_pid = this.selectedIds[this.selectedIds.length-1];
                this.CateFormData.cat_level = this.selectedIds.length;
            }else{
                this.CateFormData.cat_pid = 0;
                this.CateFormData.cat_level = 0;
            }
        },
      handleClose() {
        this.$emit("close");
        this.$refs.ruleForm.resetFields();
      },
      submitForm() {
        this.$refs.ruleForm.validate( async (valid) => {
          if (valid) {
            //校验成功将表单数据发送出去
           this.$emit("addCateFrom",{clearForm:()=>{this.$refs.ruleForm.resetFields();},ruleForm:this.CateFormData});
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
    .el-cascader{width: 100%;margin-top: 10px;}
</style>