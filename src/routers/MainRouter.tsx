import React from 'react'
import HomeScreen from '../screens/HomeScreen'
import { Layout } from 'antd'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { InventoryScreen, ManageStoreScreen, OrdersScreen, ReportScreen, SuppliersScreen } from '../screens';
import { HeaderComponent, SiderComponent } from '../components';
const {Content, Footer, Header, Sider} = Layout;

const MainRouter = () => {
  return (
    <BrowserRouter>
    <Layout>
      <SiderComponent />
      <Layout>
        <HeaderComponent />
        <Content>
          <Routes>
            <Route path='/' element={<HomeScreen />}></Route>
            <Route path='/inventory' element={<InventoryScreen />}></Route>
            <Route path='/report' element={<ReportScreen />}></Route>
            <Route path='/suppliers' element={<SuppliersScreen />}></Route>
            <Route path='/orders' element={<OrdersScreen />}></Route>
            <Route path='/manage-store' element={<ManageStoreScreen />}></Route>
          </Routes>
        </Content>
        <Footer />
      </Layout>
    </Layout>
    </BrowserRouter>
  )
}

export default MainRouter