<template>
    <div class="shopList">
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/initial' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
    <!-- //卡片 -->
    <el-card class="box-card">
        <el-row :gutter="20">
            <el-col :span="8">
                <div>
                    <el-input placeholder="请输入内容" class="input-with-select" 
                    v-model="queryinfomation.query" :clearable="true" @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </div>
            </el-col>
            <el-col :span="6"><div><el-button type="primary" @click="addGoods">添加商品</el-button></div></el-col>
        </el-row>
        <!-- //表格 -->
        <el-table :data="goodsInfoList.goods"  stripe border style="width: 100%" >
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="goods_name" label="商品名称"></el-table-column>
            <el-table-column prop="goods_price" label="商品价格/元" width="90px" align="center"></el-table-column>
            <el-table-column prop="goods_weight" label="商品重量" width="90px" align="center"></el-table-column>
            <el-table-column prop="add_time" label="创建时间" width="140x"></el-table-column>
            <el-table-column prop="goods_name" label="操作" width="140px" align="center">
                <template slot-scope="props">
                    <el-button type="primary" icon="el-icon-edit" circle></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle @click="deleteGoods(props.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- //分页 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfomation.pagenum"
        :page-sizes="[4, 8, 16,32]"
        :page-size="4"
        layout="total, sizes, prev, pager, next, jumper"
        :total="goodsInfoList.total"
        >
        </el-pagination>
    </el-card>
    </div>

    
</template>

<script>
import $http from 'network/http'

export default {
     data(){
        return{
            queryinfomation:{
                query:"",
                pagenum:1,
                pagesize:4
            },
            goodsInfoList:{}
        }
    },
    created(){
       this.getGoodsList();
    },
    methods:{
        // 获取用户列表数据
        getGoodsList(){
             $http({
                    method:"get",
                    url:'goods',
                    params:this.queryinfomation
                }).then(res=>{
                    
                    if(res.meta.status == 200 ){
                        res.data.goods.map(item=>{
                            item.add_time = this.dateFormat(item.add_time);
                        })
                        this.goodsInfoList = res.data
                    }
                })
        },
        //搜索商品
        search(){
            this.queryinfomation.pagenum = 1;
            this.queryinfomation.pagesize = 4;
            this.getGoodsList();
        },
        //删除商品
        deleteGoods(row){
            this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    $http({
                        method:'delete',
                        url:'goods/'+row.goods_id
                    }).then(res=>{
                        if(res.meta.status == 200){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getGoodsList();
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
        //监听分页事件
        handleSizeChange(val) {
            this.queryinfomation.pagesize = val;
            this.getGoodsList();
        },
        handleCurrentChange(val) {
            this.queryinfomation.pagenum = val;
            this.getGoodsList();
        },
        addGoods(){
            this.$router.push('/goodAdd')
        },
        //时间格式化
        dateFormat(dateVal){
            var date = new Date(dateVal);
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var day = date.getDate()
            var hours = date.getHours()
            var seconds = date.getSeconds()
            var minutes = date.getMinutes();
            if(month < 10){
                month = "0" + month;
            }
            if(day < 10){
                day = "0" + day;
            }
            if(hours < 10){
                hours = "0" + hours;
            }
            if(seconds < 10){
                seconds = "0" + seconds;
            }
            if(minutes < 10){
                minutes = "0" + minutes;
            }
            return year+"-"+month+"-"+day+" "+hours+":"+seconds+":"+minutes;
        }
    },
    components:{
        
    },
    computed:{
        
    }

}
</script>

<style scoped>
    .el-table{font-size: 12px;}
</style>