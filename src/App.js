import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Reset } from "styled-reset";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { useMediaQuery } from "react-responsive";
import { v4 as uuidv4 } from "uuid";
import * as dateFns from "date-fns";
import {ko} from "date-fns/locale";
import TodoTemplate from './components/TodoTemplate';
import TodoList from './components/TodoList';
import TodoInsert from './components/TodoInsert';
import TodoWeek from './components/TodoWeek';

// 참고) 반응형 라이브러리 사용
// 조건부 렌더링
// {isMobile ? (
//  모바일일 때 
// ) : (
//  PC일 때
// )}

// styled-components 를 사용하면 좋은점!
// props로 넘겨줄 수 있다.
// isMobile값으로 css도 다르게 처리 가능
// global 스타일 지정

// 참조 사이트: https://www.howdy-mj.me/css/styled-components-with-global-style

// 디스플레이 사이즈 설정 // react-responsive 를 조금 더 찾아보고 사용해야 할 듯
// const size = {
//   mobile: '600px',
//   tablet: '900px',
//   laptop: '1200px',
//   desktop: '1800px',
// }


// 테마 설정
const theme = {
  white: '#fff',
  black: '#000',
  pinkBackground: '#ff99cc', 
  grayBackground: '#dfdfdf',
  disabled: '#f7f7f7',
  gray100: '#f1f1f1',
  gray200: '#eee',
  gray300: '#ccc',
  gray400: '#aaa',
  gray500: '#999',
  gray600: '#777',
  gray700: '#555',
  gray800: '#333',
  gray900: '#111',
  blue: '#41a1ea',
  indigo: '#727cf5',
  purple: '#6b5eae',
  pink: '#ff679b',
  red: '#f05b5b',
  orange: '#fd7e14',
  yellow: '#ffee99',
  green: '#0acf97',
  teal: '#02a8b5',
  cyan: '#39afd1',
  bodyBg: '#f4f5f6',
};

// 글로벌 스타일 설정
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }

  body {
    background: ${props => theme.grayBackground};
  }
`;



function App(props) {
  // 화면에 뿌려줄 todos 상태 
  const [todos, setTodos] = useState([]);

  
  
  // 로컬 스토리지에서 남아있는 객체데이터 가져오기
  useEffect(() => {
    const dbTodos = JSON.parse(localStorage.getItem('todos')) || [...todos];
    setTodos(dbTodos);
  }, []);

  // 로컬스토리지로 바뀐 배열 업데이트 해주기
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // id값은 렌더링되는 정보가 아니기 때문에 ref사용
  // 단순히 새로운 항목을 만들 때 참조되는 값임
  const nextId = useRef();

  // todos 배열에 새 객체를 추가하기 위한 handleInsert() 함수 정의
  const handleInsert = useCallback((text) => {
    const todo = {
      // uuid를 사용해서 id를 받아오는 방법
      id: uuidv4(), 
      text, // key이름 : key이름 일때 key값만 보내줘도 value로 들어감
      checked: false,
      modify_check: false
    };
    setTodos(todos.concat(todo)); // 새로운 배열 반환함

    nextId.current ++ ; // nextId에 1씩 더하기

    // uuid 로컬 스토리지에 저장
    // set.Item, get.Item
    // setItem('이름', 들어갈 값)
    // 배열을 JSON으로 
    // localStorage.setItem('todos', JSON.stringify(todos.concat(todo)));
  }, [todos]);

  // todos 배열에서 id로 항목을 지우기 위한 handleRemove() 함수 정의
  // 불변성을 지키면서 배열의 요소를 제거해야 할 때 filter()활용
  const handleRemove = useCallback((id) => {
    // true값만 모아 새로운 배열 만듦
    setTodos(todos.filter((todo) => todo.id !== id ));
    // localStorage.setItem('todos', JSON.stringify(todos.filter((todo) => todo.id !== id )));
  }, [todos]);

  const handleToggle = useCallback((id) => {
    setTodos(
      // true: todo객체 그대로 가져와서, id값이 같은 것의 checked속성만 반전시켜서 다시 넣어줌 
      // false: todo객체 그대로 다시 넣어 줌
      todos.map((todo) => todo.id === id ? { ...todo, checked: !todo.checked } : todo )
    );  
    // localStorage.setItem('todos', JSON.stringify(todos.map((todo) => todo.id === id ? { ...todo, checked: !todo.checked } : todo )));
  }, [todos]);

  // 수정 버튼 누르면
  // 해당리스트 아이템이 활성화되면서
  // 
  const handleModify = useCallback((id)=>{
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, modify_check: true };
      }
      return { ...todo };
      })
    );
  }, [todos]);

  /* 수정 완료 */
  const handleModifySubmit = useCallback((id, text)=>{
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, text: text, modify_check: false };
      }
      return { ...todo };
      })
    );
  }, [todos]);

  /* 수정 취소 */
  const handleModifyCancel = useCallback((id)=>{
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, modify_check: false };
      }
      return { ...todo };
      })
    );
  }, [todos]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Reset/>
        <GlobalStyle />
        <TodoTemplate
          year = {
            <div>
              {dateFns.format(new Date(), 'yyyy')}
            </div>
          }
          // week = {
            // 주간 달력을 만들고 싶었으나 ,, 너무 어려워서 일단 pass
          // } 
          today = {
            <div>
              <span>💚</span>
              {dateFns.format(new Date(), 'MM-dd')}
              &nbsp; 오늘의 할 일 &nbsp;
              <span>🎈</span>
              
            </div>
          }
        >
          <TodoWeek />
          <TodoInsert onInsert={handleInsert} />
          <TodoList todos={todos} onRemove={handleRemove} onToggle={handleToggle} onModify={handleModify} onModifySubmit={handleModifySubmit} onModifyCancel={handleModifyCancel}/>
        </TodoTemplate>
      </ThemeProvider>
    </>
  );
}

export default App;



// date-fns로 몇시간 전 출력하기
// https://devbksheen.tistory.com/entry/date-fns%EB%A1%9C-%EB%82%A0%EC%A7%9C-%ED%8F%AC%EB%A7%B7%ED%8C%85%ED%95%98%EA%B8%B0
// function formatDate(date) {
//   const d = new Date(date);
//   const now = Date.now();
//   const diff = (now - d.getTime()) / 1000; //현재 시간과의 차이(초)
//   if (diff < 60 * 1 ) { // 1분 미만일땐 방금전 표기
//     return "방금 전";
//   }
//   if (diff < 60 * 60 * 24 * 3) { // 3일 미만일 땐 시간차이 출력(몇시간 전, 몇일 전)
//     return formatDistanceToNow(d, {addSuffix: true, local: ko});
//   }
//   return format(d, 'PPP EEE p', {local: ko}); //날짜 포멧
// }