import HomeScreen from "../screens/HomeScreen";
import { Affix, Layout } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  InventoryScreen,
  ManageStoreScreen,
  OrdersScreen,
  ReportScreen,
  SupplierScreen,
} from "../screens";
import { HeaderComponent, SiderComponent } from "../components";
const { Content, Footer, Header, Sider } = Layout;

const MainRouter = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Affix offsetTop={0}>
          <SiderComponent />
        </Affix>
        <Layout>
          <Affix offsetTop={0}>
            <HeaderComponent />
          </Affix>
          <Content
            className="container mt-2 mb-2 bg-white"
            style={{
              width: "96%",
            }}
          >
            <Routes>
              <Route path="/" element={<HomeScreen />}></Route>
              <Route path="/inventory" element={<InventoryScreen />}></Route>
              <Route path="/report" element={<ReportScreen />}></Route>
              <Route path="/suppliers" element={<SupplierScreen />}></Route>
              <Route path="/orders" element={<OrdersScreen />}></Route>
              <Route
                path="/manage-store"
                element={<ManageStoreScreen />}
              ></Route>
            </Routes>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default MainRouter;
