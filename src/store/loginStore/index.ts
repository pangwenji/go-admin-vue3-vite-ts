import { createStore, Commit } from 'vuex';
import axios, { AxiosRequestConfig } from 'axios';
import { getToken } from '../../utils/auth';
import { login,loginParams} from "../../api/login";
export interface globalDataProps {
    token: String | undefined,
}
interface stateProp {
    state: any;
    token: String;
}
interface dataProp {
   token:String
}

const loginStore = {
    namespace:true,
    state: {
       token:getToken()
    },
    mutations: {
        saveToken(state:stateProp,data:dataProp) {
            state.token = data.token;
        }
    },
    actions: {
        userLogin({commit}, loginFrom:loginParams) {
            login(loginFrom).then((data)=> {
                if (data) {
                    commit('saveToken', data)
                }
            })
        }
    },
    // getters: {
    //     token: (state) => state.token
    // }
}

export default loginStore;