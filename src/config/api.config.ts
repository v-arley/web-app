import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

class ApiClient {
	private readonly client: AxiosInstance

	constructor(baseURL: string) {
		this.client = axios.create({
			baseURL,
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json',
			},
			timeout: 10000,
		})
	}

	get instance(): AxiosInstance {
		return this.client
	}

	async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.client.get<T>(url, config)
		return response.data
	}

	async post<TResponse, TPayload = unknown>(
		url: string,
		payload?: TPayload,
		config?: AxiosRequestConfig,
	): Promise<TResponse> {
		const response = await this.client.post<TResponse, AxiosResponse<TResponse>, TPayload>(
			url,
			payload,
			config,
		)

		return response.data
	}

	async put<TResponse, TPayload = unknown>(
		url: string,
		payload?: TPayload,
		config?: AxiosRequestConfig,
	): Promise<TResponse> {
		const response = await this.client.put<TResponse, AxiosResponse<TResponse>, TPayload>(
			url,
			payload,
			config,
		)

		return response.data
	}

	async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.client.delete<T>(url, config)
		return response.data
	}
}

export const apiClient = new ApiClient(API_BASE_URL)
export const axiosInstance = apiClient.instance

