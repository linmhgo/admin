<template>
  <el-card>
    <el-table :data="skuList.records" border style="width: 100%">
      <el-table-column type="index" label="序号" width="100" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="150">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述"> </el-table-column>
      <el-table-column prop="skuDesc" label="默认图片" align="center">
        <template v-slot="{ row }">
          <img :src="row.skuDefaultImg" alt="" class="imgSize" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量价格"> </el-table-column>
      <el-table-column prop="price" label="价格(元)"> </el-table-column>
      <el-table-column
        prop="address"
        label="操作"
        style="display: flex"
        width="300"
      >
        <template v-slot="{ row }">
          <el-button
            v-if="row.isSale"
            type="warning"
            icon="el-icon-bottom"
            size="mini"
            @click="cancelSale(row)"
          ></el-button>
          <el-button
            v-else
            type="warning"
            icon="el-icon-top"
            size="mini"
            @click="onlSale(row)"
          ></el-button>
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            :plain="true"
            @click="open"
          ></el-button>

          <el-button
            type="warning"
            icon="el-icon-warning"
            size="mini"
            @click="partPage(row)"
          ></el-button>
          <el-popconfirm
            title="这是一段内容确定删除吗？"
            @onConfirm="deleteSku(row)"
          >
            <el-button
              slot="reference"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 抽屉 -->
    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      :with-header="false"
      size="50%"
    >
      <el-row :gutter="20">
        <el-col :span="6" :push="4"
          ><div class="grid-content bg-purple weight">名称</div></el-col
        >
        <el-col :span="6" :push="4"
          ><div class="grid-content bg-purple">
            {{ skuPartPage.skuName }}
          </div></el-col
        >
      </el-row>
      <!-- 描述 -->
      <el-row :gutter="20">
        <el-col :span="6" :push="4"
          ><div class="grid-content bg-purple weight">描述</div></el-col
        >
        <el-col :span="6" :push="4"
          ><div class="grid-content bg-purple">
            {{ skuPartPage.skuDesc }}
          </div></el-col
        >
      </el-row>
      <!-- 价格 -->
      <el-row :gutter="20">
        <el-col :span="6" :push="4"
          ><div class="grid-content bg-purple weight">价格</div></el-col
        >
        <el-col :span="6" :push="4"
          ><div class="grid-content bg-purple">
            {{ skuPartPage.price }}
          </div></el-col
        >
      </el-row>
      <!-- 平台属性 -->
      <el-row :gutter="20">
        <el-col :span="6" :push="4"
          ><div class="grid-content bg-purple weight">平台属性</div></el-col
        >
        <el-col :span="6" :push="4"
          ><div class="grid-content bg-purple">
            {{ skuPartPage.price }}
          </div></el-col
        >
      </el-row>
      <!-- 销售属性 -->
      <el-row :gutter="20">
        <el-col :span="6" :push="4"
          ><div class="grid-content bg-purple weight">销售属性</div></el-col
        >
        <el-col :span="6" :push="4"
          ><div class="grid-content bg-purple">
            {{ skuPartPage.price }}
          </div></el-col
        >
      </el-row>
      <!-- 轮播图 -->
      <el-row :gutter="20">
        <el-col :span="6" :push="4"
          ><div class="grid-content bg-purple weight">商品图片</div></el-col
        >
        <el-col :span="6" :push="4"
          ><div class="grid-content bg-purple">
            <div class="block">
              <el-carousel height="150px" trigger="click" class="carousel">
                <el-carousel-item
                  v-for="item in skuPartPage.skuImageList"
                  :key="item.id"
                >
                  <img :src="item.imgUrl" />
                </el-carousel-item>
              </el-carousel>
            </div></div
        ></el-col>
      </el-row>
    </el-drawer>
    <!-- 分页器 -->
    <el-pagination
      :class="['el-input-pagination']"
      align="right"
      @size-change="getSkuList(page, $event)"
      @current-change="getSkuList($event, limit)"
      :page-sizes="[5, 10, 20]"
      :page-size.sync="limit"
      :current-page="page"
      layout="prev, pager, next,jumper,sizes,total"
      :total="total"
    >
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  name: "SkuList",
  data() {
    return {
      skuList: {},
      skuPartPage: {},
      drawer: false,
      page: 1,
      limit: 10,
      total: 0,
    };
  },
  mounted() {
    this.getSkuList(this.page, this.limit);
  },
  methods: {
    //删除sku商品
    async deleteSku(row) {
      console.log(row);
      const result = await this.$API.sku.deleteSku(row.id);
      if (result.code === 200) {
        this.$message.success("删除sku商品成功");
      } else {
        this.$message.error("删除sku商品成功失敗");
      }
    },
    open() {
      this.$message("正在开发中....");
    },
    //商品上架
    async onlSale(row) {
      console.log(row);
      const result = await this.$API.sku.onSale(row.id);
      if (result.code === 200) {
        this.$message.success("商品上架成功成功");
        row.isSale = 1;
      } else {
        this.$message.error("商品上架失敗");
      }
    },
    //商品下架
    async cancelSale(row) {
      console.log(row);
      const result = await this.$API.sku.cancelSale(row.id);
      if (result.code === 200) {
        this.$message.success("商品下架成功成功");
        row.isSale = 0;
      } else {
        this.$message.error("商品下架失敗");
      }
    },
    //获取详情页信息
    async partPage(row) {
      const result = await this.$API.sku.getSkuById(row.id);
      if (result.code === 200) {
        this.drawer = true;
        this.$message.success("数据请求成功");
        this.skuPartPage = result.data;
      } else {
        this.$message.error("数据请求失败");
      }
    },
    async getSkuList(page, limit) {
      const result = await this.$API.sku.getSkuList(page, limit);
      if (result.code === 200) {
        this.$message.success("数据请求成功");
        this.skuList = result.data;
        this.limit = result.data.size;
        this.page = result.data.current;
        this.total = result.data.total;
      } else {
        this.$message.error("数据请求失败");
      }
    },
  },
};
</script>
<style lang="sass" scope>
.imgSize
  width: 150px
.cell
  display: flex
.el-carousel__item h3
  color: #475669
  font-size: 14px
  opacity: 0.75
  line-height: 150px
  margin: 0

.carousel
  width: 400px
  border: 1px solid #ccc

.el-row
  margin-bottom: 20px
  &:last-child
    margin-bottom: 0

.el-col
  border-radius: 4px

.grid-content
  border-radius: 4px
  min-height: 36px

.row-bg
  padding: 10px 0
  background-color: #f9fafc
.weight
  font-weight: 1000
.el-drawer__body
line
</style>
