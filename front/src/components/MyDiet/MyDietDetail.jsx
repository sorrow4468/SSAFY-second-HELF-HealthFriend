import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import {
  setFoodCheckBox,
  setmyDietWeight,
  setMyDietDetailImagePath,
  setDietDetailThumbnail,
  setFoodName,
  MY_DIET_DETAIL_REQUEST,
  MY_DIET_UPDATE_REQUEST,
  FOOD_LIST_REQUEST,
} from "../../store/modules/myDiet";
import { MY_DIET_IMAGE_REQUEST } from "../../store/modules/myDiet";
import { FormControlLabel, Checkbox } from "@mui/material";
import { Container, Row, Col } from "react-bootstrap";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TimePicker from "@mui/lab/TimePicker";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import {
  TotalStyle,
  RegisterReq,
  MealTypeButton,
  RegisterButton,
  Titles,
  Description,
  ImageThumbnail,
  FoodCheckButton,
  foodcheckBox,
  StyledFormGroup,
  UpdateCancelButton,
} from "./MyDietRegister.style";
import {
  MenuTitle,
  DetailReq,
  ButtonGroup,
  UpdateButton,
  BackButton,
  MealTimeDetail,
  FoodTableTitle,
  FoodListStyle,
} from "./MyDietDetail.style";
import { ButtonWrapper, ConfirmButton, CancelButton } from "./MyDiet.style";
import { FcCancel } from "react-icons/fc";
import { TailSpin } from "react-loader-spinner";
import { Camera } from "react-camera-pro";

