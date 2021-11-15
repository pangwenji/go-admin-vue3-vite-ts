import Cookies from "js-cookie";
interface stateProp {
    opened: boolean,
    withoutAnimation: boolean,
    sidebar: any,
    device: String | any,
    size:String | any
}
const appStore = {
    namespace:true,
    state: {
        sidebar: {
            opened: Cookies.get("sidebarStatus") ? !!+Cookies.get("sidebarStatus") : true,
            withoutAnimation: false,
        },
        device: "desktop",
        size: Cookies.get("size") || "medium",
    },
    mutations: {
        TOGGLE_SIDEBAR: (state:stateProp) => {
            state.sidebar.opened = !state.sidebar.opened;
            state.sidebar.withoutAnimation = false;
            if (state.sidebar.opened) {
                Cookies.set("sidebarStatus", 1);
            } else {
                Cookies.set("sidebarStatus", 0);
            }
        },
        CLOSE_SIDEBAR: (state:stateProp, withoutAnimation:stateProp) => {
            Cookies.set("sidebarStatus", 0);
            state.sidebar.opened = false;
            state.sidebar.withoutAnimation = withoutAnimation;
        },
        TOGGLE_DEVICE: (state:stateProp, device:stateProp) => {
            state.device = device;
        },
        SET_SIZE: (state:stateProp, size:stateProp) => {
            state.size = size;
            Cookies.set("size", size);
        },
    },
    actions: {
        toggleSideBar({ commit }:any) {
            commit("TOGGLE_SIDEBAR");
        },
        closeSideBar({ commit }:any, { withoutAnimation }: stateProp) {
            commit("CLOSE_SIDEBAR", withoutAnimation);
        },
        toggleDevice({ commit }:any, device: stateProp) {
            commit("TOGGLE_DEVICE", device);
        },
        setSize({ commit }:any, size: stateProp) {
            commit("SET_SIZE", size);
        },
    },
};

export default appStore;
