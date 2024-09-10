import { createSlice } from "@reduxjs/toolkit";
import { getToken, removeToken, setToken } from "../../services/localStoreService";

export interface AuthState {
    token: string;
}

const initState: AuthState = {
    token: '',
};

const authSlide = createSlice({
    name: 'auth',
    initialState: {
        data: initState
    },
    reducers: {
        addAuth: (state, action) => {
            state.data = { token: action.payload.token }; // Giả sử action.payload có trường `token`
            syncLocal(action.payload);
        },
        removeAuth: (state, _action) => {
            state.data = initState;
            syncLocal(null); // Gọi syncLocal với null để xóa dữ liệu
        }
    }
});

export const authReducer = authSlide.reducer;
export const { addAuth, removeAuth } = authSlide.actions;

export const authSelector = (state: any) => state.authReducer.data;

// Cập nhật hoặc xóa dữ liệu trong localStorage
const syncLocal = (data: AuthState | null) => {
    if (data) {
        setToken(JSON.stringify(data)); // Lưu đối tượng dữ liệu vào localStorage
    } else {
        removeToken(); // Xóa dữ liệu khỏi localStorage
    }
};
