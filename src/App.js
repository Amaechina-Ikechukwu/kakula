import logo from "./logo.svg";
import "./App.css";
import Button from "@mui/material/Button";
import { shadows } from "@mui/system";
import ButtonGroup from "@mui/material/ButtonGroup";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { Container, Divider, Grid, Typography } from "@mui/material";
import { useReducer, useState } from "react";
import Digit from "./Digit";
import OpDigit from "./OpButton";
import { breakpoints } from "@mui/system";
import Permute from "./Permute";
import SingEve from "./Permute";
import {
  BrowserRouter,
  Routes,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";

function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#101010" : "#fff",
        color: (theme) =>
          theme.palette.mode === "dark" ? "grey.300" : "grey.800",
        border: "1px solid",
        borderColor: (theme) =>
          theme.palette.mode === "dark" ? "grey.800" : "grey.300",
        p: 1,
        borderRadius: 2,
        fontSize: "0.875rem",
        fontWeight: "700",
        ...sx,
      }}
      {...other}
    />
  );
}

Item.propTypes = {
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])
    ),
    PropTypes.func,
    PropTypes.object,
  ]),
};

export const ACTIONS = {
  ADD_DIGIT: "add_digit",
  CLEAR: "clear",
  CHOOSE_OP: "choose_op",
  DEL_DIGIT: "del_digit",
  EVALUATE: "evaluate",
  SINGEVAl: "singEval",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOp: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOp === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOp.includes(".")) {
        return state;
      } else {
        return {
          ...state,
          currentOp: `${state.currentOp || ""}${payload.digit}`,
        };
      }

    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.CHOOSE_OP:
      if (state.currentOp == null && state.previousOp == null) {
        return state;
      }
      if (state.currentOp == null && state.previousOp == null) {
        return {
          ...state,
          currentOp: state,
        };
      }

      if (state.previousOp == null) {
        return {
          ...state,
          Op: payload.operation,
          previousOp: state.currentOp,
          currentOp: null,
        };
      }
      if (state.currentOp == null) {
        return {
          ...state,
          Op: payload.operation,
        };
      }

      return {
        ...state,
        previousOp: evaluate(state),
        Op: payload.operation,
        currentOp: null,
      };
    case ACTIONS.EVALUATE:
      if (
        state.Op == null ||
        state.currentOp == null ||
        state.previousOp == null
      ) {
        return state;
      }

      return {
        ...state,
        Op: null,
        previousOp: null,
        overwrite: true,

        currentOp: evaluate(state),
      };
    case ACTIONS.SINGEVAl:
      return {
        ...state,
        currentOp: singEval(state.currentOp, payload.operation),
        overwrite: true,
        showOp: payload.display,
        showDig: state.currentOp,
      };

    case ACTIONS.DEL_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOp: null,
        };
      }
      if (state.currentOp == null) return state;
      if (state.currentOp.length === 1) {
        return { ...state, currentOp: null };
      }
      return {
        ...state,
        currentOp: state.currentOp.slice(0, -1),
      };
  }
}
function singEval(currentOp, Op) {
  console.log(currentOp);
  const current = parseFloat(currentOp);

  if (isNaN(current)) return "";
  let computation = "";
  switch (Op) {
    case "sqrt":
      computation = sqrt(current);
      break;
    case "f":
      computation = calcFact(current);
      break;
    case "sq":
      computation = current * current;
      break;
    case "sin()":
      computation = angles(current, Op);
      break;
    case "cos()":
      computation = angles(current, Op);
      break;
    case "tan()":
      computation = angles(current, Op);
      break;
  }
  return computation.toString();
}

function evaluate({ currentOp, previousOp, Op }) {
  const prev = parseFloat(previousOp);
  const current = parseFloat(currentOp);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (Op) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "/":
      computation = prev / current;
      break;
    case "p":
      if (prev >= current) {
        computation = calcFact(prev) / calcFact(prev - current);
      }
      if (prev < current) {
        computation = "Math Error";
      }
      break;
    case "e":
      computation = exponent(prev, current);
      break;

    case "c":
      if (prev >= current) {
        computation =
          calcFact(prev) / (calcFact(current) * calcFact(prev - current));
      }
      if (prev < current) {
        computation = "Math error";
      }
      break;
    case "sin":
      computation = prev * Math.sin(current);
      break;
    case "cos":
      computation = prev * Math.cos(current);
      break;
    case "tan":
      computation = prev * Math.tan(current);
      break;
  }

  return computation.toString();
}

