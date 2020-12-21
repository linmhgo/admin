<template>
  <div>
    <skuList v-if="showSkuList" :spuItme="skuItme" @show="show" />
    <div v-else>
      <Category />
      <spuShowList v-if="isShow" @switchSkuList="switchSkuList" />
      <spuUpdateList v-else :spu="pageList" />
    </div>
  </div>
</template>

<script>
import Category from "@/components/Category/index";
import spuShowList from "./spuShowList";
import spuUpdateList from "./spuUpdateList";
import skuList from "./skuList";

export default {
  name: "SpuList",
  data() {
    return {
      isShow: true,
      showSkuList: false,
      pageList: {},
      skuItme: {},
    };
  },
  components: {
    Category,
    spuShowList,
    spuUpdateList,
    skuList,
  },
  mounted() {
    this.$bus.$on("switchShow", this.getPageList);
    this.$bus.$on("shiftShowList", this.shiftShowList);
  },
  methods: {
    show() {
      this.showSkuList = false;
      this.isShow = true;
    },
    switchSkuList(sku) {
      this.showSkuList = true;
      this.skuItme = { ...sku };
    },
    switchShow() {
      this.isShow = false;
    },
    getPageList(row) {
      this.isShow = false;
      this.pageList = { ...row };
    },
    shiftShowList(category3Id) {
      this.isShow = true;
      this.$nextTick(() => {
        //等show页面加载完成后再触发事件
        this.$bus.$emit("change", { category3Id });
      });
    },
  },
  beforeDestroy() {
    this.$bus.$off("switchShow", this.getPageList);
    this.$bus.$on("shiftShowList", this.shiftShowList);
  },
};
</script>
