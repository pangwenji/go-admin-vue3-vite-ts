import { defineComponent, computed, getCurrentInstance } from "vue";
import { useStore } from "vuex";
export default defineComponent({
    setup() {
        let store = useStore();
        let { ctx } = getCurrentInstance();
        let device = computed(() => {
            return store.state.app.device;
        });
        let fixBugIniOS = () => {
            const $subMenu = ctx.$refs.subMenu;
            if ($subMenu) {
                const handleMouseleave = $subMenu.handleMouseleave;
                $subMenu.handleMouseleave = (e: any) => {
                    if (ctx.device === "mobile") {
                        return;
                    }
                    handleMouseleave(e);
                };
            }
        };
        return {
            fixBugIniOS,
            device,
        };
    },
});
