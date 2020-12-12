import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  getCategory1Id() {
    return request({
      method: "GET",
      url: `${api_name}/getCategory1`
    });
  },
  getCategory2Id(category1Id) {
    return request({
      method: "GET",
      url: `${api_name}/getCategory2/${category1Id}`
    });
  },
  getCategory3Id(category2Id) {
    return request({
      method: "GET",
      url: `${api_name}/getCategory3/${category2Id}`
    });
  },
  getAttrList({ category1Id, category2Id, category3Id }) {
    return request({
      method: "GET",
      url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
    });
  }
};
