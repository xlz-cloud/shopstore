<template>
    <div class="shopList">
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/initial' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
    <!-- //卡片 -->
    <el-card class="box-card">
        <el-row :gutter="20">
            <el-col :span="8">
                <div>
                    <el-input placeholder="请输入内容" class="input-with-select" 
                    v-model="queryinfomation.query" :clearable="true" @clear="getOrderList">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </div>
            </el-col>
        </el-row>
        <!-- //表格 -->
        <el-table :data="ordersInfoList.goods" border style="width: 100%" >
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="order_number" label="订单编号" align="center"></el-table-column>
            <el-table-column prop="order_price" label="订单价格" align="center"></el-table-column>
            <el-table-column label="是否付款" align="center">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.pay_status!=0">已付款</el-tag>
                    <el-tag type="warning" v-else>未付款</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="is_send" label="是否发货" align="center"></el-table-column>
            <el-table-column prop="create_time" label="下单时间" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="props">
                    <el-button type="primary" icon="el-icon-edit" circle @click="dialogVisible = true"></el-button>
                    <el-button type="success" icon="el-icon-location" circle @click="OrderDetail(props.row)"></el-button>
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
        :total="ordersInfoList.total"
        >
        </el-pagination>
    </el-card>

    <!-- //修改地址的对话框 -->
    <edit-order-dialog :dialogVisible="dialogVisible" @close="dialogVisible=false "
    @editAdress="editAdressHandle"></edit-order-dialog>


    <!-- //显示物流进度的对话框 -->
     <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!--timeline时间线-->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
    </div>

    
</template>

<script>
import $http from 'network/http'

const editOrderDialog = () => import('views/Home/components/DialogComponents/editOrderDialog')
export default {
     data(){
        return{
            queryinfomation:{
                query:'',
                user_id:1,
                pagenum:1,
                pagesize:4
            },
            ordersInfoList:{},
            dialogVisible:false,
            progressInfo:[],
            progressVisible:false
        }
    },
    created(){
       this.getOrderList();
    },
    methods:{
        // 获取用户列表数据
        getOrderList(){
             $http({
                    method:'get',
                    url:'orders',
                    params:this.queryinfomation
                }).then(res=>{
                    if(res.meta.status == 200 ){
                        this.ordersInfoList = res.data
                    }
                })
        },
        //搜索商品
        search(){
            console.log(this.queryinfomation.query);
            this.queryinfomation.pagenum = 1;
            this.queryinfomation.pagesize = 4;
            this.getOrderList()
        },
        //修改地址,由于接口地址没有给，无法发起请求修改数据
        editAdressHandle(form){
            // console.log(form);
        },
        //订单详情
        OrderDetail(row){
            this.progressVisible = true;
            $http({
                    method:'get',
                    url:'/kuaidi/804909574412544580',
                }).then(res=>{
                    if (res.meta.status == 200) {
                        this.progressInfo = res.data;
                        
                    }
                })
        },
        //监听分页事件
        handleSizeChange(val) {
            this.queryinfomation.pagesize = val;
            this.getOrderList()
        },
        handleCurrentChange(val) {
            this.queryinfomation.pagenum = val;
            this.getOrderList()
        },
    },
    components:{
        editOrderDialog
    }
}
</script>

<style scoped>
    .el-table{font-size: 12px;}
</style>