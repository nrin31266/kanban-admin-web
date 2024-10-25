import { Button } from "antd";
import React from "react";
import { additionalDemoData, demoData, demoData1 } from "../data/demoData";
import handleAPI from "../apis/handleAPI";
import { API } from "../configurations/configurations";

const ReportScreen = () => {
  const handleFakeData = async () => {
    try {
      await Promise.all(
        additionalDemoData.map((values) => handleAPI(API.PRODUCTS, values, "post"))
      );
      console.log('ok');
    } catch (error) {
      console.log(error);
    }
  };
  const handleFakeData1 = async () => {
    try {
      await Promise.all(
        demoData1.map((values) => handleAPI(`${API.SUPPLIER}/create`, values, "post"))
      );
      console.log('ok');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button onClick={handleFakeData}>Fake data</Button>
      <Button onClick={handleFakeData1}>Fake data suppliers</Button>
    </>
  );
};

export default ReportScreen;
