import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { subscribeGetSetResultLoading } from "../services/learnerAi/getSetResultLoading";

const GetSetResultLoadingOverlay = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => subscribeGetSetResultLoading(setOpen), []);

  return (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 20,
        color: "#fff",
        backgroundColor: "rgba(0, 0, 0, 0.45)",
      }}
      open={open}
    >
      <CircularProgress color="inherit" size={48} />
    </Backdrop>
  );
};

export default GetSetResultLoadingOverlay;
