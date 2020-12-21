import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  getSkuList(page, limit) {
    return request({
      url: `${api_name}/list/${page}/${limit}`,
      method: "GET"
    });
  },
  //商品详情页
  getSkuById(skuId) {
    return request({
      url: `${api_name}/getSkuById/${skuId}`,
      method: "GET"
    });
  },
  //sku销售属性
  getSpuSaleAttrList(spuId) {
    return request({
      url: `${api_name}/spuSaleAttrList/${spuId}`
    });
  },
  //sku平台属性
  getSpuSaleAttrList(spuId) {
    return request({
      method: "GET",
      url: `${api_name}/spuSaleAttrList/${spuId}`
    });
  },
  //商品上架
  cancelSale(skuId) {
    return request({
      method: "GET",
      url: `${api_name}/cancelSale/${skuId}`
    });
  },
  //商品上架
  onSale(skuId) {
    return request({
      method: "GET",
      url: `${api_name}/onSale/${skuId}`
    });
  },
  //删除单个sku
  deleteSku(skuId) {
    console.log(skuId);
    return request({
      method: "DELETE",
      url: `${api_name}/deleteSku/${skuId}`
    });
  }
};
