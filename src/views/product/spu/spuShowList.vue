<template>
  <div>
    <el-card class="box-card" style="margin-top: 20px">
      <el-button type="primary" icon="el-icon-plus">添加SPU</el-button>
      <el-table :data="pageList" border style="width: 100%; margin: 20px 0">
        <el-table-column type="index" label="序号" align="center" width="80">
        </el-table-column>
        <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
        <el-table-column label="SPU描述" prop="description">
          <!-- scope代表代表当前行数据 primary
          <template slot-scope="scope">
            <el-tag
              style="margin-right: 2px"
              type="danger"
              v-for="attrValue in scope.row.attrValueList"
              :key="attrValue.id"
              >{{ attrValue.valueName }}</el-tag
            >
          </template> -->
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="socpe">
            <el-button
              type="warning"
              icon="el-icon-plus"
              size="mini"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="update(socpe.row)"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-warning"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        :class="['el-input-pagination']"
        align="right"
        @size-change="getPageList(page, $event)"
        @current-change="getPageList($event, limit)"
        :page-sizes="[3, 6, 9]"
        :page-size.sync="limit"
        :current-page="page"
        layout="prev, pager, next,jumper,sizes,total"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "spuShowList",
  data() {
    return {
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      pageList: [],
      limit: 3,
      page: 1,
      total: 0,
    };
  },
  methods: {
    handleCategoryChange(category) {
      this.category = category;
      const { page, limit } = this;
      this.getPageList(page, limit);
    },
    async getPageList(page, limit) {
      const { category3Id } = this.category;
      const result = await this.$API.spu.getSpuList({
        category3Id,
        page,
        limit,
      });
      if (result.code === 200) {
        this.$message.success("请求数据成功");
        // this.page = result.data.current;
        // this.limit = result.data.size;
        this.total = result.data.total;
        this.pageList = result.data.records;
      } else {
        this.$message.error("请求数据失败");
      }
      // console.log(result);
    },
    clearList() {
      this.pageList = [];
    },
    update(row) {
      this.$bus.$emit("switchShow", row);
    },
  },
  mounted() {
    this.$bus.$on("change", this.handleCategoryChange);
    this.$bus.$on("clearList", this.clearList);
  },
  beforeDestroy() {
    this.$bus.$off("change", this.handleCategoryChange);
    this.$bus.$off("clearList", this.clearList);
  },
};
</script>

<style lang="sass" scoped>
.el-input-pagination
  margin-left: 250px
</style>
