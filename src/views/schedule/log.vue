<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form>
                    <el-form-item>
                        <el-button type="success" icon="el-icon-search" size="mini">状态</el-button>
                        <el-button type="primary" icon="el-icon-search" size="mini">清空</el-button>
                    </el-form-item>
                </el-form>
                <el-row ref="log" :gutter="10" class="mb8">
                    <el-scrollbar
                        style="height: 500px; background-color: black; color: cornflowerblue"
                    >
                        <ul
                            style="
                                line-height: 25px;
                                padding-top: 15px;
                                padding-bottom: 15px;
                                min-height: 500px;
                                margin: 0;
                                list-style-type: none;
                            "
                        >
                            <li v-for="(item, index) in arrs" :key="index">
                                {{ item }}
                            </li>
                        </ul>
                    </el-scrollbar>
                </el-row>
            </el-card>
        </template>
    </BasicLayout>
</template>

<script>
import { unWsLogout } from "@/api/ws";
import { reactive, defineComponent, onMounted, toRefs} from "vue";
import { useStore } from "vuex";
export default defineComponent({
    name: "SysJobLogManage",
    setup() {
        let state = reactive({
            websock: null,
            arrs: [],
            id: undefined,
            group: undefined,
        });

        onUnmounted(() => {
            state.websock.close(); // 离开路由之后断开websocket连接
            unWsLogout(state.id, state.group).then((response) => {});
        });
        onMounted(() => {
            state.id = guid();
            state.group = "log";
            initWebSocket();
        });

        let store =useStore()
        let initWebSocket = () => {
            // 初始化weosocket
            const wsuri =
                "ws://127.0.0.1:9527/ws/" +
                state.id +
                "/" +
                state.group +
                "?token=" +
            store.state.user.token;
            state.websock = new WebSocket(wsuri);
            state.websock.onmessage = state.websocketonmessage;
            state.websock.onopen = state.websocketonopen;
            state.websock.onerror = state.websocketonerror;
            state.websock.onclose = state.websocketclose;
        };
        let websocketonopen = () => {
            // 连接建立之后执行send方法发送数据
            //   this.websocketsend(JSON.stringify(actions))
        };
        let websocketonerror = () => {
            // 连接建立失败重连
            initWebSocket();
        };
        let websocketonmessage = (e) => {
            // 数据接收
            //   const redata = JSON.parse(e.data)
            //   this.$refs.log.innerText = e.data + '\n' + this.$refs.log.innerText
            state.arrs.unshift(e.data);
        };
        let websocketsend = (Data) => {};
        let websocketclose = (e) => {
            // 关闭
            unWsLogout(this.id, this.group).then((response) => {});
        };
        let guid = () => {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                var r = (Math.random() * 16) | 0;
                var v = c === "x" ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        };
        return {
          ...toRefs(state),
          guid,
          websocketsend,
          websocketclose,
          websocketonmessage,
          websocketonerror,
          websocketonopen,
          initWebSocket
        };
    },
});
</script>
