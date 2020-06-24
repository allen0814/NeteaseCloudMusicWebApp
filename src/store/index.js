import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searchResult: {} // 搜索结果 包含总数和数组
  },
  getters: {
    searchResCount: state => {
      return state.searchResult.songCount
    },
    searchResArr: state => {
      return state.searchResult.songs
    }
  },
  mutations: {
    SET_SEARCH_RESULT: (state, res) => {
      state.searchResult = res
    }
  },
  actions: {
    setSearchResult: ({ commit }, res) => {
      commit('SET_SEARCH_RESULT', res)
    }
  },
  modules: {
  }
})
