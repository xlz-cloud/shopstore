<template>
    <div class="tabbar">
        <div @click="extendtion" class="extendtion">+</div>
        <el-menu text-color="white" background-color="#262833" :default-active="currentpath" 
        class="el-menu-vertical-demo" active-text-color="#409BFF" 
        :collapse="isCollapse" :unique-opened="true"
        :collapse-transition="false" :router="true" >
          <el-submenu :index="item.id + ''" v-for="(item,num) in menudata.data" :key="item.id" >
              <template slot="title">
                <i :class="iconList[num]" class="margin-r"></i>
                <span slot="title">{{item.authName}}</span>
              </template>
              <el-menu-item :index="one.path" v-for="one in item.children" :key="one.id" @click="savePath(one.path)">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span slot="title">{{one.authName}}</span>
                </template>
              </el-menu-item>
          </el-submenu>
        </el-menu>
    </div>
</template>
<script>
export default {
    data() {
      return {
        isCollapse: false,
        currentpath:window.sessionStorage.getItem('currentpath')
      }
    },
    props:{
      menudata:{
        type:Object,
        default(){
          return{}
        }
      },
      iconList:{
        type:Object,
        default(){
          return{}
        }
      }
    },
    methods: {
      extendtion(){
        this.isCollapse = !this.isCollapse;
        this.$emit("extendtion",this.isCollapse);
      },
      savePath(path){
        window.sessionStorage.setItem("currentpath",path)
      }
    }
}
</script>

<style scoped>
 .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 50px;
  }
  .extendtion{color: white;text-align: center;background-color: #75778d;width: 100%;cursor: pointer;}
  .el-menu{border-right:none}
  .margin-r{margin-right: 10px;}
</style>