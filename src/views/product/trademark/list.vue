<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <el-table :data="trademarkList" border style="width: 100%; margin: 20px 0">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <!-- scope代表代表当前行数据 primary -->
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button type="warning" icon="el-icon-edit">修改</el-button>
        <el-button type="danger" icon="el-icon-delete">删除</el-button>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        align="right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[3, 6, 9]"
        :page-size.sync="limit"
        :current-page="current"
        layout="prev, pager, next,jumper,sizes,total"
        :total="total"
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
      trademarkList: [], //当前页面数据
      current: 1, //当前页数
      limit: 3, //每页显示数据
      total: 0, //总数据条数
    };
  },
  mounted() {
    this.getTrademarkList(this.current, this.limit);
  },
  methods: {
    // 当从当前第八页每页显示三条跳转到每页6条时，因为更改每页显示的数据且当前页数也 进行了更改
    //所有发送了两次请求，handleCurrentChange是第二个触发的当时他所携带的当前页像素数据的数量
    // 确不是6条而是之前的三条，这里就要使用到.sync使得数据同步即可,page-size.sync

    async getTrademarkList(current, size) {
      const trademarkList = await this.$API.product.getTrademark(current, size);
      // console.log(trademarkList);
      //判断请求的数据是否成功，判断功能是否成功在拦截器中已经判断
      if (trademarkList.code === 200) {
        this.$message.success("请求数据成功");
        this.trademarkList = trademarkList.data.records;
        this.limit = trademarkList.data.size;
        this.current = trademarkList.data.current;
        this.total = trademarkList.data.total;
      } else {
        this.$message.error("请求数据失败");
      }
    },
    handleCurrentChange(page) {
      // 切换页数重新请求数据
      this.getTrademarkList(page, this.limit);
    },
    handleSizeChange(limit) {
      //每页显示内容变更显示内容
      this.getTrademarkList(this.current, limit);
    },
  },
};
</script>
<style lang="sass">
.imgwh
  width: 150px
.el-select
  margin-left: 250px
</style>
