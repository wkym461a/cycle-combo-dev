import React, { createContext, PropsWithChildren, useContext, useMemo, useReducer } from "react";
import audio from '~/assets/timer.mp3';

const audioContext = new window.AudioContext();
let audioData: AudioBuffer | null = null;
(async () => {
	const arrayBuffer = await fetch(audio).then(r => r.arrayBuffer());
	audioData = await audioContext.decodeAudioData(arrayBuffer);
})();

// 状態の型
type State = {
	source: AudioBufferSourceNode | undefined,
}

// 状態の初期値
const initialState: State = {
	source: undefined,
}

// 状態に対する操作の型
type Action =
	| { type: 'play' }
	| { type: 'playSilent' }

// 外部公開する操作
type ExtAction = {
	play: () => void,
	playSilent: () => void,
}

// コンテキスト型（状態と公開操作の組み合わせ）
type AudioContextType = State & ExtAction;

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
	case 'play': {
		state.source?.stop();
		state.source?.disconnect();
		const source = audioContext.createBufferSource();
		source.buffer = audioData;
		source.connect(audioContext.destination);
		source.start(0);
		return {
			...state,
			source,
		}
	}
	case 'playSilent': {
		state.source?.stop();
		state.source?.disconnect();
		const source = audioContext.createBufferSource();
		source.buffer = audioData;
		const gainNode = audioContext.createGain();
		gainNode.gain.value = 0;
		source.connect(gainNode);
		gainNode.connect(audioContext.destination);
		source.start(0);
		return {
			...state,
			source,
		}
	}
	default:
		return state;
	}
}

const AudioContext = createContext<AudioContextType>({
	...initialState,
	play: () => {},
	playSilent: () => {},
});

export const AudioProvider: React.FC<PropsWithChildren> = (props: PropsWithChildren) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	// コンテキストのインスタンス生成
	const play = () => dispatch({ type: 'play' });
	const playSilent = () => dispatch({ type: 'playSilent' });
	const value = useMemo<AudioContextType>(
		() => ({
			...state,
			play,
			playSilent,
		}),
		[state],
	);

	return <AudioContext.Provider value={value} {...props} />;
}

export const useAudio = () => {
	const context = useContext(AudioContext);

  if (typeof context === 'undefined') {
    throw new Error('useAudio must be within a AudioProvider');
  }

  return context;
}
