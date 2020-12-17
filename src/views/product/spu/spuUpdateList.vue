<template>
  <div>
    <el-card class="box-card" style="margin-top: 20px">
      <el-form
        ref="spuForm"
        :model="pageList"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="SPU名称" prop="spuName">
          <el-input v-model="pageList.spuName" placeholder="SPU名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="tmId">
          <el-select v-model="pageList.tmId" placeholder="请选择品牌">
            <el-option
              v-for="trademark in trademarkList"
              :key="trademark.id"
              :label="trademark.tmName"
              :value="trademark.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述" prop="description">
          <el-input
            type="textarea"
            placeholder="请输入SPU描述"
            v-model="pageList.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="SPU图片" prop="imageList">
          <el-upload
            :on-preview="handlePictureCardPreview"
            :file-list="formatImageList"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-remove="handleRemove"
            class="avatar-uploader"
            list-type="picture-card"
            :action="`${$BASE_API}/admin/product/fileUpload`"
          >
            <img v-if="false" :src="trademarkForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
        <el-form-item label="销售属性" :model="filterSale" prop="table">
          <el-select
            v-model="spu.text"
            :placeholder="`可选项剩余${filterSale.length}`"
          >
            <el-option
              v-for="sale in filterSale"
              :key="sale.id"
              :label="sale.name"
              :value="`${sale.name}-${sale.id}`"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            icon="el-icon-plus"
            :disabled="!filterSale.length"
            @click="addSaleList"
            >添加销售属性</el-button
          >

          <!-- table表单 -->
          <el-table
            :data="spusaleList"
            border
            style="width: 100%; margin: 20px 0"
          >
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="80"
            >
            </el-table-column>
            <el-table-column prop="saleAttrName" label="属性值名称列表">
            </el-table-column>
            <el-table-column label="SPU描述" prop="spuSaleAttrValueList">
              <!-- spu属性可以删除的小方块 -->
              <!-- 拿当行的数组再进行遍历即可拿到数据 -->
              <template slot-scope="scope">
                <el-tag
                  @close="delSpu(i, scope.row)"
                  :key="spuSale.id"
                  v-for="(spuSale, i) in scope.row.spuSaleAttrValueList"
                  closable
                  :disable-transitions="false"
                >
                  {{ spuSale.saleAttrValueName }}
                </el-tag>
                <el-input
                  ref="input"
                  v-model="spuSaleValue"
                  placeholder="请输入"
                  size="small"
                  style="width: 80px"
                  v-if="scope.row.edit"
                  @blur="lsoeFocus(scope.row, scope.$index)"
                  @keyup.enter.native="lsoeFocus(scope.row, scope.$index)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="addSpuSale(scope.row)"
                  >添加</el-button
                >
                <!-- <el-input type="text" />
                            @keyup.enter.native=""
              @blur="handleInputConfirm" -->
              </template>
              <!-- <el-input
              class="input-new-tag"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
            >
            </el-input> -->
            </el-table-column>

            <el-table-column label="操作">
              <template v-slot="{ $index }">
                <el-button
                  type="warning"
                  icon="el-icon-edit"
                  size="mini"
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="delSupSale($index)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="spuForm('spuForm')">保存</el-button>
          <el-button @click="$bus.$emit('shiftShowList', spu.category3Id)"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "spuUpdateList",
  props: {
    spu: Object,
  },
  data() {
    return {
      pageList: this.spu,
      imageList: [], //图片列表
      dialogImageUrl: "",
      dialogVisible: false, //图片放大
      trademarkList: [], //品牌
      saleList: [], //全部销售
      spusaleList: [], //部分銷售
      inputVisible: true, //spu属性
      inputValue: "", //spu属性
      isSaleShow: false,
      spuSaleValue: "", //新添加的属性值
      rules: {
        spuName: [
          { required: true, message: "请输入SPU名称", trigger: "blur" },
        ],
        tmId: [{ required: true, message: "请输入品牌名称", trigger: "blur" }],
        description: [
          { required: true, message: "请输入SPU描述", trigger: "blur" },
        ],
        imageList: [{ required: true, validator: this.validateImg }],
        table: [{ validator: this.validateTabel }],
      },
    };
  },
  async mounted() {
    //品牌列表
    this.getTrademarkList();
    //销售列表
    this.getSaleList();

    if (this.pageList.id) {
      //部分销售列表
      //图片列表
      this.getImageList();
      this.getSpusaleList();
    }
  },
  computed: {
    filterSale() {
      const result = this.saleList.filter((allSale) => {
        //每一处遍历都会检查全部属性中是否在普通属性中也有
        // 有的话就删除，没有的话就返回一个对象
        return !this.spusaleList.find((spuSale) => {
          return spuSale.saleAttrName === allSale.name;
        });
      });
      return result;
      // console.log(22);
      // console.log(result);
    },
    //动态监视图片列表变化
    formatImageList() {
      return this.imageList.map((item) => {
        return {
          uid: item.uid || item.id,
          name: item.imgName,
          url: item.imgUrl,
        };
      });
    },
  },
  methods: {
    //校验至少上传一张图片
    validateImg(rule, value, callback) {
      if (this.imageList.length) {
        callback();
        return;
      }
      callback(new Error("请至少上传一张图片"));
    },
    //校验至少添加一个属性和标签
    validateTabel(rule, value, callback) {
      const result = this.spusaleList.some((spu) => {
        return spu.spuSaleAttrValueList.length === 0;
      });
      if (result) {
        callback(new Error("请至少添加一个销售属性标签"));
      }
      if (this.spusaleList.length === 0) {
        callback(new Error("请至少添加一个属性标签"));
        return;
      }
      callback();
    },
    //表单校验
    spuForm(spuForm) {
      this.$refs.spuForm.validate(async (valid) => {
        if (valid) {
          console.log("表单校验成功");
          //表单校验成功发送数据更新页面
          const spu = {
            ...this.spu,
            spuImageList: this.imageList,
            spuSaleAttrList: this.spusaleList,
          };
          let result;
          if (this.pageList.id) {
            result = await this.$API.spu.updateSaleList(spu);
          } else {
            console.log("save");
            result = await this.$API.spu.saveSaleList(spu);
          }

          if (result.code === 200) {
            this.$message.success("更新数据成功");
            // 数据更新成功跳转到show页面
            this.$bus.$emit("shiftShowList", this.spu.category3Id);
          } else {
            this.$message.error("请求数据失败");
          }
        } else {
          this.$message.error("校验失败");
        }
      });
    },
    //删除一行属性
    delSupSale(index) {
      this.spusaleList.splice(index, 1);
    },
    //删除标签
    delSpu(index, row) {
      // row.spuSaleAttrValueList = row.spuSaleAttrValueList.filter(
      //   (item) => item.id !== index
      // );
      row.spuSaleAttrValueList.splice(index, 1);
    },
    //失去焦点和回车执行的函数
    lsoeFocus(row, index) {
      //input失去焦点时如果没有填写数据在input中的话那么就把这个对象从attrValueList中删除
      const { saleAttrName, spuId, isChecked, baseSaleAttrId } = row;
      if (this.spuSaleValue) {
        row.spuSaleAttrValueList.push({
          baseSaleAttrId,
          isChecked,
          saleAttrName,
          saleAttrValueName: this.spuSaleValue,
          spuId,
        });
        this.spuSaleValue = "";
      }
      row.edit = false;
    },
    //点击添加属性
    addSpuSale(row) {
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    // 添加当条属性列表
    addSaleList() {
      const { id, text } = this.spu;
      const [saleAttrName, baseSaleAttrId] = text.split("-");
      this.spusaleList.push({
        baseSaleAttrId: baseSaleAttrId,
        saleAttrName: saleAttrName,
        spuId: id,
        spuSaleAttrValueList: [],
      });
      this.spu.text = "";
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //请求图片列表
    async getImageList() {
      const result = await this.$API.spu.getImageList(this.pageList.id);
      if (result.code === 200) {
        this.$message.success("请求图片数据成功");
        // [{name,url}]
        // [{imgName,imgUrl}]
        // this.imageList = result.data;
        //改成elementui 渲染数据想要的格式
        // result.data.map((item) => {
        //   this.imageList.push({ name: item.imgName, url: item.imgUrl });
        // });
        this.imageList = result.data;
      } else {
        this.$message.error("请求数据失败");
      }
    },
    //请求所有品牌列表
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      if (result.code === 200) {
        this.$message.success("请求品牌数据成功");
        this.trademarkList = result.data;
      } else {
        this.$message.error("请求品牌数据失败");
      }
    },
    async getSaleList() {
      const result = await this.$API.spu.getSaleList();
      if (result.code === 200) {
        this.$message.success("请求销售列表数据成功");
        this.saleList = result.data;
      } else {
        this.$message.error("请求品牌数据失败");
      }
    },
    async getSpusaleList() {
      const result = await this.$API.spu.getSpusaleList(this.pageList.id);
      if (result.code === 200) {
        this.$message.success("请求销售列表数据成功");
        this.spusaleList = result.data;
      } else {
        this.$message.error("请求品牌数据失败");
      }
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
      // this.trademarkFrom.logoUrl = res.data;
      this.imageList.push({
        uid: file.uid,
        imgName: file.name,
        imgUrl: res.data,
        spuId: this.spu.id,
      });
    },
    //删除图片执行的函数
    handleRemove(file) {
      this.imageList = this.imageList.filter(
        (item) => item.imgUrl !== file.url
      );
    },
  },
};
</script>

<style lang="sass" scoped>
.el-tag + .el-tag
  margin-left: 10px

  .button-new-tag
    margin-left: 10px
    height: 32px
    line-height: 30px
    padding-top: 0
    padding-bottom: 0

  .input-new-tag
    width: 90px
    margin-left: 10px
    vertical-align: bottom
</style>
