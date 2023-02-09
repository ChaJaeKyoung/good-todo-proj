import React from 'react';
import styled from "styled-components";

const TodoTemplateWrapper = styled.div`
  width: 500px;
  margin: 0 auto;
  margin-top: 6rem;
  border-radius: 4px;
  overflow: hidden;

  /* .app-week {
    display: flex;
  } */
  .app-today {
    background: ${props => props.theme.indigo};
    color: ${props => props.theme.white};
    height: 2rem;
    font-size: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .todo-contents {
    
    background: ${props => props.theme.yellow };
  }
  
`;

function TodoTemplate(props) {
  const { year, week, today } = props;
  // {console.log(week);}
  const { children } = props;
  return (
    <TodoTemplateWrapper>
      <div>{year}</div>
      {/* <div className="app-week">{week}</div> */}
      <div className="app-today">
      <div>
        {/* <span>💚</span>
        {dateFns .format(new Date(), 'MM-dd')}
        &nbsp; 오늘의 할 일 &nbsp;
        <span>🎈</span> */}
        {today}
      </div>
      </div>
      <div className="todo-contents">{ children }</div>
    </TodoTemplateWrapper>
  );
}

export default TodoTemplate;