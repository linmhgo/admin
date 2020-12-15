<template>
  <div>
    <el-card class="box-card" style="margin-top: 20px">
      <el-form ref="form" :model="pageList" label-width="80px">
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
        <el-form-item label="SPU描述">
          <el-input
            type="textarea"
            placeholder="请输入SPU描述"
            v-model="pageList.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
          <el-upload
            :on-preview="handlePictureCardPreview"
            :file-list="imageList"
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
        <el-form-item label="销售属性" :model="filterSale">
          <el-select
            v-model="filterSale.name"
            :placeholder="`可选项剩余${filterSale.length}`"
          >
            <el-option
              v-for="sale in filterSale"
              :key="sale.id"
              :label="sale.name"
              :value="sale.id"
            ></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        </el-form-item>
        <!-- table表单 -->
        <el-table
          :data="spusaleList"
          border
          style="width: 100%; margin: 20px 0"
        >
          <el-table-column type="index" label="序号" align="center" width="80">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性值名称列表">
          </el-table-column>
          <el-table-column label="SPU描述" prop="spuSaleAttrValueList">
            <!-- spu属性可以删除的小方块 -->
            <!-- 拿当行的数组再进行遍历即可拿到数据 -->
            <template slot-scope="scope">
              <el-tag
                :key="spuSale.id"
                v-for="spuSale in scope.row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="handleClose(spuSale.baseSaleAttrId, scope.row)"
              >
                {{ spuSale.saleAttrValueName }}
              </el-tag>
            </template>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput"
              >+ New Tag</el-button
            >
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delSupSale(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item>
          <el-button type="primary">保存</el-button>
          <el-button>取消</el-button>
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
      form: {
        name: "",
        region: "",
      },
      pageList: this.spu,
      imageList: [], //图片列表
      dialogImageUrl: "",
      dialogVisible: false, //图片放大
      trademarkList: [], //品牌
      saleList: [], //全部销售
      spusaleList: [], //部分銷售
      inputVisible: false, //spu属性
      inputValue: "", //spu属性
    };
  },
  async mounted() {
    //图片列表
    this.getImageList();
    //品牌列表
    this.getTrademarkList();
    //销售列表
    this.getSaleList();
    //部分销售列表
    this.getSpusaleList();
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
          name:
        };
      });
    },
  },
  methods: {
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
        console.log(result);
        result.data.map((item) => {
          this.imageList.push({ name: item.imgName, url: item.imgUrl });
        });
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
    //属性spu描述
    handleClose(tag, index) {
      console.log(tag, index);
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    //属性spu描述
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //属性spu描述
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    async delSupSale(row) {
      console.log(row.id);
      const result = await this.$API.spu.delSpuSaleList(row.spuId);
      if (result.code === 200) {
        this.$message.success("删除属性数据成功");
      } else {
        this.$message.error("删除属性数据失败");
      }
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
