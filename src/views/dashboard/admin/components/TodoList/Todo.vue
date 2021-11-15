<template>
    <li :class="{ completed: todo.done, editing: editing }" class="todo">
        <div class="view">
            <input :checked="todo.done" class="toggle" type="checkbox" @change="toggleTodo(todo)" />
            <label @dblclick="editing = true" v-text="todo.text" />
            <button class="destroy" @click="deleteTodo(todo)" />
        </div>
        <input
            v-show="editing"
            v-focus="editing"
            :value="todo.text"
            class="edit"
            @keyup.enter="doneEdit"
            @keyup.esc="cancelEdit"
            @blur="doneEdit"
        />
    </li>
</template>

<script>
import { reactive, defineComponent, onMounted, toRefs, computed } from "vue";
import { useStore } from "vuex";
export default defineComponent({
    name: "Todo",
    props: {
        todo: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    directives: {
        focus(el, { value }, { context }) {
            if (value) {
                context.$nextTick(() => {
                    el.focus();
                });
            }
        },
    },
    setup(props, context) {
        let state = reactive({
            editing: false,
        });
        let deleteTodo = (todo) => {
            context.$emit("deleteTodo", todo);
        };
        let editTodo = ({ todo, value }) => {
            context.$emit("editTodo", { todo, value });
        };
        let toggleTodo = (todo) => {
            context.$emit("toggleTodo", todo);
        };
        let doneEdit = (e) => {
            const value = e.target.value.trim();
            if (!value) {
                deleteTodo({
                    todo: props.todo,
                });
            } else if (state.editing) {
                editTodo({
                    todo: props.todo,
                    value,
                });
                state.editing = false;
            }
        };
        let cancelEdit = (e) => {
            e.target.value = state.todo.text;
            state.editing = false;
        };
        return {
            ...toRefs(state),
            cancelEdit,
            doneEdit,
            toggleTodo,
            editTodo,
            deleteTodo,
        };
    },
});
</script>
