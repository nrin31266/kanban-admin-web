/** @format */

import { ConfigProvider, message } from 'antd';
import Routers from './routers/Routers';
import { Provider } from 'react-redux';
import store from './redux/store';
import './App.css';

message.config({
});

function App() {
	return (
		<>
			<ConfigProvider
				theme={{
					token: {
						colorPrimary: '#131118'
					},
					components: {
						
					},
					
				}}>
				<Provider store={store}>
					<Routers />
				</Provider>
			</ConfigProvider>
		</>
	);
}

export default App;