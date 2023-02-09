import { useState } from "react";
import styled, { css } from "styled-components";
import { MdClose, MdMenu } from "react-icons/md";
import Button from "./common/Button";
import Modal from "./common/Modal";

const Header = styled.header`
  background: #1c1c1c;
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
`;

const MenuButton = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  cursor: pointer;
  &:hover {
    color: gray;
  }
`;

const CloseButton = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  &:hover {
    color: black;
  }
`;

const MenuContainer = styled.div`
  width: 50%;
  height: 100vh;
  position: fixed;
  top: 0;
  /* right: -500px; */
  right: -100%;
  /* right: -100vw; */
  background-color: gray;

  transition: 0.5s;
  ${props => props.showMenu && 
    css`
      right: 0;
    `}
`;

function AppContainer(props) {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Header>
        <h4>로고</h4>
        <MenuButton onClick={() => { setShowMenu(true); }}>
          <MdMenu />
        </MenuButton>
      </Header>

      {/* {showMenu && ( */}
        <MenuContainer showMenu={showMenu}>
          <CloseButton onClick={() => { setShowMenu(false); }}>
            <MdClose />
          </CloseButton>
        </MenuContainer>
      {/* )} */}

      <Button size="medium" outline onClick={() => { setShowModal(true); }}>모달</Button>

      <Modal
        title="경고"
        size="small"
        cancelText="취소"
        confirmText="삭제"
        onCancel={() => {
          setShowModal(false);
        }}
        onConfirm={undefined}
        visible={showModal}
      >
        삭제하시겠습니까?
      </Modal>
    </>
  );
}

export default AppContainer;