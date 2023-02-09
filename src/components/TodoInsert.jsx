import React, { useState } from 'react';
import styled from "styled-components";

const TodoInserWrapper = styled.form`
  display: flex;
  background: #495057;
`;

const StyledInput = styled.input`
  /* 기본 스타일 초기화 */
  background: none;
  outline: none;
  border: none;
  padding: 0.5rem;
  line-height: 1.5;
  color: white;
  flex: 1; // 버튼을 제외한 영역을 모두 차지하기

  &::placeholder {
    color: #dee2e6;
  }
`;

const StyledButton = styled.button`
  border: none;
  background: #868e96;
  color: white;
  padding: 0 1rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
`;


function TodoInsert({ onInsert }) {
  // 제어컴포넌트
  const [value, setValue] = useState('');
  
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e) => {
    onInsert(value);
    setValue(''); // value값 초기화

    // 여기까지 그냥놔두면 새로고침 되어서 날아가버린다..
    // submit 이벤트가 발생시키는 새로고침을 방지! 
    e.preventDefault();
  };

  return (
    <TodoInserWrapper>
      <StyledInput 
        type="text"
        placeholder="할 일을 입력해 주세요"
        value={value}
        onChange={handleChange}
      />
      <StyledButton 
        type="submit"
      />
    </TodoInserWrapper>
  );
}

export default TodoInsert;