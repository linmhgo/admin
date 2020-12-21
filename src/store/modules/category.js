import * as API from "@/api";
import { Message } from "element-ui";

export default {
  state: {
    category: {
      category1Id: "",
      category2Id: "",
      category3Id: ""
    },
    category1List: [],
    category2List: [],
    category3List: []
  },
  gerters: {},
  actions: {
    //一上来页面请求的数据
    async getCategory1List({ commit }) {
      const result = await API.attr.getCategory1Id();
      if (result.code === 200) {
        commit("GET_CATEGORY1_LIST", result.data);
      } else {
        Message.error(result.message);
      }
    },
    //点击一节列表的事就请求的数据
    async getCategory2List({ commit }, category1Id) {
      const result = await API.attr.getCategory2Id(category1Id);
      if (result.code === 200) {
        const { data } = result;
        commit("GET_CATEGORY2_LIST", { data, category1Id });
      } else {
        //请求错误的时候清空
        Message.error(result.message);
        commit("GET_CATEGORY2_LIST_ERROR", category1Id);
      }
    },
    //请求二级列表发送的请求
    async getCategory3List({ commit }, category2Id) {
      const result = await API.attr.getCategory3Id(category2Id);
      if (result.code === 200) {
        const { data } = result;
        commit("GET_CATEGORY3_LIST", { data, category2Id });
      } else {
        Message.error(result.message);
        commit("GET_CATEGORY3_LIST_ERROR", category2Id);
      }
    }
  },
  mutations: {
    GET_CATEGORY1_LIST(state, result) {
      state.category1List = result;
      state.category.category2Id = "";
      state.category.category3Id = "";
      state.category2List = [];
      state.category3List = [];
    },
    GET_CATEGORY2_LIST(state, { data, category1Id }) {
      state.category2List = data;
      state.category.category1Id = category1Id;
      state.category3List = [];
      state.category.category2Id = "";
      state.category.category3Id = "";
    },
    GET_CATEGORY3_LIST(state, { data, category2Id }) {
      state.category3List = data;
      state.category.category2Id = category2Id;
      state.category.category3Id = "";
    },
    GET_CATEGORY2_LIST_ERROR(state, category1Id) {
      state.category.category1Id = category1Id;
      state.category.category2Id = "";
      state.category.category3Id = "";
      state.category2List = [];
      state.category3List = [];
    },
    GET_CATEGORY3_LIST_ERROR(state, category2Id) {
      state.category.category2Id = category2Id;
      state.category.category3Id = "";
      state.category3List = [];
    },
    GET_CATEGORY3(state, category3Id) {
      state.category.category3Id = category3Id;
    }
  }
};
