
import { ConfigProvider } from 'antd';
import './App.css';

import Routers from './routers/Routers';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          
        },
        components: {

        }
      }}>

      <Routers />
    </ConfigProvider>
  );
};

export default App;
