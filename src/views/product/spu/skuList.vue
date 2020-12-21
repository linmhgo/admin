<template>
  <el-card>
    <el-form
      el-form
      ref="skuForm"
      :model="sku"
      label-width="100px"
      :rules="rules"
    >
      <el-form-item label="SPU名称">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称" prop="skuName">
        <el-input v-model="sku.skuName" placeholder="请输入SKU名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <el-input-number
          placeholder="请输入价格"
          v-model="sku.price"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)" prop="weight">
        <el-input-number
          placeholder="请输入重量"
          v-model="sku.weight"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="规格描述" prop="skuDesc">
        <el-input
          type="textarea"
          v-model="sku.skuDesc"
          placeholder="请输入规格描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性" prop="attr">
        <div
          v-for="(attr, index) in attrList"
          :key="attr.id"
          style="margin-left: 20px"
          class="sku-option"
        >
          <el-form-item>
            <span>{{ attr.attrName }}</span>
            <el-select
              v-model="sku.skuAttrValueList[index]"
              placeholder="请选择"
              @change="clearValidate('attr')"
            >
              <el-option
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
                :value="`${attrValue.id}-${attr.id}`"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>

      <el-form-item label="销售属性" prop="spuAttr">
        <div
          style="margin-left: 20px"
          v-for="(spuAttr, index) in spuAttrList"
          :key="spuAttr.id"
          class="sku-option"
        >
          <el-form-item>
            <span>{{ spuAttr.saleAttrName }}</span>
            <el-select
              v-model="sku.skuSaleAttrValueList[index]"
              placeholder="请选择"
              @change="clearValidate('spuAttr')"
            >
              <el-option
                v-for="spuSale in spuAttr.spuSaleAttrValueList"
                :key="spuSale.id"
                :label="spuSale.saleAttrValueName"
                :value="`${spuSale.id}`"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>

      <el-form-item label="图片列表" prop="skuImage">
        <el-form-item>
          <el-table
            :data="isDefault"
            border
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="180"> </el-table-column>

            <el-table-column label="图片">
              <template v-slot="{ row }">
                <img
                  :src="row.imgUrl"
                  :alt="row.imgName"
                  style="width: 150px"
                />
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
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="skuForm('skuForm')">保存</el-button>
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
      sku: {
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
        skuImageList: [],
      },
      row: {},
      rules: {
        spuName: [
          { required: true, message: "请输入sku名称", trigger: "change" },
        ],
        price: [
          { required: true, message: "请输入sku价格", trigger: "change" },
        ],
        weight: [
          { required: true, message: "请输入sku重量", trigger: "change" },
        ],
        skuDesc: [
          { required: true, message: "请输入sku描述", trigger: "change" },
        ],
        attr: [
          {
            required: true,
            validator: this.validateAttr,
          },
        ],
        spuAttr: [
          {
            required: true,
            validator: this.validateSpuAttr,
          },
        ],
        skuImage: [
          {
            required: true,
            validator: this.validateSpuImage,
          },
        ],
      },
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
          isDefault: false,
          isCheck: true,
        };
      });
    },
  },
  methods: {
    clearValidate(prop) {
      this.$refs.skuForm.clearValidate(prop);
    },
    validateSpuAttr(rule, value, callback) {
      if (
        this.sku.skuSaleAttrValueList.length !== this.spuAttrList.length ||
        this.sku.skuSaleAttrValueList.some((item) => !item)
      ) {
        callback(new Error("请选择所有的销售属性"));
        return;
      }
      callback();
    },
    validateAttr(rule, value, callback) {
      if (
        this.sku.skuAttrValueList.length !== this.attrList.length ||
        this.sku.skuAttrValueList.some((item) => !item)
      ) {
        callback(new Error("请选择所有的平台属性"));
        return;
      }
      callback();
    },
    validateSpuImage(rule, value, callback) {
      if (this.sku.skuImageList.length === 0) {
        callback(new Error("至少选择一张图片"));
        return;
      }
      if (!this.sku.skuImageList.some((item) => item.isDefault === true)) {
        callback(new Error("至少选择一张默然图片"));
        return;
      }
      callback();
    },
    skuForm(formName) {
      this.$refs.skuForm.validate(async (valid) => {
        if (valid) {
          const skuAttrValueList = this.sku.skuAttrValueList.map((id) => {
            const [valueId, attrId] = id.split("-");
            return {
              attrId: +attrId,
              valueId: +valueId,
            };
          });
          const url = this.isDefault.find((item) => item.isDefault === true);
          const skuSaleAttrValueList = this.sku.skuSaleAttrValueList.map(
            (id) => {
              // const [saleAttrValueId] = id.split("-");
              return {
                saleAttrValueId: +id,
              };
            }
          );
          // console.log(url);
          const sku = {
            ...this.sku,
            category3Id: this.spuItme.category3Id,
            skuAttrValueList,
            skuDefaultImg: url.imgUrl,
            skuImageList: this.sku.skuImageList,
            skuSaleAttrValueList,
            tmId: this.spu.tmId,
          };
          // console.log(sku);
          const result = await this.$API.spu.saveSkuInfo(sku);
          if (result.code === 200) {
            this.$message.success("保存sku成功");
            this.$emit("show");
          } else {
            this.$message.error("保存sku失败");
          }
          /*
                  {
          "category3Id": 0,
          "id": 0,
          "isSale": 0,
          "price": 0,
          "skuAttrValueList": [
            {
              "attrId": 0,
              "id": 0,
              "skuId": 0,
              "valueId": 0
            }
          ],
          "skuDefaultImg": "string",
          " ": "string",
          "skuImageList": [
            {
              "id": 0,
              "imgName": "string",
              "imgUrl": "string",
              "isDefault": "string",
              "skuId": 0,
              "spuImgId": 0
            }
          ],
          "skuName": "string",
          "skuSaleAttrValueList": [
            {
              "id": 0,
              "saleAttrValueId": 0,
              "skuId": 0,
              "spuId": 0
            }
          ],
          "spuId": 0,
          "tmId": 0,
          "weight": "string"
        }

          */
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleSelectionChange(value) {
      this.sku.skuImageList = value;
    },
    //保存属性到sku页面
    /*

    */
    async save() {
      const data = {
        ...this.sku,
      };
      const result = this.$API.spu.saveSkuInfo(data);
      if (result.code === 200) {
        this.$message.success("保存到sku");
        this.$bus.$emit("shiftShowList");
      } else {
        this.$message.error("保存失败");
      }
    },
    //指定默然属性
    silentAttr(row) {
      this.sku.skuDefaultImg = row.imgUrl;
      // this.isDefault.map((item) => {
      //   item.isDefault = false;
      // });
      row.isDefault = true;
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
