import React from "react";
import { Layout, Affix } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  CategoriesScreen,
  InventoryScreen,
  ManageStoreScreen,
  OrdersScreen,
  ReportScreen,
  SupplierScreen,
} from "../screens";
import { HeaderComponent, SiderComponent } from "../components";
import AddProduct from "../screens/inventories/AddProduct";
import HomeScreen from "../screens/HomeScreen";

const { Content } = Layout;

const MainRouter = () => {
  return (
    <BrowserRouter>
      <Layout>
        {/* Sider với position: fixed */}
        <Affix className="affix-sider" offsetTop={0}>
          <SiderComponent />
        </Affix>

        {/* Layout chính */}
        <Layout>
          <Affix offsetTop={0}>
            <HeaderComponent />
          </Affix>

          {/* Phần nội dung */}
          <Content className="main-content container-fluid mt-2 mb-2">
            <Routes>
              <Route path="/" element={<HomeScreen />}></Route>
              <Route path="/inventory" element={<InventoryScreen />}></Route>
              <Route
                path="/inventory/add-product"
                element={<AddProduct />}
              ></Route>
              <Route path="/report" element={<ReportScreen />}></Route>
              <Route path="/suppliers" element={<SupplierScreen />}></Route>
              <Route path="/categories" element={<CategoriesScreen />}></Route>
              <Route path="/orders" element={<OrdersScreen />}></Route>
              <Route
                path="/manage-store"
                element={<ManageStoreScreen />}
              ></Route>
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default MainRouter;
