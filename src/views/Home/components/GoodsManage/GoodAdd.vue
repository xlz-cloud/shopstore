<template>
    <div>
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/initial' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <!-- 任务进度条 -->
            <el-alert title="添加商品信息" type="success" :closable="false" center show-icon></el-alert>
            <el-steps :active="activeStep - 1" finish-status="success" :space="200" 
            :align-center="true" >
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- 侧边导航条 -->
            <el-tabs tab-position="left"  v-model="activeStep" @tab-click="selectClick" :before-leave="beforeTabLeave">
                <!-- 基本信息表单 -->
                <el-tab-pane label="基本信息" name="1">
                    <el-form :model="form" :rules="rules" ref="form" label-width="80px" label-position="top" >
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="form.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="form.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="form.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="form.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                :options="categoryInfo"
                                :props="Props"
                                v-model="form.goods_cat"
                                @change="changeHandle"
                                clearable>
                            </el-cascader>
                        </el-form-item>
                    
                    </el-form>
                </el-tab-pane>
                <!-- 商品参数表单 -->
                <el-tab-pane label="商品参数" name="2">
                     <div v-for="(item) in manyParamsData" :key="item.id">
                        <el-tag>{{item.attr_name}}</el-tag><br>
                        <el-checkbox-group v-model="item.attr_vals">
                            <el-checkbox :label="text" v-for="(text,index) in item.attr_vals" :key="index" border></el-checkbox>
                        </el-checkbox-group>
                     </div>
                </el-tab-pane>
                <!-- 商品属性 -->
                <el-tab-pane label="商品属性" name="3">
                    <div v-for="(item) in onlyParamsData" :key="item.id">
                        <el-tag>{{item.attr_name}}</el-tag><br>
                        <el-input v-model="item.attr_vals"></el-input>
                     </div>
                </el-tab-pane>
                <!-- 商品图片上传 -->
                <el-tab-pane label="商品图片" name="4">
                    <el-upload
                    :action="uploadUrl"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :headers="headerObj"
                    :on-success="uploadSuccess"
                    :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-tab-pane>
                <!-- 商品内容 -->
                <el-tab-pane label="商品内容" name="5">
                    <quill-editor v-model="form.goods_introduce"/>
                    <el-button  type="primary"  @click="addGoods">添加商品</el-button>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
import $http from 'network/http'
export default {
    data(){
        return {
            activeStep:'1',
             Props:{
                expandTrigger:"hover",
                value:'cat_id',
                label:'cat_name',
                children:'children',
            },
            categoryInfo:[],
            // 表单的数据绑定
            form:{
                goods_name:'',
                goods_price:0,
                goods_number:0,
                goods_weight:0,
                goods_cat:[],
                pics:[],
                goods_introduce:'',
                attrs:[]
            },
            // 表单的雅正规则
            rules:{
                goods_name:[{ required: true, message: '请输入商品名称', trigger: 'blur' }],
                goods_price:[{ required: true, message: '请输入商品价格', trigger: 'blur' }],
                goods_number:[{ required: true, message: '请输入商品重量', trigger: 'blur' }],
                goods_weight:[{ required: true, message: '请输入商品数量', trigger: 'blur' }],
                goods_cat:[{ required: true, message: '请选择商品分类', trigger: 'blur' }],
            },
            //获取参数或者属性
            selWay:'',
            manyParamsData:[],
            onlyParamsData:[],
            // 上传图片信息
            dialogImageUrl: '',
            dialogVisible: false,
            uploadUrl:'http://timemeetyou.com:8889/api/private/v1/upload',
             headerObj:{
                Authorization:window.sessionStorage.getItem('token')
            },
        }
    },
    created(){
        this.getCateInfo();
    },
    methods:{
        getCateInfo(){
            $http({
                    method:"get",
                    url:'categories',
                    params:{
                        type:3
                    }
                }).then(res=>{
                    if(res.meta.status == 200 ){
                       this.categoryInfo = res.data
                    }
                })
        },
        //获取参数或者属性
         getParamsList(){
            $http({
                method:"get",
                url:'categories/'+this.form.goods_cat[2]+'/attributes',
                params:{
                    sel:this.selWay
                }
            }).then(res=>{
                if(res.meta.status == 200){
                    
                    if(this.selWay == 'many'){
                        res.data.map(item => {
                        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : []; //解决attr_val为空字符串时的问题
                        });
                        this.manyParamsData = res.data;
                        // console.log(this.manyParamsData);
                    }
                    if(this.selWay == 'only'){
                        this.onlyParamsData = res.data;
                        // console.log(this.onlyParamsData);
                    }
                }
            })
        },
        //监听tab-pan跳转，如果没有选择阐述，则不允许跳转
        beforeTabLeave(activeName, oldActiveName) {
                if (oldActiveName === "1" && this.form.goods_cat.length !== 3) {
                    this.$message.error("请选择分类！");
                    return false;
        }
        },
        // 改变侧边导航是触发
        selectClick(){
            if(this.activeStep == '2'){
                this.selWay = 'many'
                this.getParamsList();
            }
            if(this.activeStep == '3'){
                
                this.selWay = 'only';
                this.getParamsList();
            }
            
        },
        // 选择分类是触发
        changeHandle(){
            if (this.form.goods_cat.length !== 3) {
                this.form.goods_cat = [];
            }
        },
        // 上传图片使用的方法监听
        //删除图片
        handleRemove(file, fileList) {
        var index = this.form.pics.findIndex(x => x.pic === file.response.data.tmp_path);
        this.form.pics.splice(index,1);
        },
        //图片预览
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        //图片上传成功后的处理函数
        uploadSuccess(res){
            if(res.meta.status == 200){
                const picInfo = {pic:res.data.tmp_path};
                this.form.pics.push(picInfo);
            }
        },
        // 添加商品
        addGoods(){
            this.$refs.form.validate(valid=>{
                if(valid){
                    
                    this.form.goods_cat = this.form.goods_cat.toString();
                    this.manyParamsData.forEach(item=>{
                        this.form.attrs.push({
                            attr_id:item.attr_id,
                            attr_value:item.attr_vals.join("")
                        })
                    })
                    this.onlyParamsData.forEach(item=>{
                        this.form.attrs.push({
                            attr_id:item.attr_id,
                            attr_value:item.attr_vals
                        })
                    })
                    console.log(this.form);
                    $http({
                        method:'post',
                        url:'goods',
                        data:{
                            goods_name:this.form.goods_name,
                            goods_cat:this.form.goods_cat,
                            goods_price:this.form.goods_price,
                            goods_number:this.form.goods_number,
                            goods_weight:this.form.goods_weight,
                            goods_introduce:this.form.goods_introduce,
                            pics:this.form.pics,
                            attrs:this.form.attrs
                        }
                    }).then(res=>{
                        if(res.meta.status == 200){
                            this.$message.success("添加商品成功！")
                        }else{
                            this.$message.error("添加商品失败！");
                        }
                    })
                }else{
                    this.$message.error("请填写表单！")
                }
            })
        }
    }
}
</script>

<style scoped>
    .el-alert{height: 40px;}
    .el-steps{margin-top: 30px;}
    .el-tabs{margin-top: 30px;font-size: 14px;}
    .el-tag{margin:10px}
    .el-checkbox-group{margin-left: 10px;}
    .el-button--primary{margin-top: 20px;}
</style>