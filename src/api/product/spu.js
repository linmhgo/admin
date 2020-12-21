import request from "@/utils/request";
import { data } from "autoprefixer";

const api_name = "/admin/product";

export default {
  getSpuList({ category3Id, page, limit }) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: "GET",
      params: {
        category3Id
      }
    });
  },
  //图片列表
  getImageList(spuId) {
    return request({
      method: "GET",
      url: `${api_name}/spuImageList/${spuId}`
    });
  },
  //请求所有的品牌
  getTrademarkList() {
    return request({
      method: "GET",
      url: `${api_name}/baseTrademark/getTrademarkList`
    });
  },
  //部分销售属性列表
  getSpusaleList(spuid) {
    return request({
      method: "GET",
      url: `${api_name}/spuSaleAttrList/${spuid}`
    });
  },
  //销售属性列表
  getSaleList() {
    return request({
      method: "GET",
      url: `${api_name}/baseSaleAttrList`
    });
  },
  //删除spu属性
  delSpuSaleList(spuId) {
    return request({
      method: "DELETE",
      url: `${api_name}/deleteSpu/${spuId}`
    });
  },
  //更新更改的数据
  updateSaleList(spu) {
    return request({
      method: "POST",
      url: `${api_name}/updateSpuInfo`,
      data: spu
    });
  },
  saveSaleList(spu) {
    console.log(spu);
    return request({
      method: "POST",
      url: `${api_name}/saveSpuInfo`,
      data: spu
    });
  },
  //保存到sku
  saveSkuInfo(sku) {
    console.log(sku);
    return request({
      url: `${api_name}/saveSkuInfo`,
      method: "POST",
      data: sku
    });
  }
};
