import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import HashLoader from 'react-spinners/HashLoader';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import { subDays, addDays } from 'date-fns';
import { useDropzone } from 'react-dropzone';
import produce from 'immer';
import { toast } from 'react-toastify';
import { ellipsis } from 'polished';

import { shopSelector } from '../../module/shopSlice';
import { goodsSelector, goodsAction } from '../../module/goodsSlice';

import Header from './common/Header';
import Body from './common/Body';
import Tab from './common/Tab';
import Button from '../../components/Button';
import Toggle from '../../components/Toggle';
import Modal from '../../components/Modal';
import SelectInput from '../../components/SelectInput';
import BackgroundLoading from '../../components/BackgroundLoading';

import { ReactComponent as CalendarIcon } from '../../assets/images/common/icon-calendar.svg';
import { ReactComponent as PlusIcon } from '../../assets/images/common/icon-plus-circle.svg';
import { ReactComponent as UploadIcon } from '../../assets/images/common/icon-upload.svg';
import { ReactComponent as CopyIcon } from '../../assets/images/common/icon-copy.svg';
import { ReactComponent as LeftArrowIcon } from '../../assets/images/goods/ic-left-arrow.svg';
import { ReactComponent as RightArrowIcon } from '../../assets/images/goods/ic-right-arrow.svg';

