import request from "@/utils/request";

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
    console.log(spuId);
    return request({
      method: "DELETE",
      url: `${api_name}/deleteSpu/${spuId}`
    });
  }
};
