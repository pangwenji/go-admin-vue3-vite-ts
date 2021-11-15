import { createStore } from 'vuex';
import loginStore from './loginStore';
import appStore from './app';
import settings from './settings'
import permissionStore from './permission';
import systemStore from './system';
import userStore from './user';
import tagsViewStore from './tagsView';
import errorLogStore from './errorLog'
const indexStore = createStore({
    modules: {
        loginStore,
        appStore,
        settings,
        permissionStore,
        systemStore,
        userStore,
        tagsViewStore,
        errorLogStore
        // getters
    }
})


export default indexStore;