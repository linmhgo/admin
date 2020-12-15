import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  //请求一级列表的数据
  getCategory1Id() {
    return request({
      method: "GET",
      url: `${api_name}/getCategory1`
    });
  },
  //请求二级列表的数据
  getCategory2Id(category1Id) {
    return request({
      method: "GET",
      url: `${api_name}/getCategory2/${category1Id}`
    });
  },
  //请求三级列表的数据
  getCategory3Id(category2Id) {
    return request({
      method: "GET",
      url: `${api_name}/getCategory3/${category2Id}`
    });
  },
  //请求当前页面的属性列表
  getAttrList({ category1Id, category2Id, category3Id }) {
    return request({
      method: "GET",
      url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
    });
  },
  //修改属性后发送请求
  getUpdateAttrlist(attr) {
    console.log(attr);
    return request({
      method: "POST",
      url: `${api_name}/saveAttrInfo`,
      data: attr
    });
  }
};
