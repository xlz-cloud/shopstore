<template>
    <div id="home">
        <el-container class="home-container">
            <el-header class="home-header">
                <home-head></home-head>
            </el-header>
            <el-container>
                <el-aside :width="tag ? '64px' : '200px'">
                    <tabbar @extendtion="extendtion" :menudata="memuData" :iconList="iconList"></tabbar>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
import $http from 'network/http'

const Tabbar = () => import('components/common/tabbar')
const HomeHead = () => import('views/Home/components/Head')
export default {
    data() {
        return {
            tag:false,
            memuData:{},
            iconList:{
                '0':'iconfont iconuser',
                '1':'iconfont icontijikongjian',
                '2':'iconfont iconshangpin',
                '3':'iconfont icondanju',
                '4':'iconfont iconbaobiao'
            },
        }
    },
    created(){
        $http({
            url:'menus',
            method:'get'
        }).then(res=>{
            if(res.meta.status==200){
                this.memuData = res;
            }else{
                this.$message.error("获取表单数据失败！")
            }
        })
    },
    methods:{
        extendtion(tag){
            this.tag = tag;
        }
    },
    components: { 
        Tabbar,
        HomeHead
    }
    
}
</script>

<style scoped>
#home{width: 100%;height: 100%;}
.home-container{height: 100%;width: 100%;}
.home-header{height: 63px !important;padding: 0;}
.el-aside{background-color:#262833;transition: 0.27s;}
.el-main{background-color: #eaedf1;}
</style>