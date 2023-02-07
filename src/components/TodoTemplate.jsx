import React from 'react';
import styled from "styled-components";

const TodoTemplateWrapper = styled.div`
  width: 500px;
  margin: 0 auto;
  

  /* .app-week {
    display: flex;
    
  } */
  .app-today {
    background: ${props => props.theme.indigo};
    color: ${props => props.theme.white};
    padding: 10px;
  }
  .todo-contents {
    display: flex;
    justify-content: space-evenly;
    background: ${props => props.theme.yellow };
  }
  
`;

function TodoTemplate(props) {
  const { year, week, today, contents } = props;
  {console.log(week);}
  return (
    <TodoTemplateWrapper>
      <div>{year}</div>
      {/* <div className="app-week">{week}</div> */}
      <div className="app-today">{today}</div>
      <div className="todo-contents">{contents}</div>
    </TodoTemplateWrapper>
  );
}

export default TodoTemplate;