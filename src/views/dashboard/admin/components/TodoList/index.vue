<template>
    <section class="todoapp">
        <!-- header -->
        <header class="header">
            <input
                class="new-todo"
                autocomplete="off"
                placeholder="Todo List"
                @keyup.enter="addTodo"
            />
        </header>
        <!-- main section -->
        <section v-show="todos.length" class="main">
            <input
                id="toggle-all"
                :checked="allChecked"
                class="toggle-all"
                type="checkbox"
                @change="toggleAll({ done: !allChecked })"
            />
            <label for="toggle-all" />
            <ul class="todo-list">
                <todo
                    v-for="(todo, index) in filteredTodos"
                    :key="index"
                    :todo="todo"
                    @toggleTodo="toggleTodo"
                    @editTodo="editTodo"
                    @deleteTodo="deleteTodo"
                />
            </ul>
        </section>
        <!-- footer -->
        <footer v-show="todos.length" class="footer">
            <span class="todo-count">
                <strong>{{ remaining }}</strong>
                {{ remaining | pluralize("item") }} left
            </span>
            <ul class="filters">
                <li v-for="(val, key) in filters" :key="key">
                    <a
                        :class="{ selected: visibility === key }"
                        @click.prevent="visibility = key"
                        >{{ key | capitalize }}</a
                    >
                </li>
            </ul>
            <!-- <button class="clear-completed" v-show="todos.length > remaining" @click="clearCompleted">
        Clear completed
      </button> -->
        </footer>
    </section>
</template>

<script>
import Todo from "./Todo.vue";
const STORAGE_KEY = "todos";

import { reactive, defineComponent, onMounted, toRefs, computed } from "vue";
import { useStore } from "vuex";
export default defineComponent({
    components: { Todo },
    setupt() {
        let state = reactive({
            visibility: "all",
            filters: {
                all: (todos) => todos,
                active: (todos) => todos.filter((todo) => !todo.done),
                completed: (todos) => todos.filter((todo) => todo.done),
            },
            todos: [
                { text: "star this repository", done: false },
                { text: "fork this repository", done: false },
                { text: "follow author", done: false },
                { text: "vue-element-admin", done: true },
                { text: "vue", done: true },
                { text: "element-ui", done: true },
                { text: "axios", done: true },
                { text: "webpack", done: true },
            ],
        });

        let pluralize = computed(() => {
            return (n, w) => (n === 1 ? w : w + "s");
        });
        let capitalize = computed(() => {
            return (s) => s.charAt(0).toUpperCase() + s.slice(1);
        });
        let allChecked = computed(() => {
            return state.todos.every((todo) => todo.done);
        });
        let filteredTodos = computed(() => {
            return filters[state.visibility](state.todos);
        });
        let remaining = computed(() => {
            return state.todos.filter((todo) => !todo.done).length;
        });

        let setLocalStorage = () => {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
        };
        let addTodo = (e) => {
            const text = e.target.value;
            if (text.trim()) {
                state.todos.push({
                    text,
                    done: false,
                });
                setLocalStorage();
            }
            e.target.value = "";
        };
        let toggleTodo = (val) => {
            val.done = !val.done;
            setLocalStorage();
        };
        let deleteTodo = (todo) => {
            state.todos.splice(state.todos.indexOf(todo), 1);
            setLocalStorage();
        };
        let editTodo = ({ todo, value }) => {
            todo.text = value;
            setLocalStorage();
        };
        let clearCompleted = () => {
            state.todos = state.todos.filter((todo) => !todo.done);
            setLocalStorage();
        };
        let toggleAll = ({ done }) => {
            state.todos.forEach((todo) => {
                todo.done = done;
                setLocalStorage();
            });
        };
        return {
            ...toRefs(state),
            toggleAll,
            clearCompleted,
            editTodo,
            deleteTodo,
            toggleTodo,
            addTodo,
            setLocalStorage,
            remaining,
            filteredTodos,
            allChecked,
            capitalize,
            pluralize,
        };
    },
});
</script>
<style lang="scss">
@import "./index.scss";
</style>
