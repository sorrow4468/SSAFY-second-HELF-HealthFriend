import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import { IMAGE_URL } from '../../utils/https';
import {
  MY_DIET_DIARY_DAILY_INFO_REQUEST,
  MY_DIET_DIARY_DELETE_REQUEST,
} from '../../store/modules/myDiet';
import { 
  SHARE_BOARD_REGISTER_REQUEST,
  SHARE_BOARD_DELETE_REQUEST,
} from '../../store/modules/shareBoard';
import {
  DietDiaryItemWrapper,
  addButton,
  ShareButton,
  DietDiaryItem,
  TotalKcal,
  shareBox,
  DescriptionArea,
  ButtonWrapper,
  ConfirmButton,
  CancelButton,
  Bold,
  DiaryItemWrapper,
  DiaryItemLeftWrapper,
  DiaryItemRightWrapper,
  DiaryImg,
  DiaryTitle,
  DiaryTime,
  DiaryKcal,
  DiaryDesc,
  fontNormal,
  MenuTitle,
  SharedButton,
  modalTitle,
} from './MyDiet.style';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSelect } from '@mui/base';


function convertMonth(month) {
  switch(month) {
    case '01': 
      return 'Jan';
    case '02': 
      return 'Feb';
    case '03': 
      return 'Mar';
    case '04': 
      return 'Apr';
    case '05':
      return 'May';
    case '06': 
      return 'Jun';
    case '07':
      return 'Jul';
    case '08':
      return 'Aug';
    case '09': 
      return 'Sep';
    case '10':
      return 'Oct';
    case '11': 
      return 'Nov';
    case '12':
      return 'Dec';
  }
}

