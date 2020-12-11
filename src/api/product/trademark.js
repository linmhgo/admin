import request from "@/utils/request";

const api_name = "/admin/product/baseTrademark/";

export default {
  getTrademark(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: "GET"
    });
  },
  addTrademark(data) {
    console.log(data);
    return request({
      url: `${api_name}/save`,
      method: "POST",
      data
    });
  },
  delTrademark(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: "DELETE"
    });
  }
};
