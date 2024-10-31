import { Layout, Menu, MenuProps, Typography } from "antd";
import { PercentageCircle, ProfileCircle } from "iconsax-react";
import { LuHome } from "react-icons/lu";
import { Link } from "react-router-dom";
import { MdOutlineInventory2 } from "react-icons/md";
import { RiBarChartBoxLine } from "react-icons/ri";
import { BsInboxes } from "react-icons/bs";
import { CgList } from "react-icons/cg";
import { appInfos, colors } from "../configurations/configurations";
import { FaTags } from "react-icons/fa";

type MenuItem = Required<MenuProps>["items"][number];
const { Sider } = Layout;
const { Text } = Typography;

const SiderComponent = () => {
  const items: MenuItem[] = [
    {
      key: "dashboard",
      label: <Link to={"/"}>Dashboard</Link>,
      icon: <LuHome size={20} />,
    },
    {
      key: "inventory",
      label: 'Inventory',
      icon: <MdOutlineInventory2 size={20} />,
      children: [
        {
          key: "inventory",
          label: <Link to={"/inventory"}>All product</Link>,
        },
        {
          key: "add-new",
          label: <Link to={"/inventory/add-product"}>Add product</Link>,
        },
      ],
    },
    {
      key: "categories",
      label: <Link to={"/categories"}>Categories</Link>,
      icon: <FaTags  size={20} />,
    },
    {
      key: "report",
      label: <Link to={"/report"}>Report</Link>,
      icon: <RiBarChartBoxLine size={20} />,
    },
    {
      key: "suppliers",
      label: <Link to={"/suppliers"}>Suppliers</Link>,
      icon: <ProfileCircle size={20} />,
    },
    {
      key: "orders",
      label: <Link to={"/orders"}>Orders</Link>,
      icon: <BsInboxes size={20} />,
    },
    {
      key: "manage-store",
      label: <Link to={"/manage-store"}>Manage Store</Link>,
      icon: <CgList size={20} />,
    },
    {
      key: "promotions",
      label: <Link to={"/promotions"}>Promotions</Link>,
      icon: <PercentageCircle size={20} />,
    },
  ];

  return (
    <>
      <Sider
        className="sider-component"
        theme="light"
      >
        <div className=" p-3 d-flex">
          <img
            src={appInfos.logo}
            alt=""
            style={{
              width: "48px",
            }}
          />
          <Text
            className="mt-2"
            style={{
              fontWeight: "bold",
              fontSize: "1.5rem",
              color: colors.primary500,
              margin: 0,
            }}
          >
            {appInfos.title}
          </Text>
        </div>
        <Menu mode="inline" items={items} theme="light"></Menu>
      </Sider>
    </>
  );
};

export default SiderComponent;
