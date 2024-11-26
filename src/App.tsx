/** @format */

import { ConfigProvider, message } from 'antd';
import Routers from './routers/Routers';
import { Provider } from 'react-redux';
import store from './redux/store';
import './App.css';
import { colors } from './constants/listColors';

message.config({
});

function App() {
	return (
		<>
			<ConfigProvider
				theme={{
					token: {
						colorPrimary: colors[2]
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