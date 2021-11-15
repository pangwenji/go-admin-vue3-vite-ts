<template>
    <div :class="{ show: show }" class="header-search">
        <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" />
        <el-select
            ref="headerSearchSelect"
            v-model="search"
            :remote-method="querySearch"
            filterable
            default-first-option
            remote
            placeholder="Search"
            class="header-search-select"
            @change="change"
        >
            <el-option
                v-for="item in options"
                :key="item.path"
                :value="item"
                :label="item.title.join(' > ')"
            />
        </el-select>
    </div>
</template>

<script>
// fuse is a lightweight fuzzy-search module
// make search results more in line with expectations
import Fuse from "fuse.js";
import path from "path";
import {
    defineComponent,
    reactive,
    computed,
    watch,
    onMounted,
    toRefs,
    getCurrentInstance,
} from "vue";
import { useStore } from "vuex";
import { useRouter } from 'vue-router';
import RightPanel from "@/components/RightPanel";
import { Sidebar } from "./components";
export default defineComponent({
    name: "HeaderSearch",
    watch: {
        routes() {
            this.searchPool = this.generateRoutes(this.routes);
        },
        searchPool(list) {
            this.initFuse(list);
        },
        show(value) {
            if (value) {
                document.body.addEventListener("click", close);
            } else {
                document.body.removeEventListener("click", close);
            }
        },
    },
    setup() {
        let state = reactive({
            search: "",
            options: [],
            searchPool: [],
            show: false,
            fuse: undefined,
        });
        let {ctx} = getCurrentInstance();
        let routes = ref([]);
        let click = () => {
            state.show = !state.show;
            if (state.show) {
                ctx.$refs.headerSearchSelect && ctx.$refs.headerSearchSelect.focus();
            }
        };
        let close = () => {
            ctx.$refs.headerSearchSelect && ctx.$refs.headerSearchSelect.blur();
            state.options = [];
            state.show = false;
        };
        let router =useRouter()
        let change = (val) => {
          router.$router.push(val.path);
            state.search = "";
            state.options = [];
            this.$nextTick(() => {
              state.show = false;
            });
        };
        let initFuse = (list) => {
            state.fuse = new Fuse(list, {
                shouldSort: true,
                threshold: 0.4,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [
                    {
                        name: "title",
                        weight: 0.7,
                    },
                    {
                        name: "path",
                        weight: 0.3,
                    },
                ],
            });
        };
        // And generate the internationalized title
        let generateRoutes = (routes, basePath = "/", prefixTitle = []) => {
            let res = [];
            for (const router of routes) {
                // skip hidden router
                if (router.hidden) {
                    continue;
                }
                const data = {
                    path: path.resolve(basePath, router.path),
                    title: [...prefixTitle],
                };
                if (router.meta && router.meta.title) {
                    data.title = [...data.title, router.meta.title];

                    if (router.redirect !== "noRedirect") {
                        // only push the routes with title
                        // special case: need to exclude parent router without redirect
                        res.push(data);
                    }
                }
                // recursive child routes
                if (router.children) {
                    const tempRoutes = generateRoutes(router.children, data.path, data.title);
                    if (tempRoutes.length >= 1) {
                        res = [...res, ...tempRoutes];
                    }
                }
            }
            return res;
        };
        let querySearch = (query) => {
            if (query !== "") {
                state.options = state.fuse.search(query);
            } else {
                state.options = [];
            }
        };
        let store = useStore();
        let routes = computed(() => {
            return store.getters.permission_routes;
        });
        onMounted(() => {
            generateRoutes(routes);
        });
        return {
            ...toRefs(state),
            querySearch,
            generateRoutes,
            initFuse,
            change,
            close,
            click,
            routes
        };
    },
});
</script>

<style lang="scss" scoped>
.header-search {
    font-size: 0 !important;

    .search-icon {
        cursor: pointer;
        font-size: 18px;
        vertical-align: middle;
    }

    .header-search-select {
        font-size: 18px;
        transition: width 0.2s;
        width: 0;
        overflow: hidden;
        background: transparent;
        border-radius: 0;
        display: inline-block;
        vertical-align: middle;

        ::v-deep .el-input__inner {
            border-radius: 0;
            border: 0;
            padding-left: 0;
            padding-right: 0;
            box-shadow: none !important;
            border-bottom: 1px solid #d9d9d9;
            vertical-align: middle;
        }
    }

    &.show {
        .header-search-select {
            width: 210px;
            margin-left: 10px;
        }
    }
}
</style>
