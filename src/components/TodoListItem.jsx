import React from 'react';
import styled, { css } from "styled-components";
import { BsSquare as UncheckBox, BsCheckSquareFill as CheckedBox, BsTrash as Trash, BsPencilSquare as Pencil } from "react-icons/bs";

const TodoListWrapper = styled.div`
padding: 1rem;
display: flex;
align-items: center;
`;

const Checkbox = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;

  svg {
    /* 아이콘 스타일링 */
    font-size: 1.5rem;
  
    /* 체크되었을 때 보여 줄 스타일 */
    color: ${props => props.checked && '#22b8cf'}
  }
`

const Text = styled.div`
  margin-left: 0.5rem;
  flex: 1; // 차지할 수 있는 영역 모두 차지

  /* 체크 되었을 때 보여 줄 스타일 */
  /* 조건부 스타일링 시 여러개의 css를 설정할 때는 아래 형식으로 사용 */
  ${props => props.checked && 
    css`
      color: #adb5bd;
      text-decoration: line-through;
  `}
`;

const Remove = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  color: #ff6b6b;
  cursor: pointer;
  &:hover {
    color: #ff8787;
  }
`;

// TODO input text 수정버튼 만들기 및 구현방법
// 참조:https://youtu.be/krZKB59wpe4

// my-coding-idea
// 수정버튼 아이콘을 누르면 
// 1. 해당 todolist item의 input텍스트의 내용을 변경하도록 한다.
// 2. 수정버튼 아이콘 자리에 저장버튼과 취소버튼이 나타나게 해준다.
// 취소버튼- 이전상태로 돌아가기
// 저장버튼- 바뀐 텍스트 저장하기

const Modify = styled.div`

`;


function TodoListItem(props) {
  const { todo: { id, text, checked }, onRemove, onToggle } = props;
  return (
    <div>
      <TodoListWrapper>
        <Checkbox checked={checked} onClic={ ()=> { onToggle(id); }}>
          { checked ? <UncheckBox /> : <CheckedBox /> }
        </Checkbox>
        <Text checked={onToggle}>{text}</Text>
        {/* 수정버튼을 누르면, 
          1. 취소수정 버튼이 등장 
          2. 해당 id에 저장된text 데이터로 리스트 아이템에 input렌더링 커서는깜빡거리게 마지막 text오른쪽 옆에서 포커싱 
        */}
        
        {/* <Modify onClick={}>
          <Pencil />
        </Modify> */}
        <Remove onClick={() => { onRemove(id);}}>
          <Trash />
        </Remove>
      </TodoListWrapper>
    </div>
  );
}

export default TodoListItem;