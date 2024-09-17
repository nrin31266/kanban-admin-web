import { createSlice } from "@reduxjs/toolkit";
import { localDataNames } from "../../constants/appInfos";

export interface AuthState {
    token: string;
}

const initialState : AuthState = {
    token: '',
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        data: initialState 
    },
    reducers: {
        addAuth: (state, action) => {
            state.data = action.payload; 
            syncLocal(action.payload);
        },
        removeAuth: (state, _action) => {
			state.data = initialState;
			syncLocal({});
		},
		refreshToken: (state, action) => {
			state.data.token = action.payload;
            syncLocal({ ...state.data, token: action.payload });
		},
    }
});

export const authReducer = authSlice.reducer;
export const { addAuth, removeAuth, refreshToken } = authSlice.actions;

export const authSelector = (state: any) => state.authReducer.data;


const syncLocal = (data: any) => {
    if (data) {
        localStorage.setItem(localDataNames.authData, JSON.stringify(data));
    }
};
