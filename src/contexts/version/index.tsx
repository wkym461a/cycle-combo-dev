import React, { createContext, PropsWithChildren, useContext, useMemo, useReducer } from "react";
import { VersionStorage } from "~/storage/version";

// 状態の型
type State = {
	isUpdatedVersion: boolean,
}

// 状態の初期値
const initialState: State = {
	isUpdatedVersion: false,
}

// 状態に対する操作の型
type Action =
	| { type: 'check' }
	| { type: 'clear' }

// 外部公開する操作
type ExtAction = {
	checkIsUpdatedVersion: () => void,
	clearIsUpdatedVersion: () => void,
}

// コンテキスト型（状態と公開操作の組み合わせ）
type VersionContextType = State & ExtAction;

export const getCurrentVersion = (): string => {
	return import.meta.env.VITE_VERSION;
}
const reducer = (state: State, action: Action): State => {
	switch (action.type) {
	case 'check':
		const pre = VersionStorage.get();
		const cur = getCurrentVersion();
		if (pre === '') {
			VersionStorage.set(cur);
		}
		return {
			...state,
			isUpdatedVersion: (pre !== '' && pre !== cur),
		}
	case 'clear':
		const ver = getCurrentVersion();
		VersionStorage.set(ver);
		return {
			...state,
			isUpdatedVersion: false,
		}
	default:
		return state;
	}
}

const VersionContext = createContext<VersionContextType>({
	...initialState,
	checkIsUpdatedVersion: () => {},
	clearIsUpdatedVersion: () => {},
});

export const VersionProvider: React.FC<PropsWithChildren> = (props: PropsWithChildren) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	// コンテキストのインスタンス生成
	const checkIsUpdatedVersion = () => dispatch({ type: 'check' });
	const clearIsUpdatedVersion = () => dispatch({ type: 'clear' });
	const value = useMemo<VersionContextType>(
		() => ({
			...state,
			checkIsUpdatedVersion,
			clearIsUpdatedVersion,
		}),
		[state],
	);

	return <VersionContext.Provider value={value} {...props} />;
}

export const useVersion = () => {
	const context = useContext(VersionContext);

	if (typeof context === 'undefined') {
		throw new Error('useVersion must be within a VersionProvider');
	}

	return context;
}
