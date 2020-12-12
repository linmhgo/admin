<template>
  <div>
    <Category @change="attrList" />
    <el-card class="box-card" style="margin-top: 20px" v-show="isShowList">
      <el-button type="primary" icon="el-icon-plus">添加属性</el-button>
      <el-table :data="attrLists" border style="width: 100%; margin: 20px 0">
        <el-table-column type="index" label="序号" align="center" width="80">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column label="属性值列表">
          <!-- scope代表代表当前行数据 primary -->
          <template slot-scope="scope">
            <el-tag
              style="margin-right: 2px"
              type="danger"
              v-for="attrValue in scope.row.attrValueList"
              :key="attrValue.id"
              >{{ attrValue.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template>
            <el-button
              type="warning"
              icon="el-icon-edit"
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
    </el-card>
    <!-- 修改的组件 -->
    <el-card class="box-card" style="margin-top: 20px" v-show="!isShowList">
      <el-button type="primary" icon="el-icon-plus">添加属性</el-button>
      <el-table :data="attrLists" border style="width: 100%; margin: 20px 0">
        <el-table-column type="index" label="序号" align="center" width="80">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column label="属性值列表">
          <!-- scope代表代表当前行数据 primary -->
          <template slot-scope="scope">
            <el-tag
              style="margin-right: 2px"
              type="danger"
              v-for="attrValue in scope.row.attrValueList"
              :key="attrValue.id"
              >{{ attrValue.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template>
            <el-button
              type="warning"
              icon="el-icon-edit"
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
    </el-card>
  </div>
</template>

<script>
import Category from "./Category";

/*
attrLists:Array[5]
0:Object
attrName:"分类"
attrValueList:Array[5]
categoryId:616
categoryLevel:3
id:3468 */
export default {
  name: "AttrList",
  data() {
    return {
      trademarkList: [],
      attrLists: [],
      isShowList: true,
    };
  },
  components: {
    Category,
  },
  methods: {
    attrList(data) {
      this.attrLists = data;
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
