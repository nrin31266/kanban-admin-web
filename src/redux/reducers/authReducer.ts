import { createSlice } from "@reduxjs/toolkit";
import { localDataNames } from "../../constants/appInfos";

export interface AuthState {
    token: string;
}

const initialState : AuthState = {
    token: '',
};

const authSlide = createSlice({
    name: 'auth',
    initialState: {
        data: initialState 
    },
    reducers: {
        addAuth: (state, action) => {
            state.data = { token: action.payload.token }; // Giả sử action.payload có trường `token`
            syncLocal(action.payload);
        },
        removeAuth: (state, _action) => {
			state.data = initialState;
			syncLocal({});
		},
		refreshtoken: (state, action) => {
			state.data.token = action.payload;
            syncLocal(action.payload);
		},
    }
});

export const authReducer = authSlide.reducer;
export const { addAuth, removeAuth, refreshtoken } = authSlide.actions;

export const authSelector = (state: any) => state.authReducer.data;


const syncLocal = (data: any) => {
    if (data) {
        localStorage.setItem(localDataNames.authData, JSON.stringify(data));
    }
};
