import  reset  from "styled-reset";
import { createGlobalStyle } from "styled-components";
import { useMediaQuery } from "react-responsive";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

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


// function App() {
//   return (
  
//   );
// }

// export default App;
