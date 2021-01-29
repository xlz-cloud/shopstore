<template>
    <div class="categories">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/initial' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-button type="primary" @click="addCategryHandle">添加分类</el-button>
           <!-- 树形表格 -->
            <zk-table :data="GoodsCategoryList.result" :columns="columns" index-text="ID" stripe border show-index :selection-type="false" :expand-type = "false">
                <template slot="isEfficient" slot-scope="scope">
                    <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color:lightgreen;font-size:16px"></i>
                    <i class="el-icon-error" v-else style="color:red;font-size:16px"></i>
                </template>
                <template slot="sort" slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag type="warning" v-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag type="danger" v-if="scope.row.cat_level===2">三级</el-tag>
                </template>
                <template slot="handle" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle @click="editHandle(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle @click="deleteHandle(scope.row)"></el-button>
                </template>
            </zk-table>
            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryinfomation.pagenum"
                :page-sizes="[4, 8, 16,32]"
                :page-size="queryinfomation.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="GoodsCategoryList.total"
                >
            </el-pagination>  
        </el-card>
        <!-- 添加分类对话框 -->
        <add-category-dialog :categoryInfo="categoryInfo" :dialogVisible="dialogVisible" @addCateFrom="addCateFrom" @close="addDialogClose"></add-category-dialog>
        <edit-category-dialog :editDialogVisible="editDialogVisible" 
        :editCategoryInfo="editCategoryInfo" @close="editCateClose" @editCateFrom="editCateFromHandle"></edit-category-dialog>
    </div>
</template>
<script>
import $http from 'network/http'

const AddCategoryDialog = () => import('views/Home/components/DialogComponents/addCategoryDialog')
const EditCategoryDialog = () => import('views/Home/components/DialogComponents/editCategoryDialog')

export default {
    data(){
        return {
            //用于发送请求的信息
            queryinfomation:{
                type:3,
                pagenum:1,
                pagesize:4
            },
            // 存储分类数据
            GoodsCategoryList:{},
            //树形表格的列设置
            columns: [
                {label: '分类名称',prop: 'cat_name',},
                {label: '是否有效',type: 'template',align:'center',template: 'isEfficient',},
                {label: '排序',type: 'template',align:'center',template: 'sort',},
                {label: '操作',align:'center',type: 'template',template: 'handle',}
            ],
            //控制添加分类对话框显示与否
            dialogVisible:false,
            //存储当前分类的信息，发送给添加对话框
            categoryInfo:[],
            //控制编辑对话框的显示与否
            editDialogVisible:false,
            // 存储当前修改的分类信息，发送给编辑对话框
            editCategoryInfo:{}
        }
    },
    created(){
        this.getGoodsCategories();
    },
    methods:{
        //获取全部分类列表数据
        getGoodsCategories(){
            $http({
                    method:"get",
                    url:'categories',
                    params:this.queryinfomation
                }).then(res=>{
                    if(res.meta.status == 200 ){
                        this.GoodsCategoryList = res.data;
                    }
                })
        },
        //获取分类数据
        addCategryHandle(){
            this.dialogVisible = !this.dialogVisible
             $http({
                    method:"get",
                    url:'categories',
                    params:{
                        type:2
                    }
                }).then(res=>{
                    if(res.meta.status == 200 ){
                       this.categoryInfo = res.data
                    }
                })
        },
        //处理添加对话框收集的添加数据
        addCateFrom(formData){
            $http({
                    method:"post",
                    url:'categories',
                    data:{
                        cat_pid:formData.ruleForm.cat_pid,
                        cat_name:formData.ruleForm.cat_name,
                        cat_level:formData.ruleForm.cat_level
                    }
                }).then(res=>{
                    if(res.meta.status == 201 ){
                       this.$message.success("添加分类成功！")
                       formData.clearForm();
                       this.getGoodsCategories();
                    }else{
                        this.$message.error("添加分类失败！")
                    }
                })
        },
        //处理编辑分类信息
        editHandle(editInfo){
            this.editDialogVisible =! this.editDialogVisible
            this.editCategoryInfo = editInfo
        },
        // 拿到修改数据发送请求修改数据
        editCateFromHandle(formData){
            $http({
                method:"put",
                url:'categories/'+formData.ruleForm.cat_id,
                data:{
                    cat_name:formData.ruleForm.cat_name
                }
            }).then(res=>{
                if(res.meta.status == 200){
                    this.$message.success("更新成功！")
                    this.getGoodsCategories();
                }else{
                    this.$message.success("更新失败！")
                }
            })
        },
        //删除分类信息
        deleteHandle(deleteInfo){
            this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                $http({
                method:'delete',
                url:'categories/'+deleteInfo.cat_id
                }).then(res=>{
                    if(res.meta.status == 200){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getGoodsCategories();
                    }else{
                        this.$message.error("删除失败！")
                    }
                })
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
        },
        addDialogClose(){
            this.dialogVisible = !this.dialogVisible;
        },
        editCateClose(){
            this.editDialogVisible = !this.editDialogVisible
        },
        //监听分页变化
        handleSizeChange(val) {
            this.queryinfomation.pagesize = val;
            this.getGoodsCategories();
        },
        handleCurrentChange(val) {
            this.queryinfomation.pagenum = val;
            this.getGoodsCategories();
        }
    },
    components:{
        AddCategoryDialog,
        EditCategoryDialog
    }
}
</script>

<style scoped>
    .zk-table{margin-top: 20px;}
</style>