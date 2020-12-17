<template>
  <el-card>
    <el-form el-form ref="form" :model="sku" label-width="100px">
      <el-form-item label="SPU名称">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="sku.spuName" placeholder="请输入SKU名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input-number
          placeholder="请输入价格"
          v-model="form.desc"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input-number
          placeholder="请输入重量"
          v-model="form.desc"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          v-model="form.desc"
          placeholder="请输入规格描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <div
          v-for="attr in attrList"
          :key="attr.id"
          style="margin-left: 20px"
          class="sku-option"
        >
          <span>{{ attr.attrName }}</span>
          <el-select v-model="spu.attr" collapse-tags placeholder="请选择">
            <el-option
              v-for="attrValue in attr.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
              :value="attrValue.id"
            >
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="销售属性">
        <div
          style="margin-left: 20px"
          v-for="spuAttr in spuAttrList"
          :key="spuAttr.id"
          class="sku-option"
        >
          <span>{{ spuAttr.saleAttrName }}</span>
          <el-select v-model="spu.spuAttr" collapse-tags placeholder="请选择">
            <el-option
              v-for="spuSale in spuAttr.spuSaleAttrValueList"
              :key="spuSale.id"
              :label="spuSale.saleAttrValueName"
              :value="spuSale.id"
            >
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table :data="isDefault" border style="width: 100%">
          <el-table-column type="selection" width="180"> </el-table-column>

          <el-table-column label="图片">
            <template v-slot="{ row }">
              <img :src="row.imgUrl" :alt="row.imgName" />
            </template>
          </el-table-column>

          <el-table-column prop="imgName" label="名称"> </el-table-column>
          <el-table-column prop="address" label="操作">
            <template v-slot="{ row }">
              <el-tag type="success" v-if="row.isDefault">默然</el-tag>
              <el-button
                type="primary"
                v-else
                class="sku-btn"
                @click="silentAttr(row)"
                >设为默然</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="$bus.$emit('shiftShowList', spu.category3Id)"
          >取消</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    spuItme: Object,
  },
  name: "skuList",
  data() {
    return {
      form: {
        name: "",
      },
      imageList: [],
      spuAttrList: [],
      attrList: [],
      spu: this.spuItme,
      sku: {},
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
    isDefault() {
      return this.imageList.map((obj) => {
        return {
          ...obj,
          isDefault: 0,
        };
      });
    },
  },
  methods: {
    handleChange() {},
    //保存属性到sku页面
    async save() {
      const result = this.$API.spu.saveSkuInfo();
      if (result.code === 200) {
        this.$message.success("保存到sku");
      } else {
        this.$message.error("保存失败");
      }
    },
    //指定默然属性
    silentAttr(row) {
      this.isDefault.map((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
    },
    //请求销售列表属性
    async getSpusaleList() {
      const result = await this.$API.spu.getSpusaleList(this.spu.id);
      if (result.code === 200) {
        this.$message.success("请求销售列表数据成功");
        this.spuAttrList = result.data;
      } else {
        this.$message.error("请求品牌数据失败");
      }
    },
    //请求图片列表属性
    async getImageList() {
      const result = await this.$API.spu.getImageList(this.spu.id);
      if (result.code === 200) {
        this.$message.success("请求图片数据成功");
        this.imageList = result.data;
      } else {
        this.$message.error("请求数据失败");
      }
    },
    async getAttrList() {
      const result = await this.$API.attr.getAttrList(this.category);
      if (result.code === 200) {
        this.$message.success("请求图片数据成功");
        this.attrList = result.data;
      } else {
        this.$message.error("请求数据失败");
      }
    },
  },
  mounted() {
    this.getAttrList();
    this.getSpusaleList();
    this.getImageList();
  },
};
</script>

<style lang="sass" scoped>
>>>.sku-option
  margin-right: 20px
  display: inline-block
/*.sku-btn
 width: 80px
 height: 20px */
</style>
