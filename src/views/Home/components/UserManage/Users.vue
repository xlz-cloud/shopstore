<template>
    <div class="app">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/initial' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
    <!-- //卡片 -->
    <el-card class="box-card">
        <el-row :gutter="20">
            <el-col :span="8">
                <div>
                    <el-input placeholder="请输入内容" class="input-with-select" 
                    v-model="queryinfomation.query" :clearable="true" @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
                    </el-input>
                </div>
            </el-col>
            <el-col :span="6"><div><el-button type="primary" @click="addUser">添加用户</el-button></div></el-col>
        </el-row>
        <!-- //表格 -->
        <el-table :data="userlistInfo.users" stripe border style="width: 100%" >
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="username" label="姓名"></el-table-column>
            <el-table-column prop="email" label="邮箱" ></el-table-column>
            <el-table-column prop="mobile" label="电话"></el-table-column>
            <el-table-column prop="role_name" label="角色"></el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    <el-switch
                    v-model="scope.row.mg_state"
                    active-color="#13ce66"
                    inactive-color="#ff4888"
                    @change="changeHandle(scope.row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="220">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle @click="modifyHandle(scope.row.id)"></el-button>
                    <el-button type="warning" icon="el-icon-setting" circle  @click="allotHandle(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle  @click="deleteHandle(scope.row.id)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- //分页 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userlistInfo.pagenum"
        :page-sizes="[4, 8, 16,32]"
        :page-size="4"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userlistInfo.total">
        </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <add-dialog :dialogVisible="dialogVisible" @addUserFrom="addUserhandle" @close="closeHandle"></add-dialog>
    <!-- 编辑用户对话框 -->
    <edit-dialog :editDialogVisible="editDialogVisible" :editUserInfo="editUserInfo" 
    @editUserFrom="editUserhandle" @close="EditCloseHandle"></edit-dialog>

    <!-- 设置权限对话框 -->
    <right-control-dailog :rightDialogVisible="rightDialogVisible" 
    :rightControlInfo="rightControlInfo" :currentUser="currentUser" 
    @close="rightDialogVisible=false" @RightFrom="RightFromHandle"></right-control-dailog>
    </div>
</template>

<script>

import $http from 'network/http'

const AddDialog = () => import('views/Home/components/DialogComponents/addDailog')
const EditDialog = () => import('views/Home/components/DialogComponents/editDailog')
const RightControlDailog = () => import('views/Home/components/DialogComponents/rightControlDailog')

export default {
    
    data(){
        return{
            queryinfomation:{
                query:"",
                pagenum:1,
                pagesize:4
            },
            // 添加用户对话框
            dialogVisible:false,
            userlistInfo:{},
            //编辑对话框控制
            editDialogVisible:false,
            editUserInfo:{},
            // 权限对话框控制
            rightDialogVisible:false,
            rightControlInfo:[],
            //储存当前分配角色的用户信息
            currentUser:{}
        }
    },
    created(){
       this.getUserList();
    },
    methods:{
        // 获取用户列表数据
        getUserList(){
             $http({
                    method:"get",
                    url:'users',
                    params:this.queryinfomation
                }).then(res=>{
                    if(res.meta.status == 200 ){
                        this.userlistInfo = res.data
                    }
                })
        },
        addUser(){
            this.dialogVisible = !this.dialogVisible;
        },
        //拿到表单数据执行添加操作
        addUserhandle(form){
            $http({
                method:'post',
                url:'users',
                data:form.ruleForm
            }).then(res=>{
                if(res.meta.status == 201){
                    this.$message.success("添加用户成功");
                    this.getUserList();
                    form.clearForm();
                }else{
                    this.$message.error("添加用户失败");
                }
            })
        },
        closeHandle(){
            this.addUser();
        },
        //修改用户信息
        modifyHandle(id){
            $http({
                method:'get',
                url:'users/'+id,
            }).then(res=>{
                this.editUserInfo = res.data;
            })
            this.editDialogVisible =!this.editDialogVisible
        },
        editUserhandle(form){
              $http({
                method:'put',
                url:'users/'+form.editUserInfo.id,
                data:{
                    email:form.editUserInfo.email,
                    mobile:form.editUserInfo.mobile
                }
            }).then(res=>{
                if(res.meta.status == 200){
                    this.$message.success("更新用户成功");
                    this.getUserList();
                    form.clearForm();
                }else{
                    this.$message.error("更新用户失败");
                }
            })
        },
        EditCloseHandle(){
            this.editDialogVisible = !this.editDialogVisible;
        },
        //分配权限
        allotHandle(row){
            this.currentUser = row
            $http({
                method:'get',
                url:'roles'
            }).then(res=>{
                if(res.meta.status == 200){
                    this.rightControlInfo = res.data
                    this.rightDialogVisible = !this.rightDialogVisible
                }
            })
        },
        //分陪权限发起请求
        RightFromHandle(form){
            
            $http({
                method:'put',
                url:'users/'+this.currentUser.id+'/role',
                data:{
                    rid:form.rightControlInfo
                }
            }).then(res=>{
                if(res.meta.status == 200){
                    this.$message.success("设置角色成功！")
                    this.getUserList();
                    form.clearForm();
                }else{
                    this.$message.error("设置角色失败！")
                    form.clearForm();
                }
            })
        },
        //删除用户
        deleteHandle(id){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    $http({
                        method:'delete',
                        url:'users/'+id,
                    }).then(res=>{
                        if(res.meta.status == 200){
                            this.$message.success("删除用户成功！")
                            this.getUserList();
                        }else{
                            this.$message.success("删除用户失败！")
                        }
                    })
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
                }); 
        },
        //搜索用户
        searchUser(){
            this.queryinfomation.pagenum = 1;
            this.queryinfomation.pagesize = 4;
            $http({
                method:'get',
                url:'users',
                params:this.queryinfomation
            }).then(res=>{
                if(res.meta.status == 200){
                    this.getUserList();
                }
            })
        },
        //更新用户状态
        changeHandle(scoperow){
            $http({
                method:'put',
                url:'users/'+scoperow.id+'/state/'+scoperow.mg_state
            }).then(res=>{
                if(res.meta.status == 200){
                    this.$message.success("更新用户状态成功！")
                    this.getUserList();
                }else{
                    this.$message.error("更新用户状态失败！")
                }
            })
        },
        //监听分页事件
        handleSizeChange(val) {
            this.queryinfomation.pagesize = val;
            this.getUserList();
        },
        handleCurrentChange(val) {
            this.queryinfomation.pagenum = val;
            this.getUserList();
        }
    },
    components:{
        EditDialog,
        AddDialog,
        RightControlDailog
    }
}
</script>

<style scoped>

</style>