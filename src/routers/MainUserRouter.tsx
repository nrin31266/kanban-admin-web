import { Affix, Layout } from 'antd'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { HeaderComponent } from '../components'

const MainUserRouter = () => {
  return (
    <BrowserRouter>
      <Layout>
        {/* Layout chính */}
        <Layout>
          <Affix offsetTop={0}>
            <HeaderComponent />
          </Affix>

          {/* Phần nội dung */}
          
        </Layout>
      </Layout>
    </BrowserRouter>
  )
}

export default MainUserRouter