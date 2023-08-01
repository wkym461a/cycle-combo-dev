import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "~/app/store";

export type CounterState = {
  count: number;
};

const initialState: CounterState = { count: 10 };

export const counterSlice = createSlice({
	name: 'counter',
	initialState,
	reducers: {
		increment: (state) => ({ ...state, count: state.count + 1 }),
	},
});

export const { increment } = counterSlice.actions;

export const selectCount = (state: RootState) => state.counter.count;