const MenuList = props => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  const shopInfo = useSelector(shopSelector.shopInfo);
  const categoryList = useSelector(goodsSelector.categoryList);
  const joinCategoryList = useSelector(goodsSelector.joinCategoryList);
  const { mainCategoryList, subCategoryList } = useSelector(goodsSelector.sortedCategoryList);
  const menuList = useSelector(goodsSelector.menuList);
  const goodsStatus = useSelector(goodsSelector.status);

  const [modal, setModal] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [copyDate, setCopyDate] = useState(new Date());
  const [file, setFile] = useState(null);
  const [goods, setGoods] = useState({});
  const [mainCategoryOptionList, setMainCategoryOptionList] = useState([]);
  const [subCategoryOptionList, setSubCategoryOptionList] = useState([]);
  const [menuListType, setMenuListType] = useState('DAY');

  useEffect(() => {
    if (isMobile) {
      setMenuListType('DAY');
    }
  }, [isMobile]);

  useEffect(() => {
    if (mainCategoryList.length > 0) {
      const newList = [];

      for (const mainCategory of mainCategoryList) {
        newList.push({
          title: mainCategory.categoryNm,
          value: mainCategory.categoryId
        });
        setMainCategoryOptionList(newList);
      }
    }
  }, [mainCategoryList]);

  useEffect(() => {
    setSubCategoryOptionList([]);
    if (subCategoryList.length > 0) {
      const newList = [];

      const filteredSubCategoryList = subCategoryList.filter(subCategory => subCategory.categoryPid === goods.mainCategoryId);

      for (const subCategory of filteredSubCategoryList) {
        newList.push({
          title: subCategory.categoryNm,
          value: subCategory.categoryId
        });
        setSubCategoryOptionList(newList);
      }
    }
  }, [subCategoryList, goods.mainCategoryId]);

  const selectCategoryInfo = useRef({
    mainCategory: {},
    subCategory: {},
    // selectDate: new Date(),
  });

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <DateInput onClick={onClick}>
      <CalendarIcon />
      <StyledInput
        width="9.375rem"
        height="2.375rem"
        ref={ref}
        value={value}
        readOnly
      />
    </DateInput>
  ));

  const CustomButton = forwardRef(({ value, onClick }, ref) => (
    <CalendarIcon className="bg-blue" onClick={onClick} ref={ref} />
  ));

  useEffect(() => {
    if (goodsStatus.actionResult === 'MENU_ADD_OK') {
      dispatch(goodsAction.categoryList({ brandId: shopInfo.brandId, categoryType: 'MEAL' }));
      dispatch(goodsAction.menuList({ shopId: shopInfo.shopId, orderDt: startDate, menuListType }));
      toast.info('🦄 메뉴 저장 성공');
    } else if (goodsStatus.actionResult === 'MENU_ADD_ERR') {
      toast.error('🚀 메뉴 저장 실패');
    } else if (goodsStatus.actionResult === 'MENU_UPDATE_OK') {
      dispatch(goodsAction.categoryList({ brandId: shopInfo.brandId, categoryType: 'MEAL' }));
      dispatch(goodsAction.menuList({ shopId: shopInfo.shopId, orderDt: startDate, menuListType }));
      toast.info('🦄 메뉴 수정 성공');
    } else if (goodsStatus.actionResult === 'MENU_UPDATE_ERR') {
      toast.error('🚀 메뉴 수정 실패');
    } else if (goodsStatus.actionResult === 'MENU_REMOVE_OK') {
      dispatch(goodsAction.categoryList({ brandId: shopInfo.brandId, categoryType: 'MEAL' }));
      dispatch(goodsAction.menuList({ shopId: shopInfo.shopId, orderDt: startDate, menuListType }));
      toast.info('🦄 메뉴 삭제 성공');
    } else if (goodsStatus.actionResult === 'MENU_REMOVE_ERR') {
      toast.error('🚀 메뉴 삭제 실패');
    }
  }, [dispatch, goodsStatus.actionResult, shopInfo.brandId, shopInfo.shopId, startDate, menuListType]);

  const handleChange = useCallback((key, value) => {
    setGoods(goods => produce(goods, draft => {
      draft[key] = value;
    }));
  }, []);

  const onDrop = useCallback((acceptedFiles, fileRejections, event) => {
    const file = acceptedFiles[0];

    if (!file) {
      toast.error('🚀 지원하지않는 파일입니다.');
      return;
    }

    // Object.assign(file, {
    //   preview: URL.createObjectURL(file),
    // });
    setFile(file);

    handleChange('imageSize', file.size);
    handleChange('imagePath', URL.createObjectURL(file),);
  }, [handleChange]);

  const {getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject} = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png, image/gif', // 'image/*'
    multiple: false,
  });

  useEffect(() => {
    return () => {
      dispatch(goodsAction.goodsStateClear());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!shopInfo.brandId || !shopInfo.shopId) {
      return;
    }

    dispatch(goodsAction.categoryList({ brandId: shopInfo.brandId, categoryType: 'MEAL' }));
    dispatch(goodsAction.menuList({ shopId: shopInfo.shopId, orderDt: startDate, menuListType }));
  }, [dispatch, shopInfo.brandId, shopInfo.shopId, startDate, menuListType]);

  const handleCategoryAdd = useCallback(() => {
    props.push('/goods/category/newlist');
  }, [props]);

  const handleSubDays = useCallback(() => {
    setStartDate(subDays(startDate, 1));
  }, [startDate]);

  const handleAddDays = useCallback(() => {
    setStartDate(addDays(startDate, 1));
  }, [startDate]);

  const openMenuModal = useCallback((selectDate, mainCategory, subCategory, menu) => {
    setFile(null);
    setIsCopy(false);

    if (menu) { // 메뉴가 있으면 수정 모드
      setIsModify(true);
      setGoods(goods => produce(goods, draft => {
        draft.mainCategoryId = mainCategory.categoryId;
        draft.subCategoryId = subCategory.categoryId;
        draft.stockId = menu.stockId;
        draft.goodsId = menu.goodsId;
        draft.goodsNm = menu.goodsNm;
        draft.goodsDetail = menu.goodsDetail;
        draft.orderCnt = menu.orderCnt;
        draft.orderMax = menu.orderMax;
        draft.orderDt = menu.orderDt;
        draft.imageSize = menu.imageSize;
        draft.imagePath = menu.imagePath;
        draft.soldOutYn = menu.soldOutYn;
      }));
    } else { // 등록 모드
      setIsModify(false);
      setGoods({
        goodsNm: '',
        goodsDetail: '',
        orderMax: 99999,
        orderDt: '',
        imageSize: 0,
        imagePath: '',
      });
    }

    selectCategoryInfo.current.mainCategory = mainCategory;
    selectCategoryInfo.current.subCategory = subCategory;
    selectCategoryInfo.current.selectDate = selectDate;

    setModal(true);
  }, []);

  const handleSave = useCallback(() => {
    let menu = {
      spaceId: shopInfo.spaceId,
      brandId: shopInfo.brandId,
      shopId: shopInfo.shopId,
      categoryId: goods.subCategoryId || selectCategoryInfo.current.subCategory.categoryId,
      goodsNm: goods.goodsNm,
      goodsEngNm: goods.goodsNm,
      goodsBillNm: goods.goodsNm,
      goodsDetail: goods.goodsDetail,
      goodsEngDetail: goods.goodsDetail,
      imageSize: goods.imageSize,
      imagePath: goods.imagePath || '',
      orderMax: Number(goods.orderMax),
      orderDt: isCopy ? dayjs(copyDate).format('YYYY-MM-DD') : dayjs(selectCategoryInfo.current.selectDate).format('YYYY-MM-DD'),
    };

    let uploadFlag = '';
    if (file) {
      uploadFlag = 'UPLOAD';
    } else {
      if (isCopy && goods.imagePath) {
        uploadFlag = 'COPY';
      }
    }

    // console.log(uploadFlag);
    // console.log(menu);
    dispatch(goodsAction.menuAdd({ brandId: shopInfo.brandId, file, menu, uploadFlag }));

    setModal(false);
  }, [dispatch, goods, file, shopInfo.shopId, shopInfo.brandId, shopInfo.spaceId, isCopy, copyDate]);

  const handleModify = useCallback(() => {
    let menu = {
      stockId: goods.stockId,
      goodsId: goods.goodsId,
      goodsNm: goods.goodsNm,
      goodsEngNm: goods.goodsNm,
      goodsBillNm: goods.goodsNm,
      goodsDetail: goods.goodsDetail,
      goodsEngDetail: goods.goodsDetail,
      imageSize: goods.imageSize,
      imagePath: goods.imagePath,
      // orderCnt: Number(goods.orderCnt),
      orderMax: Number(goods.orderMax),
      soldOutYn: goods.soldOutYn
    };

    dispatch(goodsAction.menuUpdate({ brandId: shopInfo.brandId, goodsId: goods.goodsId, file, menu }));

    setModal(false);
  }, [dispatch, goods, file, shopInfo.brandId]);

  const handleCancel = useCallback(() => {
    setModal(false);
  }, []);

  const handleDelete = useCallback(() => {
    dispatch(goodsAction.menuRemove({ goodsId: goods.goodsId, stockId: goods.stockId }));

    setModal(false);
  }, [dispatch, goods]);
  
  const handleChangeListType = useCallback(e => {
    setMenuListType(e.target.value);
  }, []);

  const handleCopy = useCallback(e => {
    setIsModify(false);
    setIsCopy(true);

    setCopyDate(selectCategoryInfo.current.selectDate);
  }, []);

  return (
    <>
      {(goodsStatus.actionResult === 'MENU_ADD_REQ'
        || goodsStatus.actionResult === 'MENU_UPDATE_REQ'
        || goodsStatus.actionResult === 'MENU_REMOVE_REQ'
      ) && (
        <BackgroundLoading />
      )}
      <Wrap>
        <Header />
        <Body>
          <Tab tabIndex={0} />
          <Container isMobile={isMobile}>
            {goodsStatus.actionResult === 'CATEGORY_LIST_REQ'
              ? <HashLoader
                  css={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    margin: '0 auto',
                  }}
                  color={'#41a1ea'}
                  loading={true}
                  size={100}
                />
              : categoryList.length < 1 
                  ? <CenterAlignDiv>
                      <div>
                        <p>등록된 식당 카테고리 정보가 없습니다.</p>
                        <p>상품관리 > 카테고리 에서 카테고리 정보를 입력해 주세요.</p>
                        <br />
                        <br />
                        <AddButton outline onClick={() => handleCategoryAdd()}>등록하기</AddButton>
                      </div>
                    </CenterAlignDiv>
                  : <MenuListArea>
                      <DateSelectDiv isMobile={isMobile}>
                        <LeftArea>
                          <button className="btn-circle" onClick={handleSubDays}>
                            <LeftArrowIcon />
                          </button>
                          <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="yyyy-MM-dd"
                            customInput={<CustomInput />}
                          />
                          <button className="btn-circle" onClick={handleAddDays}>
                            <RightArrowIcon />
                          </button>
                        </LeftArea>
                        <RightArea>
                          {!isMobile &&
                            <ButtonGroup>
                              <ListTypeButton className={menuListType === 'DAY' && 'active'} value="DAY" onClick={handleChangeListType}>
                                일
                              </ListTypeButton>
                              <ListTypeButton className={menuListType === 'WEEK' && 'active'} value="WEEK" onClick={handleChangeListType}>
                                주
                              </ListTypeButton>
                            </ButtonGroup>
                          }
                        </RightArea>
                      </DateSelectDiv>
                      <MenuSelectDiv>
                        <TableHead isMobile={isMobile}>
                          <CategoryNmCol></CategoryNmCol>
                          <MenuCol className="no-padding" isMobile={isMobile} menuListType={menuListType}>
                            <span className="font-weight-bold">{dayjs(startDate).format('ddd')}</span>
                            <span className="font-size-sm">{dayjs(startDate).format('M/DD')}</span>
                          </MenuCol>

                          {menuListType === 'WEEK' && (
                            [1, 2, 3, 4].map((element, index) => {
                              return (
                                <MenuCol key={index} className="no-padding" isMobile={isMobile} menuListType={menuListType}>
                                  <span className="font-weight-bold">{dayjs(startDate).add(element, 'day').format('ddd')}</span>
                                  <span className="font-size-sm">{dayjs(startDate).add(element, 'day').format('M/DD')}</span>
                                </MenuCol>
                              )
                            })
                          )}
                        </TableHead>
                        {joinCategoryList.length > 0 && joinCategoryList.map(category => 
                          <TableBody key={category.categoryId} isMobile={isMobile}>
                            <TableRow>
                              <CategoryNmCol className="bgGray">
                                {category.categoryNm}
                              </CategoryNmCol>
                              <MenuCol className="bgGray" isMobile={isMobile} menuListType={menuListType}>
                                {category.operatingInfo.map(info =>
                                  // info.useYn === 'Y' &&
                                    <MenuRow key={info.categoryId} menuListType={menuListType}>
                                      <CategoryDiv menuListType={menuListType} disabled={info.useYn === 'N' ? true : false}>
                                        <div style={{ ...ellipsis('100%'), marginBottom: '0' }}>
                                          {info.categoryNm}
                                        </div>
                                        {info.useYn === 'Y' && 
                                          <PlusIcon onClick={() => openMenuModal(startDate, category, info)} />
                                        }
                                      </CategoryDiv>
                                      {menuList.filter(menu => menu.orderDt === dayjs(startDate).format('YYYY-MM-DD') && menu.categoryId === info.categoryId).map(menu =>
                                        <MenuDiv
                                          key={menu.goodsId}
                                          onClick={() => openMenuModal(startDate, category, info, menu)}
                                          menuListType={menuListType}
                                        >
                                          <div style={{ ...ellipsis('100%') }}>
                                            {menu.goodsNm}
                                          </div>
                                        </MenuDiv>
                                      )}
                                    </MenuRow>
                                )}
                              </MenuCol>

                              {menuListType === 'WEEK' && (
                                [1, 2, 3, 4].map((element, index) => {
                                  return (
                                    <MenuCol key={index} className="bgGray" isMobile={isMobile} menuListType={menuListType}>
                                      {category.operatingInfo.map(info =>
                                        // info.useYn === 'Y' &&
                                          <MenuRow key={info.categoryId} menuListType={menuListType}>
                                            <CategoryDiv menuListType={menuListType} disabled={info.useYn === 'N' ? true : false}>
                                              <div style={{ ...ellipsis('100%'), marginBottom: '0' }}>
                                                {info.categoryNm}
                                              </div>
                                              {info.useYn === 'Y' &&
                                                <PlusIcon onClick={() => openMenuModal(new Date(dayjs(startDate).add(element, 'day')), category, info)} />
                                              }
                                            </CategoryDiv>
                                            {menuList.filter(menu => menu.orderDt === dayjs(startDate).add(element, 'day').format('YYYY-MM-DD') && menu.categoryId === info.categoryId).map(menu =>
                                              <MenuDiv
                                                key={menu.goodsId}
                                                onClick={() => openMenuModal(new Date(dayjs(startDate).add(element, 'day')), category, info, menu)}
                                                menuListType={menuListType}
                                              >
                                                <div style={{ ...ellipsis('100%') }}>
                                                  {menu.goodsNm}
                                                </div>
                                              </MenuDiv>
                                            )}
                                          </MenuRow>
                                      )}
                                    </MenuCol>
                                  )
                                })
                              )}
                            </TableRow>
                          </TableBody>
                        )}
                      </MenuSelectDiv>
                    </MenuListArea>
            }
          </Container>
        </Body>
      </Wrap>

      <Modal 
        title={isModify ? "식단 수정" : "식단 등록"}
        size="large"
        confirmText={isModify ? "수정" : "저장"}
        cancelText="취소"
        onConfirm={isModify ? handleModify : handleSave}
        onCancel={handleCancel}
        onClose={handleCancel}
        onDelete={handleDelete}
        visible={modal}
        useDelete={isModify ? true : false}
        isMobile={isMobile}
      >
        <AddMenuWrap isMobile={isMobile}>
          <AddMenuHeader>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', columnGap: '10px' }}>
                <span>
                  {isCopy ? (
                    dayjs(copyDate).format('YYYY.MM.DD (ddd)')
                  ) : (
                    dayjs(selectCategoryInfo.current.selectDate).format('YYYY.MM.DD (ddd)')
                  )}
                </span>
                {isCopy && 
                  <DatePicker
                    selected={copyDate}
                    onChange={(date) => setCopyDate(date)}
                    popperPlacement={isMobile ? "bottom" : "right-start"}
                    customInput={<CustomButton />}
                  />
                }
              </div>
              {isCopy ? (
                <div style={{ display: 'flex', alignItems: 'center', columnGap: '10px' }}>
                  <StyledSelectInput
                    selectedValue={goods.mainCategoryId}
                    optionList={mainCategoryOptionList}
                    onSelectChange={value => {
                      handleChange('mainCategoryId', value);
                      handleChange('subCategoryId', subCategoryList.filter(subCategory => subCategory.categoryPid === value)[0]?.categoryId);
                    }}
                  />
                  <StyledSelectInput
                    selectedValue={goods.subCategoryId}
                    optionList={subCategoryOptionList}
                    onSelectChange={value => handleChange('subCategoryId', value)}
                  />
                </div>
              ) : (
                <span className="font-size-sm" style={{ color: '#555555' }}>
                  {selectCategoryInfo.current.mainCategory.categoryNm} {selectCategoryInfo.current.subCategory.categoryNm}
                </span>
              )}
            </div>
            {isModify && 
              <MenuCopyButton onClick={handleCopy}>
                <CopyIcon />
              </MenuCopyButton>
            }
          </AddMenuHeader>
          <MenuImg {...getRootProps({ isDragActive, isDragAccept, isDragReject })} isMobile={isMobile}>
            <input {...getInputProps()} />
            {goods.imagePath ? (
              <img
                src={goods.imagePath.startsWith("blob:") ? goods.imagePath : `${process.env.REACT_APP_STORE_CDN_URL}${goods.imagePath}`}
                alt=""
              />
            ) : (
              <p style={{ textAlign: 'center', lineHeight: '24px' }}>
                <UploadIcon />
                <br />
                이미지를 등록해주세요.
              </p>
            )}
          </MenuImg>
          <AddMenuBody>
            <MenuInputRow isMobile={isMobile}>
              <span className="title">메뉴명</span>
              <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                <StyledInput
                  width="100%"
                  height="2.5rem"
                  placeholder="메뉴명을 입력하세요."
                  onChange={e => handleChange('goodsNm', e.target.value)}
                  value={goods.goodsNm || ''}
                  maxLength="40"
                />
                <span className="font-size-sm" style={{ alignSelf: "flex-end", color: '#555555' }}>
                  {goods.goodsNm ? goods.goodsNm.length : 0} / 40자
                </span>
              </div>
            </MenuInputRow>
            <MenuInputRow isMobile={isMobile}>
              <span className="title">반찬</span>
              <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                <StyledTextarea
                  className="designed-scroll"
                  width="100%"
                  rows={isMobile ? '4' : '6'}
                  placeholder="반찬을 입력해주세요."
                  onChange={e => handleChange('goodsDetail', e.target.value)}
                  value={goods.goodsDetail || ''}
                  maxLength="100"
                />
                <span className="font-size-sm" style={{ alignSelf: "flex-end", color: '#555555' }}>
                  {goods.goodsDetail ? goods.goodsDetail.length : 0} / 100자
                </span>
              </div>
            </MenuInputRow>
            <MenuInputRow isMobile={isMobile}>
              <div style={{ display: 'flex', alignItems: 'center', minWidth: '60%' }}>
                <span className="title" style={{ width: '39%', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="orderMax"
                    style={{ width: '16px', height: '16px', margin: '0 8px 0 0' }}
                    onChange={e => handleChange('orderMax', goods.orderMax === 99999 ? 0 : 99999)}
                    checked={goods.orderMax === 99999 ? false : true}
                  />
                  <label htmlFor="orderMax" style={{ width: '57%' }}>재고수량</label>
                </span>
                <StyledInput
                  type="number"
                  min="0"
                  width="42%"
                  height="2.5rem"
                  onChange={e => handleChange('orderMax', e.target.value)}
                  value={goods.orderMax === 99999 ? '' : goods.orderMax}
                  disabled={goods.orderMax === 99999 ? true : false}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minWidth: '40%' }}>
                {isModify &&
                  <>
                    <span className="title" style={{ width: '47%', display: 'flex', alignItems: 'center', marginRight: '10px' }}>판매수량</span>
                    <StyledInput
                      type="number"
                      min="0"
                      max={goods.orderMax}
                      width="86%"
                      height="2.5rem"
                      // onChange={e => handleChange('orderCnt', e.target.value)}
                      value={goods.orderCnt}
                      disabled
                    />
                  </>
                }
              </div>
            </MenuInputRow>
            {isModify &&
              <MenuInputRow isMobile={isMobile}>
                <span className="title" style={{ wordBreak: 'keep-all' }}>품절 표시</span>
                <div style={{ width: "100%" }}>
                  <Toggle
                    width={48}
                    height={24}
                    isChecked={goods.soldOutYn === 'Y' ? true : false}
                    onClick={e => handleChange('soldOutYn', goods.soldOutYn === 'Y' ? 'N' : 'Y')}
                  />
                </div>
              </MenuInputRow>
            }
          </AddMenuBody>
        </AddMenuWrap>
      </Modal>
    </>
  )
};

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  background: #f4f5f6;

  .font-weight-bold {
    font-weight: bold;
  }

  .font-size-sm {
    font-size: 0.875rem;
  }

  .btn-circle {
    width: 30px;
    height: 30px;
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    padding: 0;
    border-radius: 50%;
  }

  .btn-circle:hover {
    background-color: #EEEEEE;
  }
`;

const Container = styled.div`
  min-height: 800px;
  padding: ${({ isMobile }) => isMobile ? '20px 0' : '26px'};
`;

const CenterAlignDiv = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  p {
    font-size: 1.125rem;
    line-height: 1.625rem;
  }
`;

const AddButton = styled(Button)`
  width: 151px;
  height: 54px;
`;

const MenuListArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const DateSelectDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ isMobile }) => isMobile ? '0 10px' : '0 20px'};

  svg {
    cursor: pointer;

    &:hover {
    }
  }
`;

const LeftArea = styled.div`
  display: flex;
  align-items: center;
  column-gap: 10px;
`;

const RightArea = styled.div`
  display: flex;
`;

const ListTypeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 5px;
  background: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    color: #2A91DF;
  }
`;

const StyledInput = styled.input`
  width: ${({ width }) => width};
  height: ${({ height }) => height ? height : '30px'};
  border: 1px solid #CBCBCB;
  border-radius: 5px;
  outline: none;
  padding: 1px 10px;
  font-family: 'NanumSquare' !important;
`;

const StyledTextarea = styled.textarea`
  width: ${({ width }) => width};
  border: 1px solid #CBCBCB;
  border-radius: 5px;
  outline: none;
  resize: none;
  padding: 10px 10px;
  font-family: 'NanumSquare' !important;
`;

const DateInput = styled.div`
  svg {
    position: absolute;
    top: 9px;
    left: 120px;
  }
`;

const ButtonGroup = styled.div`
  /* position: relative; */
  display: inline-flex;
  vertical-align: middle;
  column-gap: 5px;

  .active {
    color: #2A91DF;
    border: 1px solid #CCCCCC;
    border-radius: 5px;
    font-weight: 600;
  }

  /* & > button:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  & > button:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  } */
