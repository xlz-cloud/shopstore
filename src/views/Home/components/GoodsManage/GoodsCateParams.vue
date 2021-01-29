<template>
    <div class="params">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/initial' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- //卡片 -->
        <el-card class="box-card">
            <!-- 警告提示框 -->
        <el-alert title="注意：只能为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
        <el-row class="span_row">
            <el-col :span="16">
                <span>选择商品分类: </span>
                  <el-cascader
                    :options="categoryInfo"
                    :props="Props"
                    v-model="selectedIds"
                    @change="CateChanged"
                    clearable>
                </el-cascader>
            </el-col>
        </el-row>
        
        <!-- 显示数据区域 -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="动态参数" name="many">
                <el-button type="primary" size="mini" :disabled="btnDisabled" @click="dialogVisible=true">添加参数</el-button>
                <el-table
                :data="manyParamsData"
                style="width: 100%" border stripe>
                    <el-table-column type="expand">
                   <template slot-scope="props">
                        <el-tag v-for="(item,index) in props.row.attr_vals" :key="index" 
                        closable @close="ParamsClose(props.row,index)" type="success">{{item}}</el-tag>
                        <el-input
                            class="input-new-tag"
                            v-if="props.row.inputVisible"
                            v-model="props.row.inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(props.row)"
                            @blur="handleInputConfirm(props.row)"
                            >
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(props.row)">+ New Param</el-button>
                    </template>
                    </el-table-column>
                    <el-table-column type="index" align="center"></el-table-column>
                    <el-table-column
                    label="参数名称"
                    prop="attr_name" align="center">
                    </el-table-column>
                    <el-table-column
                    label="操作"
                     align="center">
                    <template slot-scope="props">
                        <el-button type="primary" icon="el-icon-edit" circle @click="editHandle(props.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle @click="deleteParamPropHandle(props.row)"></el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态参数" name="only">
                <el-button type="primary" size="mini" :disabled="btnDisabled" @click="dialogVisible=true">添加属性</el-button>
                <el-table
                :data="onlyParamsData"
                style="width: 100%" border stripe>
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-tag v-for="(item,index) in props.row.attr_vals" :key="index" 
                            closable @close="ParamsClose(props.row,index)" type="success">{{item}}</el-tag>
                            <el-input
                                class="input-new-tag"
                                v-if="props.row.inputVisible"
                                v-model="props.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(props.row)"
                                @blur="handleInputConfirm(props.row)"
                                >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(props.row)">+ New Param</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="index"  align="center"></el-table-column>
                    <el-table-column
                    label="属性名称"
                    prop="attr_name"  align="center">
                    </el-table-column>
                    <el-table-column
                    label="操作" align="center">
                        <template slot-scope="props">
                            <el-button type="primary" icon="el-icon-edit" circle @click="editHandle(props.row)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" circle @click="deleteParamPropHandle(props.row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        </el-card>

        <!-- //添加参数和属性对话框 -->
        <add-params-dialog :dialogVisible="dialogVisible" @close="dialogVisible=false"
        :dialogTitle="dialogTitle" @addParamAndPropFrom="addParamAndPropFromHandle"></add-params-dialog>
   
        <!-- 编辑参数和属性的对话框 -->
        <edit-param-dialog :editDialogVisible="editDialogVisible" :editObj="editObj" :dialogTitle="dialogTitle"
        @close="editDialogVisible=false" @editParamAndPropFrom="editParamAndPropFromHandle"></edit-param-dialog>
    </div>
</template>

<script>
import $http from 'network/http'


const AddParamsDialog = () => import('views/Home/components/DialogComponents/addParamsDialog')
const EditParamDialog = () => import('views/Home/components/DialogComponents/editParamDialog')

