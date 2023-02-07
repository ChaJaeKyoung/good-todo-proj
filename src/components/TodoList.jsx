import React from "react";
import styled from "styled-components";
import TodoListItem from "./TodoListItem";

const TodoListWrapper = styled.div`
  min-height: 320px;
  max-height: 500px;
  overflow-y: auto ;
`;

function TodoList(props) {
  const { todos, onRemove, onToggle, inputDate } = props;
  return (
    <TodoListWrapper>
      {todos.map((todo) => {
        return <TodoListItem key={todo.id} todo={todo} onRemove={onRemove} onToggle={onToggle} />;
      })}
    </TodoListWrapper>
  );
}

export default TodoList;