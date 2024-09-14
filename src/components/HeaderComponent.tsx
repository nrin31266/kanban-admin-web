import { Avatar, Button, Input, Space } from "antd";
import { MdOutlineManageSearch } from "react-icons/md";
import { TbMessageExclamation } from "react-icons/tb";
import { colors } from "../configurations/configurations";

function HeaderComponent() {
  return (
    <div className="p-2 ml-1 mr-1 row bg-white" style={{}}>
      <div className="col">
        <Input
          placeholder="Search product, supplier, order"
          style={{
            borderRadius: 90,
            width: "100%",
          }}
          size="large"
          prefix={<MdOutlineManageSearch className="text-muted" size={20} />}
        />
      </div>
      <div className="col text-right">
        <Space>
          <Button
            icon={
              <TbMessageExclamation
                size={22}
                color={colors.grey600}
                style={{}}
              />
            }
            type="text"
          />
          <Avatar
            src={
              "https://th.bing.com/th/id/OIP.OMUWV51vu3Q-fXdwcAlw1AHaHa?rs=1&pid=ImgDetMain"
            }
            size={40}
          />
        </Space>
      </div>
    </div>
  );
}

export default HeaderComponent;