var t = 0;
var numb = 1;
function exponent(num, time) {
  return Math.pow(num, time);
}
function sqrt(num) {
  return Math.sqrt(num);
}

function calcFact(num, curr) {
  var i;
  var fact = 1;
  for (i = 1; i <= num; i++) {
    fact = fact * i;
  }
  return fact;
}
function angles(current, op) {
  if (op == "sin()") {
    return Math.sin(current);
  }
  if (op == "cos()") {
    return Math.cos(current);
  }
  if (op == "tan()") {
    return Math.tan(current);
  }
}

function App() {
  const [{ currentOp, previousOp, Op, showOp, showDig }, dispatch] = useReducer(
    reducer,
    {}
  );
  const [scy, setScy] = useState(true);
  const [shift, setShift] = useState(false);

  return (
  
      <Container maxwidth="50px">
        <Grid
          display="flex"
          height="100vh"
          alignItems="center"
          justifyContent="center"
          sx={{
            backgroundColor: "3bdd4e7",
            backgroundImage: "linear-gradient(315deg,#bdd4e7 0%, #8693ab 74%)",
          }}
        >
          <Box bgcolor="white" borderRadius="10px" maxWidth="sm">
            {shift ? (
              <Box padding="5px">
                <Typography>
                  {showOp}({showDig})
                </Typography>
              </Box>
            ) : (
              <Box height={"20px"} width="100%"></Box>
            )}
            <Box
              height="50%"
              sx={{
                backgroundColor: "#201e1e",
                borderTopRadius: "10px",
              }}
              maxWidth="100%"
            >
              <Item
                p2
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  backgroundColor: "transparent",
                  border: "none",
                  color: "rgba(255,255,255, .65)",
                  fontSize: 20,
                  wordWrap: "break-word",
                  wordBreak: "break-all",
                  width: "90%",
                  borderTopRadius: "10px",
                }}
              >
                {previousOp}
                {Op}
              </Item>
              <Item
                p2
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  backgroundColor: "transparent",
                  border: "none",
                  color: "rgba(255,255,255, .75)",
                  fontSize: 30,
                  wordWrap: "break-word",
                  wordBreak: "break-all",
                  width: "90%",
                }}
              >
                {currentOp}
              </Item>
            </Box>

            <Divider
              sx={{ width: "100%", height: 3, backgroundColor: "#0752b5" }}
            />
            <Box display="flex" flexDirection="row-reverse">
              {scy ? (
                <Box
                  height="20%"
                  bgcolor="rgba(0,0,0, .75)"
                  sx={{
                    backgroundColor: "rgba(225,225,225, .15)",
                    borderTopRadius: "10px",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 1,
                    paddingTop: 5,
                    paddingRight: 5,
                  }}
                  maxWidth="sm"
                  display="grid"
                >
                  {!shift ? (
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                    >
                      <Typography
                        variant="h6"
                        fontSize={15}
                        color="rgba(0,0,0,0.5)"
                      >
                        sin()
                      </Typography>
                      <OpDigit
                        sx={{
                          border: 0,
                          backgroundColor: "transparent",
                          color: "white",
                          borderRight: 0,
                          fontSize: 20,
                          boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                          backgroundColor: "#2f45b5",
                        }}
                        operation="sin"
                        dispatch={dispatch}
                      />
                    </Box>
                  ) : (
                    <SingEve
                      sx={{
                        border: 0,
                        backgroundColor: "transparent",
                        color: "white",
                        borderRight: 0,
                        fontSize: 20,
                        boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                        backgroundColor: "#2f45b5",
                      }}
                      operation="sin()"
                      display="sin"
                      dispatch={dispatch}
                    />
                  )}
                  {!shift ? (
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                    >
                      <Typography
                        variant="h6"
                        fontSize={15}
                        color="rgba(0,0,0,0.5)"
                      >
                        cos()
                      </Typography>
                      <OpDigit
                        sx={{
                          border: 0,
                          backgroundColor: "transparent",
                          color: "white",
                          borderRight: 0,
                          fontSize: 20,
                          boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                          backgroundColor: "#2f45b5",
                        }}
                        operation="cos"
                        dispatch={dispatch}
                      />
                    </Box>
                  ) : (
                    <SingEve
                      sx={{
                        border: 0,
                        backgroundColor: "transparent",
                        color: "white",
                        borderRight: 0,
                        fontSize: 20,
                        boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                        backgroundColor: "#2f45b5",
                      }}
                      operation="cos()"
                      display="cos"
                      dispatch={dispatch}
                    />
                  )}
                  {!shift ? (
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                    >
                      <Typography
                        variant="h6"
                        fontSize={15}
                        color="rgba(0,0,0,0.5)"
                      >
                        tan()
                      </Typography>
                      <OpDigit
                        sx={{
                          border: 0,
                          backgroundColor: "transparent",
                          color: "white",
                          borderRight: 0,
                          fontSize: 20,
                          boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                          backgroundColor: "#2f45b5",
                        }}
                        operation="tan"
                        dispatch={dispatch}
                      />
                    </Box>
                  ) : (
                    <SingEve
                      sx={{
                        border: 0,
                        backgroundColor: "transparent",
                        color: "white",
                        borderRight: 0,
                        fontSize: 20,
                        boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                        backgroundColor: "#2f45b5",
                      }}
                      operation="tan()"
                      display="tan"
                      dispatch={dispatch}
                    />
                  )}
                  <SingEve
                    sx={{
                      border: 0,
                      backgroundColor: "transparent",
                      color: "white",
                      borderRight: 0,
                      fontSize: 20,
                      boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                      backgroundColor: "#2f45b5",
                    }}
                    operation="sq"
                    display="sq"
                    dispatch={dispatch}
                  />
                  <SingEve
                    sx={{
                      border: 0,
                      backgroundColor: "transparent",
                      color: "white",
                      borderRight: 0,
                      fontSize: 20,
                      boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                      backgroundColor: "#2f45b5",
                    }}
                    operation="sqrt"
                    display="sqrt"
                    dispatch={dispatch}
                  />

                  <SingEve
                    sx={{
                      border: 0,
                      backgroundColor: "transparent",
                      color: "white",
                      borderRight: 0,
                      fontSize: 20,
                      boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                      backgroundColor: "#2f45b5",
                    }}
                    operation="f"
                    display="f"
                    dispatch={dispatch}
                  />

                  <OpDigit
                    sx={{
                      border: 0,
                      backgroundColor: "transparent",
                      color: "black",
                      borderRight: 0,
                      fontSize: 20,
                      boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                    }}
                    operation="c"
                    display="c"
                    dispatch={dispatch}
                  />
                  <OpDigit
                    sx={{
                      border: 0,
                      backgroundColor: "transparent",
                      color: "black",
                      borderRight: 0,
                      fontSize: 20,
                      boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                    }}
                    operation="p"
                    display="p"
                    dispatch={dispatch}
                  />
                  <OpDigit
                    sx={{
                      border: 0,
                      backgroundColor: "transparent",
                      color: "black",
                      borderRight: 0,
                      fontSize: 20,
                      boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                    }}
                    operation="e"
                    dispatch={dispatch}
                  />
                </Box>
              ) : null}
              <Box
                variant="outlined"
                aria-label=" danger button group"
                sx={{
                  display: "grid",

                  padding: 5,
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 1,
                  border: 0,
                }}
                borderRadius="10px"
              >
                <Button
                  onClick={() => dispatch({ type: ACTIONS.CLEAR })}
                  sx={{
                    gridRow: "1",
                    gridColumn: "span 2",
                    border: 0,
                    backgroundColor: "#d11a1a",
                    color: "white",
                  }}
                >
                  AC
                </Button>
                <Button
                  onClick={() => dispatch({ type: ACTIONS.DEL_DIGIT })}
                  sx={{
                    gridRow: "1",
                    gridColumn: "span 1",
                    border: 0,
                    backgroundColor: "#e53030",
                    color: "white",
                  }}
                >
                  DEL
                </Button>
                <Button
                  onClick={() => setShift(!shift)}
                  sx={{
                    gridRow: "1",
                    gridColumn: "span 1",
                    border: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    color: "white",
                  }}
                >
                  SHIFT
                </Button>

                <OpDigit
                  sx={{
                    border: 0,
                    backgroundColor: "transparent",
                    color: "black",
                    borderRight: 0,
                    fontSize: 20,
                    boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                  }}
                  operation="/"
                  dispatch={dispatch}
                />
                <Digit
                  sx={{
                    border: 0,
                    backgroundColor: "transparent",
                    color: "black",
                    borderRight: 0,
                    fontSize: 20,
                    boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                  }}
                  digit={"1"}
                  dispatch={dispatch}
                />
                <Digit
                  sx={{
                    border: 0,
                    backgroundColor: "transparent",
                    color: "black",
                    borderRight: 0,
                    fontSize: 20,
                    boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                  }}
                  digit="2"
                  dispatch={dispatch}
                />
                <Digit
                  sx={{
                    border: 0,
                    backgroundColor: "transparent",
                    color: "black",
                    borderRight: 0,
                    fontSize: 20,
                    boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                  }}
                  digit="3"
                  dispatch={dispatch}
                />
                <OpDigit
                  sx={{
                    border: 0,
                    backgroundColor: "transparent",
                    color: "black",
                    borderRight: 0,
                    fontSize: 20,
                    boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                  }}
                  operation="*"
                  dispatch={dispatch}
                />
                <Digit
                  sx={{
                    border: 0,
                    backgroundColor: "transparent",
                    color: "black",
                    borderRight: 0,
                    fontSize: 20,
                    boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                  }}
                  digit="4"
                  dispatch={dispatch}
                />
                <Digit
                  sx={{
                    border: 0,
                    backgroundColor: "transparent",
                    color: "black",
                    borderRight: 0,
                    fontSize: 20,
                    boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                  }}
                  digit="5"
                  dispatch={dispatch}
                />
                <Digit
                  sx={{
                    border: 0,
                    backgroundColor: "transparent",
                    color: "black",
                    borderRight: 0,
                    fontSize: 20,
                    boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                  }}
                  digit="6"
                  dispatch={dispatch}
                />
                <OpDigit
                  sx={{
                    border: 0,
                    backgroundColor: "transparent",
                    color: "black",
                    borderRight: 0,
                    fontSize: 20,
                    boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                  }}
                  operation="+"
                  dispatch={dispatch}
                />
                <Digit
                  sx={{
                    border: 0,
                    backgroundColor: "transparent",
                    color: "black",
                    borderRight: 0,
                    fontSize: 20,
                    boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                  }}
                  digit="7"
                  dispatch={dispatch}
                />
                <Digit
                  sx={{
                    border: 0,
                    backgroundColor: "transparent",
                    color: "black",
                    borderRight: 0,
                    fontSize: 20,
                    boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                  }}
                  digit="8"
                  dispatch={dispatch}
                />
                <Digit
                  sx={{
                    border: 0,
                    backgroundColor: "transparent",
                    color: "black",
                    borderRight: 0,
                    fontSize: 20,
                    boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                  }}
                  digit="9"
                  dispatch={dispatch}
                />
                <OpDigit
                  sx={{
                    border: 0,
                    backgroundColor: "transparent",
                    color: "black",
                    borderRight: 0,
                    fontSize: 20,
                    boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                  }}
                  operation="-"
                  dispatch={dispatch}
                />
                <Digit
                  sx={{
                    border: 0,
                    backgroundColor: "transparent",
                    color: "black",
                    borderRight: 0,
                    fontSize: 20,
                    boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                  }}
                  digit="."
                  dispatch={dispatch}
                />
                <Digit
                  sx={{
                    border: 0,
                    backgroundColor: "transparent",
                    color: "black",
                    borderRight: 0,
                    fontSize: 20,
                    boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                  }}
                  digit="0"
                  dispatch={dispatch}
                />

                <Button
                  onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
                  sx={{
                    gridColumn: "span 1",
                    border: 0,
                    backgroundColor: "#172bbd",
                    color: "white",
                    hover: "backgroundColor: blue",
                  }}
                >
                  =
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{
                    border: 0,
                    boxShadow: "rgba(100,100,111,0.4) 0px 7px 29px 0px",
                  }}
                  onClick={() => setScy(!scy)}
                >
                  Show {scy ? "Less" : "More"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Container>
    
  );
}

export default App;