`;

const MenuSelectDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const TableHead = styled.div`
  height: 55px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  padding: ${({ isMobile }) => isMobile ? '10px 10px' : '10px 20px'};
`;

const TableBody = styled.div`
  display: flex;
  /* flex-direction: column; */
  /* justify-content: flex-start; */
  /* align-items: flex-start; */
  /* text-align: center; */
  padding: ${({ isMobile }) => isMobile ? '5px 10px' : '5px 20px'};

  .bgGray {
    background: #F6F8F9;
  }
`;

const TableRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
`;

const MenuRow = styled.div`
  width: ${({ menuListType }) => menuListType === 'WEEK' ? '85%' : '95%'};
  /* width: 95%; */
  display: flex;
  flex-direction: column;
  align-items: center;

  &:not(:first-child) {
    margin-top: 10px;
  }
`;

const CategoryDiv = styled.div`
  /* width: ${({ menuListType }) => menuListType === 'WEEK' ? '80%' : '90%'}; */
  width: 100%;
  height: 2.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme, disabled }) => disabled ? theme.gray100 : '#fff'};
  color: ${({ theme, disabled }) => disabled ? theme.gray500 : '#000'};
  border: 1px solid #EEEEEE;
  border-radius: 3px;
  padding: 10px 15px;
  font-weight: bold;

  svg {
    cursor: pointer;
  }
`;

