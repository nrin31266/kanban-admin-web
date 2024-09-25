import { Button, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAuth, getRefreshToken, verifyToken } from "../apis/axiosClient";
import handleAPI from "../apis/handleAPI";
import { API, colors } from "../configurations/configurations";
import { refreshToken, removeAuth } from "../redux/reducers/authReducer";
import { demoData } from "../data/demoData";
import { replaceName } from "../utils/replaceName";
import { useNavigate } from "react-router-dom";
import { Resizable } from "re-resizable";
import { StatisticComponent } from "../components";
import { StatisticModel } from "../models/StatisticModel";
import { LiaCoinsSolid } from "react-icons/lia";



const HomeScreen = () => {

  const salesData: StatisticModel[] = [
    {
      key: 'sales',
      description: 'Sales',
      color: `${colors.primary500}33`,
      icon:<LiaCoinsSolid size={30} color={`${colors.primary500}`} />,
      value: Math.floor(Math.random()*10000000000000),
      valueType: 'currency',
      type: 'horizontal'
    },
    {
      key: 'revenue',
      description: 'Revenue',
      color: `${colors.primary500}33`,
      icon: <LiaCoinsSolid size={30} color={colors.primary500}/>,
      value: Math.floor(Math.random()*10000000000000),
      valueType: 'number',
      type: 'horizontal'
    },
    {
      key: 'profit',
      description: 'Profit',
      color: `${colors.primary500}33`,
      icon: <LiaCoinsSolid size={30} color={colors.primary500}/>,
      value: Math.floor(Math.random()*10000000000000),
      valueType: 'currency',
      type: 'horizontal'
    },
    {
      key: 'cost',
      description: 'Cost',
      color: `${colors.primary500}33`,
      icon: <LiaCoinsSolid size={30} color={colors.primary500}/>,
      value: Math.floor(Math.random()*10000000000000),
      valueType: 'number',
      type: 'horizontal'
    },
  ]

  const inventoryData:StatisticModel[] =[
    {
      key: 'profit',
      description: 'Profit',
      color: `${colors.primary500}33`,
      icon: <LiaCoinsSolid size={30} color={colors.primary500}/>,
      value: Math.floor(Math.random()*10000000000000),
      valueType: 'currency',
      type: 'vertical'
    },
    {
      key: 'cost',
      description: 'Cost',
      color: `${colors.primary500}33`,
      icon: <LiaCoinsSolid size={30} color={colors.primary500}/>,
      value: Math.floor(Math.random()*1000000000000000000),
      valueType: 'number',
      type: 'vertical'
    },
  ]

  return (
    <div>
      <div className="row">
        <div className="col col-md-8" style={{
        }}>
          <StatisticComponent title="Sales Overview" data={salesData}/>
          <StatisticComponent title="Sales Overview" data={salesData}/>
          <StatisticComponent title="Sales Overview" data={salesData}/>
          <StatisticComponent title="Sales Overview" data={salesData}/>
        </div>
        <div className="col col-md-4">
          <StatisticComponent title="Inventory Summary" data={inventoryData}/>
          <StatisticComponent title="Inventory Summary" data={inventoryData}/>
          <StatisticComponent title="Inventory Summary" data={inventoryData}/>
          <StatisticComponent title="Inventory Summary" data={inventoryData}/>

        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
