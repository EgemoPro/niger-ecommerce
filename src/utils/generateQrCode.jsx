import React from "react";
import QRCode from "react-qr-code";
import { saveAs } from "file-saver";

const generateQRCode = ({ data }) => {

  return(<QRCode
    size={256}
    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
    fgColor={"blue"}
    bgColor={"white"}
    value={`${data}`}
    viewBox={`0 0 256 256`}
  />)
};

export default generateQRCode;