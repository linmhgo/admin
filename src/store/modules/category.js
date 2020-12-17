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
    async getCategory1List({ commit }, category1Id) {
      const result = await API.attr.getCategory1Id();
      if (result.code === 200) {
        commit(GET_CATEGORY1_LIST, { result, category1Id });
      } else {
        Message.error(result.message);
      }
    },
    async getCategory2List({ commit }, { value, category2Id }) {
      const result = await API.attr.getCategory2Id(value);
      if (result.code === 200) {
        commit(GET_CATEGORY2_LIST, { result, category2Id });
      } else {
        Message.error(result.message);
      }
    },
    async getCategory3List({ commit }, { value, category3Id }) {
      const result = await API.attr.getCategory3Id(value);
      if (result.code === 200) {
        commit(GET_CATEGORY3_LIST, { result, category3Id });
      } else {
        Message.error(result.message);
      }
    }
  },
  mutations: {
    GET_CATEGORY1_LIST(state, { result, category1Id }) {
      state.category1List = result;
      state.category.category1Id = category1Id;
    },
    GET_CATEGORY2_LIST(state, { result, category2Id }) {
      state.category1List = result;
      state.category.category2Id = category2Id;
    },
    GET_CATEGORY3_LIST(state, { result, category3Id }) {
      state.category1List = result;
      state.category.category3Id = category3Id;
    }
  }
};
