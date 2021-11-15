<template>
    <div class="dashboard-container">
        <component :is="currentRole" />
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import adminDashboard from "./admin";
import editorDashboard from "./editor";

import { reactive, defineComponent, onMounted,  toRefs, computed } from "vue";
import { useStore } from "vuex";
export default defineComponent({
    name: "Dashboard",
    components: { adminDashboard, editorDashboard },
    setup() {
        let state = reactive({
            currentRole: "adminDashboard",
        });
        let store = useStore();
        let roles = computed(() => {
            //  return store.
        });

        onMounted(() => {
            // if (!this.roles.includes('admin')) {
            //   this.currentRole = 'editorDashboard'
            // }
        });
        return {
            ...toRefs(state),
            roles,
        };
    },
});
</script>
