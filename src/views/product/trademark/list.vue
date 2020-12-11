<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <el-table :data="tableData" border style="width: 100%; margin: 20px 0">
      <el-table-column prop="date" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="name" label="品牌名称"> </el-table-column>
      <el-table-column prop="address" label="品牌LOGO">
        <template>
          <img
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607667717119&di=60fd2d55fc4a3dea2c0844c1738d37fd&imgtype=0&src=http%3A%2F%2Fa4.att.hudong.com%2F27%2F67%2F01300000921826141299672233506.jpg"
            :class="['imgwh']"
          />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <el-button type="warning" icon="el-icon-edit">修改</el-button>
        <el-button type="danger" icon="el-icon-delete">删除</el-button>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        align="right"
        :page-sizes="[3, 6, 9]"
        :page-size="100"
        layout="prev, pager, next,jumper,sizes,total"
        :total="50"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "trademark",
  data() {
    return {
      tableData: [
        {
          date: "2",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
    };
  },
};
</script>
<style lang="sass">
.imgwh
  width: 150px
.el-select
  margin-left: 250px
</style>
