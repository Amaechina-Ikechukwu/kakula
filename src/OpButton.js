import { ACTIONS } from "./App";
import Button from "@mui/material/Button";

export default function OpDigit({ dispatch, operation, sx }) {
  return (
    <Button
      sx={sx}
      onClick={() => {
        dispatch({ type: ACTIONS.CHOOSE_OP, payload: { operation } });
      }}
    >
      {operation}
    </Button>
  );
}
