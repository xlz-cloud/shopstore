<template>
    <div class="Head">
        <div>
            <img src="~assets/img/shop.png" alt="">
            <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="Loginout">退出</el-button>
    </div>
</template>

<script>
export default {
    methods:{
        Loginout(){
            window.sessionStorage.clear();
            this.$router.replace('/login');
        }
    }
}
</script>

<style scoped>
.Head{
    background-color:  #232c31;
    height: 63px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.Head div{display: flex;align-items: center;}
.Head img{width: 50px;height: 50px;padding-left: 5px;}
.Head span{color: white;padding-left: 10px;font-size: 20px;}
.el-button{margin-right: 60px;}
</style>