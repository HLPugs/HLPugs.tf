export class ErrorModel {
	message: string;

	name?: string;
	httpCode?: number;
	stack?: string;
	errors?: any[];
}
