import { Card, Space, Typography } from "antd";
import React, { ReactNode } from "react";
import { colors } from "../configurations/configurations";
import { StatisticModel } from "../models/StatisticModel";
import { FormatCurrency } from "../utils/formatNumber";

interface Props {
  children?: ReactNode;
  title: string;
  data: StatisticModel[];
}

const { Title, Text } = Typography;

const renderDescriptionData = (item: StatisticModel) => (
  <>
    <Title
      className="m-0"
      level={5}
      style={{ color: colors.grey800, fontWeight: 500 }}
    >
      {item.valueType === "number"
        ? item.value.toLocaleString()
        : FormatCurrency.VND.format(item.value)}
    </Title>
    <Text style={{ fontSize: "14px", fontWeight: 500 }} type="secondary">
      {item.description}
    </Text>
  </>
);

const StatisticComponent = (props: Props) => {
  const { children, title, data } = props;

  return (
    <div>
      <Card className="mt-2 mb-2)" style={{marginLeft: '-10px', marginRight: '-10px'}}>
        <Title
          style={{ color: colors.grey600, fontWeight: "500", fontSize: "18px" }}
        >
          {title}
        </Title>
        <div className="row" style={{margin: '0 -9px 0 -5px'}}>
          {data.map((item, _index) => (
            <div
              className="col p-1"
              key={item.key}
              style={{
                marginRight: '4px',
                boxSizing: 'border-box',
                minWidth: '175px',
                background: '#F1F1F9',
                marginTop: '4px',
                borderRadius: 8
              }}
            >
              <div className="row mb-3 mt-2" style={{ justifyContent: "center" }}>
                <div
                  className="text-center item-wrapping"
                  style={{
                    backgroundColor: `${item.color}`,
                  }}
                >
                  {item.icon}
                </div>
              </div>
              {item.type && item.type === "horizontal" ? (
                <Space
                  className="mb-2"
                  style={{
                    justifyContent: "space-between",
                    display: "flex",
                  }}
                >
                  {renderDescriptionData(item)}
                </Space>
              ) : (
                <div className="text-center">{renderDescriptionData(item)}</div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default StatisticComponent;
