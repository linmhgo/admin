<template>
  <el-card class="box-card">
    <el-form :inline="true" :model="category" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          v-model="category.category1Id"
          placeholder="请选择"
          @change="handleChange1"
          :disabled="disabled"
        >
          <el-option
            v-for="Category1 in getCategory1List"
            :label="Category1.name"
            :key="Category1.id"
            :value="Category1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="category.category2Id"
          placeholder="请选择"
          @change="handleChange2"
          :disabled="disabled"
        >
          <el-option
            v-for="Category2 in getCategory2List"
            :label="Category2.name"
            :key="Category2.id"
            :value="Category2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="category.category3Id"
          placeholder="请选择"
          @change="handleChange3"
          :disabled="disabled"
        >
          <el-option
            v-for="Category3 in getCategory3List"
            :label="Category3.name"
            :key="Category3.id"
            :value="Category3.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item> </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "Category",
  props: ["disabled"],
  data() {
    return {
      category: {
        category1Id: "", // 1级分类id
        category2Id: "",
        category3Id: "",
      },
      getCategory1List: [],
      getCategory2List: [],
      getCategory3List: [],
    };
  },
  async mounted() {
    const result = await this.$API.attr.getCategory1Id();
    if (result.code === 200) {
      this.$message.success("数据请求成功");
      this.getCategory1List = result.data;
    } else {
      this.$message.error("数据请求失败");
    }
  },
  methods: {
    //当选中一级是会发送请求二级的数据
    async handleChange1(value) {
      this.$bus.$emit("clearList");
      //选中一级分类时清空二级三级分类
      this.$bus.$emit("clearCatetroy");
      this.category.category2Id = "";
      this.category.category3Id = "";
      const result = await this.$API.attr.getCategory2Id(value);
      if (result.code === 200) {
        this.$message.success("数据请求成功");
        this.getCategory2List = result.data;
      } else {
        this.$message.error("数据请求失败");
      }
    },
    async handleChange2(value) {
      this.$bus.$emit("clearCatetroy");
      this.$bus.$emit("clearList");
      //更改二级分类的时候清空三级分类
      this.category.category3Id = "";
      const result = await this.$API.attr.getCategory3Id(value);
      if (result.code === 200) {
        this.$message.success("数据请求成功");
        this.getCategory3List = result.data;
      } else {
        this.$message.error("数据请求失败");
      }
    },
    async handleChange3(category3Id) {
      // const result = await this.$API.attr.getAttrList(this.category);
      const category = {
        ...this.category,
        category3Id,
      };
      this.$bus.$emit("change", category);
      // if (result.code === 200) {
      //   this.$message.success("数据请求成功");
      //   this.$emit("change", result.data);
      // } else {
      //   this.$message.error("数据请求失败");
      // }
    },
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