export default function MyDietDetail() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { date, diaryNo } = useParams();
  useEffect(() => {
    dispatch({
      type: MY_DIET_DETAIL_REQUEST,
      data: diaryNo,
    });
    dispatch({ type: FOOD_LIST_REQUEST });
  }, [dispatch, diaryNo]);

  const { myDietDetail } = useSelector((state) => state.myDiet);
  const {
    foodName,
    foods,
    imageDetectionLoading,
    imageDetectionListEmpty,
  } = useSelector((state) => state.myDiet);
  const { dietDetailThumbnail } = useSelector((state) => state.myDiet);

  const [dietUpdate, setDietUpdate] = useState(false);
  const [description, setDescription] = useState(myDietDetail.description);
  const [diaryDate, setDiaryDate] = useState(myDietDetail.diaryDate);
  const [mealTime, setMealTime] = useState(myDietDetail.mealTime);
  const [thumbnail, setThumbnail] = useState(dietDetailThumbnail);

  useEffect(() => {
    setDescription(myDietDetail.description);
    setDiaryDate(dayjs(myDietDetail.diaryDate).format("YYYY-MM-DD HH:mm:ss"));
    setMealTime(myDietDetail.mealTime);
    if (myDietDetail.mealTime === "??????") setMealTimeIndex(0);
    else if (myDietDetail.mealTime === "??????") setMealTimeIndex(1);
    else if (myDietDetail.mealTime === "??????") setMealTimeIndex(2);
    else if (myDietDetail.mealTime === "??????") setMealTimeIndex(3);
  }, [myDietDetail]);

  useEffect(() => {
    setThumbnail(dietDetailThumbnail);
  }, [dietDetailThumbnail]);

  const myDietUpdate = {
    description: description,
    diaryDate: diaryDate,
    dietRegisterReqList: foodName,
    imagePath: myDietDetail.imagePath,
    mealTime: mealTime,
    diaryNo: myDietDetail.diaryNo,
    isShared: myDietDetail.isShared,
    saveImagePath: myDietDetail.imagePath,
  };

  const mealType = ["??????", "??????", "??????", "??????"];

  const onImageHandler = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setThumbnail(URL.createObjectURL(file));
      // dispatch(setDietDetailThumbnail(URL.createObjectURL(file)));
      dispatch(setMyDietDetailImagePath(file));
      dispatch({
        type: MY_DIET_IMAGE_REQUEST,
        data: { imagePath: file },
      });
      // dispatch(setDietDetailDietRegisterReqList(foodName));
    }
  };

  const [mealTimeIndex, setMealTimeIndex] = useState(4);
  const onMealTimeHandler = (e) => {
    setMealTimeIndex(e.target.getAttribute("data-index"));
    setMealTime(e.target.value);
  };

  const onDiaryDateHandler = (e) => {
    setDiaryDate(date + dayjs(e).format(" HH:mm:ss"));
  };

  const onDescriptionHandler = (e) => {
    setDescription(e.target.value);
  };

  const dietUpdateStateButton = () => {
    dispatch(setFoodName(myDietDetail.dietFindResList));
    setDietUpdate(true);
  };

  const dietUpdateButton = () => {
    if (myDietUpdate.diaryDate === "") alert("????????? ??????????????????.");
    else if (myDietUpdate.mealTime === "") alert("???????????? ??????????????????.");
    else if (myDietUpdate.description === "") alert("????????? ??????????????????.");
    else if (myDietUpdate.dietRegisterReqList.length === 0)
      alert("???????????? ??????????????? ??????????????? ?????? ????????? ??????????????????.");
    else {
      dispatch({
        type: MY_DIET_UPDATE_REQUEST,
        data: myDietUpdate,
      });
      setDietUpdate(false);
    }
  };

  const goBack = () => {
    history.push(`/dietdiary/${date}`);
  };

  const FoodList = myDietDetail.dietFindResList.map((food, index) => {
    return (
      <div key={index}>
        <FoodTableTitle>
          {food.foodName} {food.weight}g
        </FoodTableTitle>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: "bold" }}
                  style={{ width: "25%" }}
                  align="center"
                >
                  ?????????
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold" }}
                  style={{ width: "25%" }}
                  align="center"
                >
                  ????????????
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold" }}
                  style={{ width: "25%" }}
                  align="center"
                >
                  ?????????
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold" }}
                  style={{ width: "25%" }}
                  align="center"
                >
                  ??????
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ width: "25%" }} align="center">
                  {food.kcal &&
                    Math.round((food.weight / 100) * food.kcal * 100) / 100}
                </TableCell>
                <TableCell style={{ width: "25%" }} align="center">
                  {food.carbohydrate &&
                    Math.round((food.weight / 100) * food.carbohydrate * 100) /
                      100}
                </TableCell>
                <TableCell style={{ width: "25%" }} align="center">
                  {food.protein &&
                    Math.round((food.weight / 100) * food.protein * 100) / 100}
                </TableCell>
                <TableCell style={{ width: "25%" }} align="center">
                  {food.fat &&
                    Math.round((food.weight / 100) * food.fat * 100) / 100}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  });

  const { weights } = useSelector((state) => state.myDiet);
  const WeightSelect = weights.map((weight, index) => {
    return (
      <option key={index} value={weight}>
        {weight}g
      </option>
    );
  });

  const onWeightHandler = (e) => {
    const pair = {
      index: e.target.getAttribute("data-index"),
      weight: e.target.value,
    };
    dispatch(setmyDietWeight(pair));
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const [checkedInputs, setCheckedInputs] = useState([]);
  const changeHandler = (checked, id) => {
    if (checked) {
      setCheckedInputs([...checkedInputs, id]);
    } else {
      setCheckedInputs(checkedInputs.filter((el) => el !== id));
    }
  };

  useEffect(() => {
    setCheckedInputs([]);
    const temp = [];
    foodName.forEach((food) => {
      temp.push(food.foodName);
    });
    setCheckedInputs(temp);
  }, [foodName]);

  const FoodCheckBox = foods.map((food, index) => {
    return (
      <FormControlLabel
        key={index}
        control={
          <Checkbox
            id={food}
            onChange={(e) => {
              changeHandler(e.currentTarget.checked, food);
            }}
            checked={checkedInputs.includes(food) ? true : false}
          />
        }
        label={
          <p style={{ fontFamily: "KOTRA_GOTHIC", paddingTop: "15px" }}>
            {" "}
            {food}
          </p>
        }
      ></FormControlLabel>
    );
  });

  const foodCheckDone = () => {
    dispatch(setFoodCheckBox(checkedInputs));
    handleClose();
  };

  const dietNotUpdateButton = () => {
    setThumbnail(dietDetailThumbnail);
    setDietUpdate(false);
  };

  const camera = useRef(null);
  const [cameraState, setCameraState] = useState(false);
  const [numberOfCameras, setNumberOfCameras] = useState(0);

  const cameraTakePhoto = (e) => {
    const dataurl = camera.current.takePhoto();
    setCameraState(false);
    setThumbnail(dataurl);
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const file = new File([u8arr], "camera.jpg", { type: mime });
    dispatch(setMyDietDetailImagePath(file));
    dispatch({
      type: MY_DIET_IMAGE_REQUEST,
      data: { imagePath: file },
    });
  };

  return (
    <div>
      <Container>
        {dietUpdate ? (
          <MenuTitle>MY?????? ??????</MenuTitle>
        ) : (
          <MenuTitle>MY?????? ????????????</MenuTitle>
        )}
        <TotalStyle>
          <Row>
            <Col style={{ minWidth: "340px" }}>
              {cameraState ? (
                <>
                  <Camera
                    ref={camera}
                    aspectRatio={4 / 3}
                    numberOfCamerasCallback={setNumberOfCameras}
                  />
                  <button className="imageSelect" onClick={cameraTakePhoto}>
                    ??????
                  </button>
                  <button
                    className="imageSelect"
                    hidden={numberOfCameras <= 1}
                    onClick={() => {
                      camera.current.switchCamera();
                    }}
                  >
                    ??????
                  </button>
                  <button
                    className="imageSelect"
                    onClick={() => setCameraState(false)}
                  >
                    ??????
                  </button>
                </>
              ) : (
                <>
                  <ImageThumbnail src={thumbnail} alt="?????????"></ImageThumbnail>
                  {dietUpdate && (
                    <div>
                      <label className="imageSelect" htmlFor="input-file">
                        ????????? ??????
                      </label>
                      <input
                        onChange={onImageHandler}
                        type="file"
                        id="input-file"
                        style={{ display: "none" }}
                      ></input>
                      <button
                        className="imageSelect"
                        onClick={() => setCameraState(true)}
                      >
                        ????????? ??????
                      </button>
                    </div>
                  )}
                </>
              )}
            </Col>
            <Col>
              {dietUpdate ? (
                <RegisterReq>
                  <Titles>Food</Titles>
                  <FoodCheckButton onClick={handleOpen}>
                    ????????????
                  </FoodCheckButton>
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={foodcheckBox}>
                      <Typography
                        id="modal-modal-title"
                        variant="h4"
                        component="h2"
                        style={{ fontFamily: "KOTRA_BOLD-Bold" }}
                      >
                        ?????? ??????
                      </Typography>
                      <hr />
                      <Typography
                        id="modal-modal-description"
                        sx={{ mt: 2 }}
                        style={{ fontFamily: "KOTRA_BOLD-Bold" }}
                      >
                        ???????????? ?????? ????????? ??????????????????.
                      </Typography>
                      <StyledFormGroup
                        style={{
                          overflowX: "hidden",
                          overflowY: "auto",
                          flexWrap: "nowrap",
                        }}
                      >
                        {FoodCheckBox}
                      </StyledFormGroup>
                      <ButtonWrapper>
                        <ConfirmButton onClick={foodCheckDone}>
                          ??????
                        </ConfirmButton>
                        <CancelButton onClick={handleClose}>??????</CancelButton>
                      </ButtonWrapper>
                    </Box>
                  </Modal>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "grey",
                      fontFamily: 'KOTRA_GOTHIC',
                    }}
                  >
                    ????????? ????????? ??????????????????.
                  </div>
                  {imageDetectionLoading && (
                    <TailSpin color="#2E7D32" height={40} width={40}></TailSpin>
                  )}
                  {imageDetectionListEmpty && foodName.length === 0 && (
                    <div
                      style={{
                        fontSize: "13px",
                        color: "rgb(56 55 55)",
                        fontFamily: "KOTRA_GOTHIC",
                      }}
                    >
                      <FcCancel size="17"></FcCancel> ????????? ????????? ????????????.
                      ???????????? ??????????????? ??????????????? ?????? ????????? ??????????????????.
                    </div>
                  )}
                  <div>
                    {!imageDetectionLoading &&
                      foodName.map((food, index) => (
                        <div key={index}>
                          {food.foodName}{" "}
                          <select
                            data-index={index}
                            style={{
                              marginTop: "1%",
                              borderRadius: "4px",
                              outline: "0 none",
                              overBackgroundColor: "black",
                              cursor: "pointer",
                            }}
                            onChange={onWeightHandler}
                            value={food.weight}
                          >
                            {weights.map((weight, index) => {
                              return (
                                <option key={index} value={weight}>
                                  {weight}g
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      ))}
                  </div>
                  <Titles>Meal Type</Titles>
                  <MealTypeButton style={{ display: "flex" }}>
                    {mealType.map((meal, index) => (
                      <button
                        className={
                          parseInt(mealTimeIndex) === index ? "active" : ""
                        }
                        key={index}
                        value={meal}
                        data-index={index}
                        onClick={onMealTimeHandler}
                      >
                        {meal}
                      </button>
                    ))}
                  </MealTypeButton>
                  <Titles>Meal Time</Titles>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      label="????????? ??????????????????"
                      value={diaryDate}
                      onChange={(newValue) => {
                        onDiaryDateHandler(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <Titles>Description</Titles>
                  <Description
                    rows="7"
                    onChange={onDescriptionHandler}
                    value={description}
                  ></Description>
                </RegisterReq>
              ) : (
                <DetailReq>
                  <MealTimeDetail>{myDietDetail.mealTime}??????</MealTimeDetail>
                  <p>{myDietDetail.diaryDate.substr(0, 16)}</p>
                  <Titles>Food</Titles>
                  <FoodListStyle>
                    {myDietDetail.dietFindResList.length !== 0 && FoodList}
                  </FoodListStyle>
                  <Titles>Description</Titles>
                  <Description
                    rows="5"
                    readOnly
                    value={myDietDetail.description}
                  ></Description>
                </DetailReq>
              )}
            </Col>
          </Row>
        </TotalStyle>
        <ButtonGroup>
          {dietUpdate ? (
            <>
              <BackButton onClick={dietNotUpdateButton}>?????????</BackButton>
              <RegisterButton onClick={dietUpdateButton}>??????</RegisterButton>
            </>
          ) : (
            <>
              <BackButton onClick={goBack}>?????????</BackButton>
              <UpdateButton onClick={dietUpdateStateButton}>??????</UpdateButton>
            </>
          )}
        </ButtonGroup>
      </Container>
    </div>
  );
}
