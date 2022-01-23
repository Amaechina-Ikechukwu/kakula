import { ACTIONS } from "./App";
import Button from "@mui/material/Button";

export default function SingEve({ dispatch, operation, sx, display }) {
  return (
    <Button
      sx={sx}
      onClick={() => {
        dispatch({ type: ACTIONS.SINGEVAl, payload: { operation } });
      }}
    >
      {display !== null ? display : operation}
    </Button>
  );
}
