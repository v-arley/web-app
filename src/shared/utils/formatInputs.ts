// export class InputFormatter {
// 	static identification(value: string): string {
// 		return value
// 			.replace(/[^\d-]/g, "")
// 			.replace(/-{2,}/g, "-")
// 			.slice(0, 50);
// 	}

// 	static letters(value: string, maxLength = 150): string {
// 		return value
// 			.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü' ]/g, "")
// 			.replace(/\s{2,}/g, " ")
// 			.trimStart()
// 			.slice(0, maxLength);
// 	}

// 	static phone(value: string): string {
// 		return value
// 			.replace(/[^\d()+\- ]/g, "")
// 			.replace(/\s{2,}/g, " ")
// 			.trimStart()
// 			.slice(0, 30);
// 	}

// 	static email(value: string): string {
// 		return value
// 			.replace(/\s+/g, "")
// 			.toLowerCase()
// 			.slice(0, 100);
// 	}

// 	static text(value: string, maxLength?: number): string {
// 		const normalized = value.replace(/\s{3,}/g, "  ");
// 		return maxLength ? normalized.slice(0, maxLength) : normalized;
// 	}
// }