<template>
  <div>
    <el-card class="box-card">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="一级分类">
          <el-select v-model="formInline.region" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="formInline.region" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select v-model="formInline.region" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item> </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" style="margin-top: 20px">
      <el-button type="primary" icon="el-icon-plus">添加属性</el-button>
      <el-table
        :data="trademarkList"
        border
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column type="index" label="序号" align="center" width="80">
        </el-table-column>
        <el-table-column prop="tmName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column label="属性值列表">
          <!-- scope代表代表当前行数据 primary -->
          <template slot-scope="scope">
            <img :src="scope.row.logoUrl" :class="['imgwh']" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template>
            <el-button type="warning" icon="el-icon-edit">修改</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "AttrList",
  data() {
    return {
      formInline: {
        user: "",
        region: "",
      },
    };
  },
};
</script>

<style lang="sass">
.text
  font-size: 14px

  .item
    margin-bottom: 18px

  .clearfix:before,
  .clearfix:after
    display: table
    content: ""

  .clearfix:after
    clear: both

  .box-card
    width: 480px
</style>
