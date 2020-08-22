import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    point_list: null
  },
  mutations: {
    CHANGE_POINTLIST(state, data) {
      state.point_list = data;
    }
  },
  //Action 提交（commit）的是 mutations ，而不是直接變更 state。
  actions: {
    changePointList({ commit, state }, data) {
      commit('CHANGE_POINTLIST', data)
    },
  },
  getters: {
    // ...
    pointList: state => {
      return state.point_list;
    }
  },
  modules: {
  }
});
