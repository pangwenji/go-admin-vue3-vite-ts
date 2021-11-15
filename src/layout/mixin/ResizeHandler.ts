import {
    defineComponent,
    watch,
    onBeforeMount,
    onBeforeUnmount,
    getCurrentInstance,
    onMounted,
} from "vue";
import { useStore } from 'vuex';
const WIDTH = 992 
export default defineComponent({
    setup() {
        watch(
            () => {},
            () => {},
            {}
        );
        const { ctx } = getCurrentInstance();
        let store = useStore()
        watch(() => {
        //  $route(route) {
        //   if (this.device === 'mobile' && this.sidebar.opened) {
        //     store.dispatch('app/closeSideBar', { withoutAnimation: false })
        //   }
        //  }
        }, () => { }, {})
        onBeforeMount(() => {
            window.addEventListener("resize", ctx.$_resizeHandler);
        });
        onBeforeUnmount(() => {
            window.removeEventListener("resize", ctx.$_resizeHandler);
        });
        onMounted(() => {
            if (isMobile()) {
                store.dispatch("app/toggleDevice", "mobile");
                store.dispatch("app/closeSideBar", { withoutAnimation: true });
            }
        });

        const isMobile = () => {
            const rect = document.body.getBoundingClientRect();
            return rect.width - 1 < WIDTH;
        };

        const $_resizeHandler = () => {
            if (!document.hidden) {
                store.dispatch("app/toggleDevice", isMobile() ? "mobile" : "desktop");

                if (isMobile()) {
                    store.dispatch("app/closeSideBar", { withoutAnimation: true });
                }
            }
        };

        return {
            isMobile,
            $_resizeHandler
        };
    },
});
