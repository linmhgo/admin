<template>
  <div>
    <Category />
    <spuShowList v-if="isShow" />
    <spuUpdateList v-else :spu="pageList" />
  </div>
</template>

<script>
import Category from "@/components/Category/index";
import spuShowList from "./spuShowList";
import spuUpdateList from "./spuUpdateList";

export default {
  name: "SpuList",
  data() {
    return {
      isShow: true,
      pageList: {},
    };
  },
  components: {
    Category,
    spuShowList,
    spuUpdateList,
  },
  mounted() {
    this.$bus.$on("switchShow", this.getPageList);
    this.$bus.$on("shiftShowList", this.shiftShowList);
  },
  methods: {
    switchShow() {
      this.isShow = false;
    },
    getPageList(row) {
      this.isShow = false;
      this.pageList = row;
    },
    shiftShowList(category3Id) {
      this.isShow = true;
      this.$nextTick(() => {
        this.$bus.$emit("change", { category3Id });
      });
    },
  },
  beforeDestroy() {
    this.$bus.$off("switchShow", this.getPageList);
  },
};
</script>
