import React from "react";
import styled from "styled-components";
import TodoListItem from "./TodoListItem";

const TodoListWrapper = styled.div`
  min-height: 320px;
  max-height: 500px;
  overflow-y: auto ;
`;

function TodoList(props) {
  const { todos, onRemove, onToggle, onModify, onModifySubmit, onModifyCancel } = props;
  
  return (
    <TodoListWrapper>
      {todos.map((todo) => {
        {console.log(todo.id)}
        return <TodoListItem key={todo.id} todo={todo} onRemove={onRemove} onToggle={onToggle} onModify={onModify} onModifySubmit={onModifySubmit} onModifyCancel={onModifyCancel}/>;
      })}
    </TodoListWrapper>
  );
}

export default TodoList;