export default function MyDietDaily() {
  const dispatch = useDispatch();
  const date = useParams().date;
  const { myDietDiaryDailyInfo, myDietDiaryDeleteDone } = useSelector(
    (state) => state.myDiet
  );
  const { me } = useSelector(state => state.mypage);
  const { shareBoardDeleteDone } = useSelector(state => state.shareBoard);

  const [open, setOpen] = useState(false);
  const [shareDiaryNo, setShareDiaryNo] = useState('');
  const [shareDescription, setShareDescription] = useState('');

  const handleOpen = (info) => {
    setShareDiaryNo(info.diaryNo);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleCancelShare = (info) => {
    if(window.confirm('?????? ????????? ?????????????????????????')) {
      dispatch({
        type: SHARE_BOARD_DELETE_REQUEST,
        data: {
          diaryNo: info.diaryNo,
        }
      });
      // history.push(`/sharedBoard`);
    } else {
      alert('?????????????????????.');
    }
  }

  const handleConfirmKeyPress = (event) => {
    if(event.key === 'Enter') {
      handleShareDietDiary();
    }
  }

  var dailyDate = convertMonth(date.substring(5,7)) + ' ' + date.substring(8,10) + ', ' + date.substring(0,4);

  const kcalList = [];
  const diaryInfoList = [];
  for (let i = 0; i < myDietDiaryDailyInfo.length; i++) {
    var kcals = 0;
    var hour = myDietDiaryDailyInfo[i].diaryDate.substring(11, 13);
    var minute = myDietDiaryDailyInfo[i].diaryDate.substring(14, 16);
    const diaryDate = myDietDiaryDailyInfo[i].diaryDate.substring(0, 10);

    var AmPm = hour >= 12 ? 'pm' : 'am';
    hour = (hour % 12) || 12;

    const diaryTime = hour + ':' + minute + ' ' + AmPm;
    const foodList = [...myDietDiaryDailyInfo[i].dietFindResList];
    for (let j = 0; j < foodList.length; j++) {
      kcals += (foodList[j].kcal * (foodList[j].weight/100)) ;
    }

    diaryInfoList.push({
      diaryNo: myDietDiaryDailyInfo[i].diaryNo,
      mealTime: myDietDiaryDailyInfo[i].mealTime,
      diaryDate: diaryDate,
      diaryTime: diaryTime,
      kcal: kcals,
      printKcal: kcals.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      description: myDietDiaryDailyInfo[i].description,
      imagePath: myDietDiaryDailyInfo[i].imagePath,
      imageFullPath: `${IMAGE_URL}${myDietDiaryDailyInfo[i].imagePath}`,
      isShared: myDietDiaryDailyInfo[i].isShared,
    });

    kcalList.push(kcals); // ??? ?????? ??????
  }

  var totalKcal = 0;
  if (kcalList.length > 0) {
    totalKcal = kcalList.reduce((total, currentValue) => {
      return total + currentValue;
    });
    totalKcal = totalKcal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const now = new Date();   // ?????? ?????? ??? ??????
  const year = now.getFullYear(); // ??????
  const month = now.getMonth();   // ???
  const day = now.getDate();      // ???
  const userYear = me.birthday.substring(0, 4);
  const userMonth = me.birthday.substring(5, 7);
  const userDay = me.birthday.substring(9, 10);

  // ?????? ??? ?????? ?????????
  var age = 0;
  if(month < userMonth) {
    age = year - userYear - 1;
  } else if(month == userYear) {
    if(day < userDay) {
      age = year - userYear - 1;
    }
  }

  // ?????? ??????????????? ????????? (Mifflin-St Jeor Equation)
  var bmr = 0;
  if(!me.gender) { // ????????? ??????
      bmr = (me.weight * 10 + me.height * 6.25 - 5 * age + 5);
  } else {         // ????????? ??????
      bmr = (me.weight * 10 + me.height * 6.25 - 5 * age - 161);
  }

  // ?????? ?????? ?????????
  // 1. ????????? ?????? ?????? 1.2
  // 2. ????????? ????????? ?????? ?????? 1.35 (v)
  // 3. ?????? ????????? ???????????? ?????? ???????????? ?????? ?????? ?????? 1.5
  bmr = Math.round(bmr * 1.35);
  var suggestTotalKcal = bmr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const history = useHistory();
  const goBack = () => {
    history.push('/mydiet');
  };

  const clickAddBtn = () => {
    // ?????? ?????? ?????? date ????????????
    history.push(`/mydietregister/${date}`);
  };

  const handleShareDietDiary = () => {
    dispatch({
      type: SHARE_BOARD_REGISTER_REQUEST,
      data: {
        diaryNo: shareDiaryNo,
        shareDescription: shareDescription,
        hit: 0,
        createdAt: '',
      },
    });
    setOpen(false); // ?????? ??? ??????
    history.push(`/sharedboard`);
    // ??????????????? ?????? ???????????? diaryNo ????????????
  };

  const clickDeleteBtn = (info) => {
    if(window.confirm('?????? ?????????????????????????')) {
      dispatch({
        type: MY_DIET_DIARY_DELETE_REQUEST,
        data: { date: info },
      });
      alert('?????????????????????');
    } else {
      alert('?????????????????????.');
    }
  };

  const clickDietDiaryItem = (diaryNo) => {
    history.push(`/mydietdetail/${date}/${diaryNo}`);
  };

  useEffect(() => {
    dispatch({
      type: MY_DIET_DIARY_DAILY_INFO_REQUEST,
      data: { date: date },
    });
  }, [ myDietDiaryDeleteDone, shareBoardDeleteDone ]); // ?????? event??? ???????????? ?????? ?????? ?????? ?????? ????????? ????????????

  return (
    <DietDiaryItemWrapper>
      <MenuTitle>{dailyDate} ??????</MenuTitle>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} style={{ textAlign: 'left' }}>
          <ArrowBackIosOutlinedIcon
            style={{ cursor: 'pointer' }}
            onClick={() => {
              goBack();
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} style={{ textAlign: 'right' }}>
          <Fab style={ addButton } aria-label="add" onClick={clickAddBtn} >
            <AddIcon />
          </Fab>
        </Grid>
      </Grid>
      <div>
        {diaryInfoList.map((info) => (
          <DietDiaryItem key={info.diaryNo}>
            <Box
              sx={{
                marginTop: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={5} style={{ textAlign: 'left' }}>
                  <DiaryImg
                    src={info.imageFullPath}
                    alt='?????? ?????????'
                    onClick={() => clickDietDiaryItem(info.diaryNo)}
                  ></DiaryImg>
                </Grid>
                <Grid item xs={12} sm={7}>
                  <DiaryItemWrapper>
                    <DiaryItemLeftWrapper>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <DiaryTitle style={{ marginTop: '10px' }}>{info.mealTime}</DiaryTitle>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ textAlign: 'right', marginTop: '0' }}>
                        <IconButton 
                          aria-label='delete' 
                          size='large'
                          fontSize='inherit'
                          onClick={() => clickDeleteBtn(info)}
                          >
                          <DeleteIcon/>
                        </IconButton>
                        </Grid>
                      </Grid> 
                      <DiaryTime style={fontNormal}>{info.diaryTime}</DiaryTime>
                      <DiaryKcal style={fontNormal}>{info.printKcal} kcal</DiaryKcal>
                      <DiaryDesc style={fontNormal}>{info.description}</DiaryDesc>
                  </DiaryItemLeftWrapper>
                  <DiaryItemRightWrapper>
                    { info.isShared ? 
                      (
                        <SharedButton onClick={() => handleCancelShare(info)}>Shared</SharedButton>
                      ) : (
                      <ShareButton onClick={() => handleOpen(info)}>
                        Share
                      </ShareButton>
                      )
                    }
                    <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby='modal-modal-title'
                      aria-describedby='modal-modal-description'
                    >
                      <Box sx={shareBox} onKeyPress={ handleConfirmKeyPress }>
                        <Typography 
                          id='modal-modal-title' 
                          component='h2'
                          style={ modalTitle }>
                          ?????? ??????
                        </Typography>
                        <hr />
                        <Typography 
                          id='modal-modal-description' 
                          sx={{ mt: 2 }}
                          style={fontNormal}>
                          ?????? ????????? ?????? ?????? ????????? ???????????????.
                        </Typography>
                        <DescriptionArea
                          maxRows={4}
                          aria-label='maximum height'
                          placeholder='this is description...'
                          onChange={(event) => {
                            setShareDescription(event.target.value);
                          }}
                        />
                        <ButtonWrapper>
                          <CancelButton onClick={ handleClose }>??????</CancelButton>
                          <ConfirmButton
                            onClick={ handleShareDietDiary }
                          >
                            ??????
                          </ConfirmButton>
                        </ButtonWrapper>
                      </Box>
                    </Modal>
                    
                    </DiaryItemRightWrapper>
                  </DiaryItemWrapper>
                </Grid>
              </Grid>
            </Box> 

          </DietDiaryItem>
        ))}
      </div>
      <TotalKcal>Total Kcal : {totalKcal} kcal</TotalKcal>
      <div>({me.userName}?????? ?????? ?????? ?????? ???????????? <Bold>{suggestTotalKcal} Kcal</Bold> ?????????.)</div>
    </DietDiaryItemWrapper>
  );
}
