// 参考: https://zenn.dev/jiftechnify/articles/2489f4103918a2

const KEY = "VERSION";
type ValueType = string;

export class VersionStorage {
	static get(): ValueType {
		const value = localStorage.getItem(KEY);
		if (value === null) {
			return "";
		}
		return value;
	}

	static set(value: string) {
		localStorage.setItem(KEY, value);
	}
}
