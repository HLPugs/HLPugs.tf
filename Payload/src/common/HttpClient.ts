export default class HttpClient {
	
	private readonly apiPrefix: string = '/api'; // make this reflect current api version
	private readonly defaultTryCount = 3;

	async get(url: string, tryCount: number | undefined = this.defaultTryCount) {
		return this.requestWithRetry(url, tryCount);
	}

	async post(url: string, data: any, tryCount: number | undefined = this.defaultTryCount) {
		const options: RequestInit = {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			},
		}
		return this.requestWithRetry(url, tryCount, options);
	}

	async put(url: string, data: any, tryCount: number | undefined = this.defaultTryCount) {
		const options: RequestInit = {
			method: 'PUT',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			},
		}
		return this.requestWithRetry(url, tryCount, options);
	}

	async delete(url: string, data: any, tryCount: number | undefined = this.defaultTryCount) {
		const options: RequestInit = {
			method: 'DELETE',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			},
		}
		return this.requestWithRetry(url, tryCount, options);
	}

	private requestWithRetry(url: string, tryCount: number | undefined = this.defaultTryCount, options: RequestInit | undefined = undefined): any {
		try {
			fetch(this.apiPrefix + url, options);
		} catch(err) {
			if (tryCount === 1) throw err;
			return this.requestWithRetry(url, tryCount - 1, options);
		}
	}
}