const MenuDiv = styled.div`
  /* width: ${({ menuListType }) => menuListType === 'WEEK' ? '80%' : '90%'}; */
  width: 100%;
  height: 2.25rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #E6F5EC; // 임시
  border: 1px solid #EEEEEE;
  border-radius: 3px;
  padding: 10px 15px;
  cursor: pointer;
`;

const CategoryNmCol = styled.span`
  width: 12%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
  border-radius: 5px;
  font-weight: bold;
  word-break: break-all;
`;

const MenuCol = styled.span`
  width: ${({ isMobile, menuListType }) => isMobile ? '82%' : (menuListType === 'WEEK' ? '16%' : '85%')};
  min-width: 0%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 10px;
  border-radius: 5px;

  :not(.no-padding) {
    padding-top: 20px;
  }

  div:not(:last-child) {
    margin-bottom: 5px;
  }
`;

const AddMenuWrap = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: ${({ isMobile }) => isMobile ? '5px' : '20px'};

  .font-weight-bold {
    font-weight: bold;
  }

  .font-size-sm {
    font-size: 0.875rem;
  }
`;

const AddMenuHeader = styled.div`
  display: flex;
  /* flex-direction: column; */
  justify-content: space-between;
  line-height: 24px;

  svg {
    cursor: pointer;

    &.bg-blue {
      path {
        fill: #41A1EA;
      }
    }
  }
`;

const MenuCopyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 5px;
  border: solid 1px #CCCCCC;
  background: #ffffff;

  &:hover {
    svg {
      path {
        fill: #41a1ea;
      }
    }
  }
`;

const MenuImg = styled.div`
  width: 100%;
  height: ${({ isMobile }) => isMobile ? '11rem' : '12.5rem'};
  background: #F1F1F1;
  border-radius: 5px;
  color: #999999;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  cursor: pointer;

  svg {
    path {
      fill: #999999;
    }
  }

  & > img {
    display: block;
    width: 100%;
    height: 100%;
    background-color: white;
    object-fit: contain;
  }
`;

const AddMenuBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const MenuInputRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span.title {
    font-size: 1rem;
    width: 30%;
    padding: ${({ isMobile }) => isMobile ? '0.625rem 0' : '1.5625rem 0'};
  }
`;

const StyledSelectInput = styled(SelectInput)`
  width: 120px;
  height: 28px;
`;

const mapStateToProps = state => ({
  pathname: state.router.location.pathname,
  search: state.router.location.search,
  hash: state.router.location.hash,
});

export default connect(mapStateToProps, { push })(React.memo(MenuList));
