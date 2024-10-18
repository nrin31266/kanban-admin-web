import { Button } from "antd";
import React from "react";
import { additionalDemoData, demoData } from "../../data/demoData";
import handleAPI from "../../apis/handleAPI";
import { API } from "../../configurations/configurations";

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
  

  return (
    <>
      <Button onClick={handleFakeData}>Fake data</Button>
    </>
  );
};

export default ReportScreen;
