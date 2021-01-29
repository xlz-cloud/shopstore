<template>
    <div class="roles">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/initial' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-button type="primary" @click="addRole">添加角色</el-button>
           <el-table
                :data="rolesListInfo"
                style="width: 100%" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row v-for="(item,index) in scope.row.children" :key="item.id"
                        :class="['bdbottom',index === 0?'bdtop':'','vcenter']">
                        <!-- 渲染一级权限列表 -->
                            <el-col :span="5">
                                <el-tag closable type="primary" @close="closeHandle(item.id,scope.row)">{{item.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级权限列表 -->
                            <el-col :span="19">
                                <el-row v-for="(item1,index1) in item.children" :key="item1.id"
                                :class="[index1 === 0?'':'bdtop','vcenter']">
                                    <el-col :span="6">
                                        <el-tag type="warning" closable @close="closeHandle(item1.id,scope.row)">{{item1.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="success" closable v-for="item2 in item1.children" :key="item2.id" @close="closeHandle(item2.id,scope.row)">{{item2.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle @click="editRoleHandle(scope.row)"></el-button>
                        <el-button type="warning" icon="el-icon-setting" circle @click="getRightHandle(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle @click="deleteRole(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>


        <add-role-dialog :dialogVisible="dialogVisible" @close="addDialogClose" @addRoleFrom="addRoleFrom"></add-role-dialog>
        <edit-role-dialog :editRoleInfo="editRoleInfo" :editRoleDialogVisible="editRoleDialogVisible" @EditRoleFrom="EditRoleFromHandle" @close="editDialogCloseHandle"></edit-role-dialog>
        <get-right-dialog :rightList="rightList" :currentUserRight="currentUserRight" :rightDialogVisible="rightDialogVisible" 
        @rights="rightsHandle" @close="rightCloseHandle"></get-right-dialog>
    </div>
    
</template>
<script>
import $http from 'network/http'


const AddRoleDialog = ()=> import('views/Home/components/DialogComponents/addRoleDialog')
const EditRoleDialog = ()=> import('views/Home/components/DialogComponents/editRoleDialog')
const GetRightDialog = ()=> import('views/Home/components/DialogComponents/getRightDialog')

export default {
    data(){
        return {
            rolesListInfo:[],
            //添加角色对话框显示
            dialogVisible:false,
            //编辑角色对话框显示
            editRoleDialogVisible:false,
            editRoleInfo:{},
            //控制分配权限对话框显示
            rightDialogVisible:false,
            //权限列表
            rightList:{},
            // 当前授权的对象
            userRightInfo:{},
            //当前选中用户对象的授权ID
            currentUserRight:[]
        }
    },
    created(){
        this.getRolesList();
    },
    methods:{
        //获取角色列表信息
        getRolesList(){
            $http({
                method:'get',
                url:'roles'
            }).then(res=>{
                if(res.meta.status == 200){
                    this.rolesListInfo = res.data
                }
            })
        },
        // 处理取消授权操作
        closeHandle(rightsId,role){
            $http({
                method:'delete',
                url:'roles/'+role.id+'/rights/'+rightsId
            }).then(res=>{
                if(res.meta.status == 200){
                    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                        this.$message({
                            type: 'success',
                            message: '取消权限成功!'
                        });
                        role.children = res.data;//将返回数据直接返回给role不用重新刷新页面
                        }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除权限！'
                        });          
                        });
                }
            })
        },
        //添加角色
        addRole(){
            this.dialogVisible = !this.dialogVisible
        },
        addDialogClose(){
            this.dialogVisible = !this.dialogVisible
        },
        //获取添加角色对话框数据，并调用回调函数清空表单
        addRoleFrom(roleForm){
            $http({
                method:'post',
                url:'roles',
                data:{
                    roleName:roleForm.ruleForm.roleName,
                    roleDesc:roleForm.ruleForm.roleDesc
                }
            }).then(res=>{
                console.log(res);
                if(res.meta.status == 201){
                    this.$message.success("添加角色成功！");
                    this.getRolesList();
                    roleForm.clearForm();
                }
            })
        },
        //删除角色
        deleteRole(roleInfo){
            this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            $http({
                                method:'delete',
                                url:'roles/'+roleInfo.id
                            }).then(res=>{
                                if(res.meta.status == 200){
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getRolesList()
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
        //编辑角色
        editRoleHandle(roleInfo){
            this.editRoleDialogVisible = !this.editRoleDialogVisible;
            console.log(roleInfo);
            this.editRoleInfo = roleInfo;
        },
        editDialogCloseHandle(){
            this.editRoleDialogVisible = !this.editRoleDialogVisible;
        },
        EditRoleFromHandle(editRoleInfo){
            $http({
                method:'put',
                url:'roles/'+editRoleInfo.editRoleInfo.id,
                data:{
                    roleName:editRoleInfo.editRoleInfo.roleName,
                    roleDesc:editRoleInfo.editRoleInfo.roleDesc
                }
            }).then(res=>{
                if(res.meta.status == 200){
                    this.$message.success("更新角色成功！");
                    this.getRolesList();
                }else{
                    this.$message.error("更新角色失败！")
                }
            })
        },
        getRightHandle(userRole){
            this.rightDialogVisible = !this.rightDialogVisible;
            $http({
                method:'get',
                url:'rights/tree'
            }).then(res=>{
                if(res.meta.status == 200){
                    this.rightList = res;
                    this.userRightInfo = userRole;
                    this.getUserRightId(this.userRightInfo,this.currentUserRight)
                }
            })
        },
        //获取当前选中的角色的权限ID
        getUserRightId(user,rightArr){
            if(!user.children)return rightArr.push(user.id);
            user.children.forEach(item=>
            this.getUserRightId(item,rightArr))
            
      },
        //拿到新授权的数据发起授权请求
        rightsHandle(rights){
            this.rightDialogVisible = !this.rightDialogVisible
            $http({
                method:'post',
                url:'roles/'+this.userRightInfo.id+'/rights',
                data:{
                    rids:rights.join(",")
                }
            }).then(res=>{
                if(res.meta.status == 200){
                    this.$message.success("角色授权成功！");
                    this.getRolesList();
                }else{
                    this.$message.error();("角色授权失败！");
                }
            })
        },
        rightCloseHandle(){
            this.rightDialogVisible = !this.rightDialogVisible
        },
       
    },
    components:{
        AddRoleDialog,
        EditRoleDialog,
        GetRightDialog

    }
}
</script>

<style scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>