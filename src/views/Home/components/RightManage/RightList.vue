<template>
    <div class="rights">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/initial' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-table :data="RightLists" stripe border>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="authName" label="权限名称"></el-table-column>
            <el-table-column prop="path" label="路径"></el-table-column>
            <el-table-column prop="level" label="权限等级">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level == 0" type="success">一级</el-tag>
                    <el-tag v-if="scope.row.level == 1" type="warning">二级</el-tag>
                    <el-tag v-if="scope.row.level == 2">三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
        </el-card>
        
    </div>
</template>
<script>
import $http from 'network/http'
export default {
    data() {
      return {
        RightLists: []
      }
    },
    created(){
        this.getRightLists();
    },
    methods:{ 
        getRightLists(){
            $http({
                method:'get',
                url:'rights/list',
            }).then(res=>{
                if(res.meta.status == 200){
                    this.RightLists = res.data;
                }
            })
        }
    }
}
</script>

<style scoped>
</style>