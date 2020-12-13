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
        <el-table-column label="属性值列表" :data="attrLists">
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
          <template v-slot="{ row }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="update(row)"
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
    <!-- 修改属性的组件 -->
    <el-card class="box-card" style="margin-top: 20px" v-show="!isShowList">
      <!-- 上面属性名 -->
      <el-form ref="form" :model="attr" inline>
        <el-form-item label="属性名">
          <el-input v-model="attr.attrName"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" icon="el-icon-plus" @click="add"
        >添加属性</el-button
      >
      <el-table
        :data="attr.attrValueList"
        border
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column type="index" label="序号" align="center" width="70">
        </el-table-column>
        <el-table-column label="属性值列表====">
          <!-- scope代表代表当前行数据 primary -->
          <!-- 给对象中设置一个edit属性当属性为true时显示input,属性为fasle时显示文本 -->
          <template slot-scope="scope">
            <span v-if="!scope.row.edit" @click="edit(scope.row)">{{
              scope.row.valueName
            }}</span>
            <el-input
              @blur="lsoeFocus(scope.row, scope.$index)"
              @keyup.enter.native="lsoeFocus(scope.row, scope.$index)"
              v-model="scope.row.valueName"
              v-else
              size="mini"
              ref="input"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              @click="del(row.$index)"
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="updateAttrList">确认修改</el-button>
      <el-button @click="isShowList = true">取消</el-button>
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
      // trademarkList: [],
      attrLists: [],
      attr: {
        attrName: "",
        attrValueList: [],
      },
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
    handleShowList() {
      this.isShowList = !this.isShowList;
    },
    //修改属性，显示修改属性页面，并且把当行数据赋值给attr展示到修改属性页面
    update(row) {
      // this.attr.attrValueList = row.attrValueList;
      // this.attr.attrName = row.attrName;
      this.isShowList = false;
      //深度克隆防止对象中的对象还存在引用关系
      this.attr = JSON.parse(JSON.stringify(row));
      // console.log(a);
    },
    //添加edit标识
    edit(row) {
      //可以给当前对象设置响应式数据
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    //失去焦点时就将edit的状态改变
    // scope上的￥index表示的是第几条数据
    // row就表示当行数据了直接更改想要更改的数据就行
    lsoeFocus(row, index) {
      //input失去焦点时如果没有填写数据在input中的话那么就把这个对象从attrValueList中删除
      if (!row.valueName) {
        this.attr.attrValueList.splice(index, 1);
        return;
      }
      row.edit = false;
    },
    //添加属性,并使的input获取焦点
    add() {
      this.attr.attrValueList.push({ edit: true });
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    //删除当行数据
    del(index) {
      this.attr.attrValueList.splice(index, 1);
    },

    //确定更新属性
    async updateAttrList() {
      const result = await this.$API.attr.getUpdateAttrlist(this.attr);
      console.log(result);
      if (result.code === 200) {
        this.$message.success("属性更爱成功");
        this.isShowList = true;
      } else {
        this.$message.error("数据请求失败");
      }
    },
    //点击第三级列表时请求到属性列表数据
    async handleChange3() {
      const result = await this.$API.attr.getAttrList(this.category);
      if (result.code === 200) {
        this.$message.success("数据请求成功");
        this.$emit("change", result.data);
      } else {
        this.$message.error("数据请求失败");
      }
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
