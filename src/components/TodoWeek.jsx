import React from 'react';
import styled, { css } from "styled-components";
// 이번주 요일에 맞춰서 날짜를 보여주는 컴포넌트

// my-coding-idea
// 1. 오늘의 날짜와 요일을 알아낸다
// 2. 오늘의 요일로 이번주의 시작일자와 끝날자을 정한다
// 오늘은 2월 9일 목요일
// -일요일시작일 경우: 
// firstday: -4
// lastday: +2

// -월요일 시작일 경우
// firstday: -3
// lastday: +3

// 조건문 7case를 만들고
// firstday 와 lastday는 한번만 구하며 변동하지 않으면 렌더링 되지 않는다.


// 오늘일 경우는 css를 다르게 처리한다.
// 오늘의 색깔과 todolist의 배경은 동일하게 처리하여 직관적으로 오늘의 할일 영역을 구분해준다.

// 참조: https://stackoverflow.com/questions/5210376/how-to-get-first-and-last-day-of-the-current-week-in-javascript

// ================================

// 저번주와 다음주는 다음에 생각


const TodoWeekWrapper = styled.div`
  display:flex;
  justify-content: center;
`;

const OnedayAWeek = styled.div`
  background-color: #fff;
  flex: 1;
  padding: 10px;
  text-align: center;

  & + & {
    border-left: 1px solid #a2a2a2;
  }
`;


function TodoWeek(props) {
  return (
    <TodoWeekWrapper>
      <OnedayAWeek>일</OnedayAWeek>
      <OnedayAWeek>월</OnedayAWeek>
      <OnedayAWeek>화</OnedayAWeek>
      <OnedayAWeek>수</OnedayAWeek>
      <OnedayAWeek>목</OnedayAWeek>
      <OnedayAWeek>금</OnedayAWeek>
      <OnedayAWeek>토</OnedayAWeek>
    </TodoWeekWrapper>
  );
}

export default TodoWeek;