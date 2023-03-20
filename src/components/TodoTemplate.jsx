import React from 'react';
import styled from "styled-components";
import TodoWeek from './TodoWeek';

const TodoTemplateWrapper = styled.div`
  width: 500px;
  margin: 0 auto;
  margin-top: 6rem;
  border-radius: 10px;
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
const Year = styled.div`
  width: 100%; 
  padding: 10px;
  background-color: ${props => props.theme.bodyBg};
`;

function TodoTemplate(props) {
  const { year, week, today } = props;
  // {console.log(week);}
  const { children } = props;
  return (
    <TodoTemplateWrapper>
      <Year>
        {year}
      </Year>
      <TodoWeek/>
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