export default {
    data(){
        return {
            activeName: 'many',
            Props:{
                checkStrictly:"true",
                expandTrigger:"hover",
                value:'cat_id',
                label:'cat_name',
                children:'children',
            },
            selectedIds:[],
            CateFormData: {
                //将要添加的分类的名称
                cat_name: "",
                //父级分类的id
                cat_pid: 0,
                //分类的等级，默认要添加的是1级分类
                cat_level: 0
            },
            categoryInfo:[],
            // 默认请求动态的参数数据
            manyParamsData:[],
            onlyParamsData:[],
            //控制添加和编辑对话框显示
            dialogVisible: false,
            editDialogVisible:false,
            editObj:{}
        }
    },
    created(){
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
    methods:{
        //根据静态动态参数请求相应的参数列表
        getParamsList(){
            if(this.selectedIds.length<3){
                this.selectedIds = [];
                this.manyParamsData = [];
                this.onlyParamsData = [];
                return;
            }
            $http({
                method:"get",
                url:'categories/'+this.selectedIds[2]+'/attributes',
                params:{
                    sel:this.activeName
                }
            }).then(res=>{
                if(res.meta.status == 200){
                    res.data.map(item => {
                        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : []; //解决attr_val为空字符串时的问题
                        //用来控制添加参数的tag的显示与否
                        item.inputVisible = false;
                        //用来和tag添加参数进行数据绑定
                        item.inputValue = '';
                    });
                    if(this.activeName == 'many'){
                        this.manyParamsData = res.data;
                    }
                    if(this.activeName == 'only'){
                        this.onlyParamsData = res.data;
                    }
                }
            })
        },
        //处理删除参数下的属性函数
        ParamsClose(row,index){
            row.attr_vals.splice(index,1);
            this.addParams(row)
            console.log(row);
        },
        //添加参数和属性
        addParamsPropHandle(){
            console.log("sadasd");
        },
        //获取添加对话框传递的表单数据，发起添加请求
        addParamAndPropFromHandle(form){
            $http({
                method:'post',
                url:'categories/'+this.selectedIds[2]+'/attributes',
                data:{
                    attr_name:form.ruleForm.attr_name,
                    attr_sel:this.activeName
                }
            }).then(res=>{
                if(res.meta.status == 201){
                    this.$message.success("添加成功！");
                    form.clearForm();
                    this.getParamsList();
                }else{
                    this.$message.error("添加失败！")
                }
            })
        },
        //删除参数和属性
        deleteParamPropHandle(row){
            this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    $http({
                        method:'delete',
                        url:'categories/'+row.cat_id+'/attributes/'+row.attr_id
                    }).then(res=>{
                        if(res.meta.status == 200){
                            this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getParamsList()
                        }else{
                            tis.$message.error("删除参数成功！");
                        }
                    })
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
                });
            
        },
        //编辑参数
        editHandle(row){
            this.editObj = row;
            this.editDialogVisible = !this.EditParamsDialog
        },
        editParamAndPropFromHandle(form){
            $http({
                method:'put',
                url:'categories/'+this.selectedIds[2]+'/attributes/'+form.ruleForm.attr_id,
                data:{
                    attr_name:form.ruleForm.attr_name,
                    attr_sel:form.ruleForm.attr_sel,
                    attr_vals:form.ruleForm.attr_vals.join(" ")
                }
            }).then(res=>{
                if(res.meta.status == 200){
                    this.$message.success("更新成功！");
                    form.clearForm()
                    this.getParamsList();
                }else{
                    this.$message.error("更新失败！")
                }
            })
        },
        //选中分类触发的事件
        CateChanged(){
            this.getParamsList();
        },
        //处理点击切换触发的事件
        handleClick(){
            this.getParamsList()
        },
        handleInputConfirm(row) {
            row.inputVisible = false;
            if(row.inputValue && row.inputValue.trim().length != 0){
                row.attr_vals.push(row.inputValue.trim());
                this.inputValue = '';
                this.addParams(row);
            }
      },
      addParams(row){
          var str = row.attr_vals.join(' ')
          $http({
              method:'put',
              url:'categories/'+row.cat_id+'/attributes/'+row.attr_id,
              data:{
                attr_name:row.attr_name,
                attr_sel:row.attr_sel,
                attr_vals:str
                }
            }).then(res=>{
                if(res.meta.status == 200){
                    this.$message.success("更新参数成功！")
                    row.inputValue = '';
                }else{
                    this.$message.erroe("更新参数失败！")
                }
        })
      },
       showInput(row) {
        row.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
    },
    components:{
        AddParamsDialog,
        EditParamDialog
    },
    computed:{
       btnDisabled(){
           if(this.selectedIds.length<3) return true;
           if(this.selectedIds.length>=3) return false;
       },
       dialogTitle(){
           if(this.activeName == "many")return '动态参数';
           if(this.activeName == "only")return '静态属性';
       }
    }
}
</script>

<style scoped>
    .span_row{margin-top: 20px !important;}
    .el-tabs{margin-top: 20px;}
    .el-cascader{width: 250px;}
    .el-tag{margin-top: 20px;margin-left: 6px;}

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>