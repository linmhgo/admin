<template>
  <div>
    <!-- 数据渲染 table-->
    <el-button type="primary" icon="el-icon-plus" @click="visible = true"
      >添加</el-button
    >
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
    <!-- @size-change="getTrademarkList(current, $event)"
      @current-change="getTrademarkList($event, limit)" 简写 $event 表示第一参数-->
    <!-- 分页 pagination-->
    <el-pagination
      align="right"
      @size-change="getTrademarkList(current, $event)"
      @current-change="getTrademarkList($event, limit)"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      :current-page="current"
      layout="prev, pager, next,jumper,sizes,total"
      :total="total"
    >
    </el-pagination>
    <!-- 添加数据弹版 el-dialog From-->
    <el-dialog title="提示" :visible.sync="visible" width="50%">
      <!-- From表单验证 -->
      <el-form
        :model="trademarkFrom"
        :rules="rules"
        ref="trademarkFrom"
        label-width="100px"
        class="demo-trademarkFrom"
      >
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="trademarkFrom.tmName"></el-input>
        </el-form-item>
      </el-form>
      <!-- upload上传组件 -->
      <!-- 后台处理了跨域的话可action="http://182.92.128.115/admin/product/fileUpload"
          后台没有处理夸域问题的话
      -->
      <el-upload
        class="avatar-uploader"
        action="http://182.92.128.115/admin/product/fileUpload"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img
          v-if="trademarkFrom.logoUrl"
          :src="trademarkFrom.logoUrl"
          class="avatar"
        />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('trademarkFrom')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
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
      visible: false,
      // 验证的图片和表单信息
      trademarkFrom: {
        logoUrl: "",
        tmName: "",
      },
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
        ],
      }, //表单验证
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
    // handleCurrentChange(page) {
    //   // 切换页数重新请求数据
    //   this.getTrademarkList(page, this.limit);
    // },
    // handleSizeChange(limit) {
    //   //每页显示内容变更显示内容
    //   this.getTrademarkList(this.current, limit);
    // },
    // 上传图片验证
    // 上传图片成功时的回调函数
    handleAvatarSuccess(res, file) {
      /*
      {
        code: 200
        data: "http://182.92.128.115:8080/group1/M00/00/95/rBFUDF_TZ86AAXOwAAAJ4fdYzmQ089.jpg"
        message: "成功"
        ok: true
      }

      */
      // console.log("之后", res, file);
      this.trademarkFrom.logoUrl = URL.createObjectURL(file.raw);
    },
    // 上传图片前执行的函数
    beforeAvatarUpload(file) {
      /* {lastModified: 1607686046372
          lastModifiedDate: Fri Dec 11 2020 19:27:26 GMT+0800 (中国标准时间) {}
          name: "8848.jpg"
          size: 2529
          type: "image/jpeg"
          uid: 1607690192315
          webkitRelativePath: ""}
          */
      // console.log("之前", file);
      const imgTyeps = ["image/jpeg", "image/pmg"];
      const isJPG = imgTyeps.indexOf(file.type) > -1;
      const isLt2M = file.size / 1024 < 50;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 50kb!");
      }
      return isJPG && isLt2M;
    },
    // 提交表单，表当验证通过执行的回调
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.$message.success("请求成功");
          const result = await this.$API.product.addTrademark(
            this.trademarkFrom
          );
          if (result.code === 200) {
            this.visible = false;
          } else {
            this.$message.error(result.message);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style lang="sass">
.imgwh
  width: 150px
.el-select
  margin-left: 250px

.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden

  .avatar-uploader .el-upload:hover
    border-color: #409EFF

  .avatar-uploader-icon
    font-size: 28px
    color: #8c939d
    width: 178px
    height: 178px
    line-height: 178px
    text-align: center

  .avatar
    width: 178px
    height: 178px
    display: block
</style>
