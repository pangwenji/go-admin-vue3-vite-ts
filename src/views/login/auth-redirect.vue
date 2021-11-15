<script>
import {  defineComponent, onMounted } from "vue";
export default defineComponent({
    name: "AuthRedirect",
    render: function (h) {
        return h(); // avoid warning message
    },
    setup() {
        onMounted(() => {
            const hash = window.location.search.slice(1);
            if (window.localStorage) {
                window.localStorage.setItem("x-admin-oauth-code", hash);
                window.close();
            }
        });
        return {};
    },
});
</script>
