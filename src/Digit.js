import { ACTIONS } from "./App";
import Button from "@mui/material/Button";

export default function Digit({ dispatch, digit, sx }) {
  return (
    <Button
      sx={sx}
      onClick={() => {
        dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } });
      }}
    >
      {digit}
    </Button>
  );
}
