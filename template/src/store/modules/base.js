/*
 * @Author: Leo - [xuebin.me]
 * @Date: 2017-12-29 14:00:07
 * @Last Modified by: Leo
 * @Last Modified time: 2018-03-23 13:35:35
 */

// import Vue from 'vue'
import { base } from '../mutation-types'
import api from '../../utils/fetch'

const state = {
  version: '1.0.0'
}

const getters = {
  versionGetter (state, getters) {
    return state.version
  }
}

const mutations = {
  [base.SET_VERSION] (state, info) {
    info.version && (state.version = info.version)
  }
}

const actions = {
  async getVersion ({ state, dispatch, commit, rootState }, params = {}) {
    let { data } = api.login('/api/version', params)
    commit(base.SET_VERSION, data)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
