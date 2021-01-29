<template>
    <div>
        <el-dialog
        title="修改地址"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose">
        <el-form status-icon label-width="90px" class="demo-ruleForm" :model="addressForm" :rules="rules" ref="ruleForm">
            <el-form-item label="省市区/县" prop="address1">
                <el-cascader
                    :options="cityOptions"
                    @change="changeProvince"
                    change-on-select
                    v-model="addressForm.address1"
                >
                </el-cascader>
            </el-form-item>
             <el-form-item label="详细地址" prop="address2">
                <el-input v-model="addressForm.address2"></el-input>
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
import cityOptions from 'assets/js/city_data2017_element'
  export default {
    name:'add',
    data() {
      return {
             rules: {
                address1: [
                { required: true, message: "请选择省市区县", trigger: "blur" }
                ],
                address2: [
                { required: true, message: "请填写详细地址", trigger: "blur" }
                ]
            },
            //指定级联选择器的配置对象
            cityOptions: cityOptions,
            addressForm: {
              address1: [],
              address2: ""
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
    },

    methods: {
        CateChanged(){
        },
      handleClose() {
        this.$emit("close");
        this.$refs.ruleForm.resetFields();
      },
      submitForm() {
        this.$refs.ruleForm.validate( async (valid) => {
          if (valid) {
            //校验成功将表单数据发送出去
           this.$emit("editAdress",{clearForm:()=>{this.$refs.ruleForm.resetFields();},ruleForm:this.addressForm});
           this.$emit("close");
          } else {
            return false;
          }
        });
      },

      resetForm() {
        this.$emit("close");
        this.$refs.ruleForm.resetFields();
      },
      changeProvince(){

      }
    }
  };
</script>

<style scoped>
    .el-cascader{width: 100%;}
</style>