<script>
import { defineComponent } from "vue";
import { useRoute, useRouter } from "vuex";
export default defineComponent({
    setup() {
        let route = useRoute();
        let router = useRouter();
        let { params, query } = route;
        let { path } = params;
        let render = (h) => {
            return h(); // avoid warning message
        };
        router.replace({ path: "/" + path, query });
        return {
          render
        };
    },
});
</script>
