import axios, { HttpStatusCode} from "axios";
import { getToken, logout } from "../AuthService";
import { triggerNegative } from "@/utils/Notify";
import { environment } from "@/envs/Environment";

const axiosService = axios.create({
    baseURL: environment.apiUrl
})

function expireSession() {
    const token = getToken();

    if(token) {
        triggerNegative('Session expired')
    }

    void logout();
};

axiosService.interceptors.request.use(
    (config) => {
        const token = getToken();

        if(token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },

    (error) => Promise.reject(toError(error))
)

axiosService.interceptors.response.use(
    (response) => response,
    async (error) => {
        const isUnauthorized = error.response?.status === HttpStatusCode.Unauthorized

        if(isUnauthorized) {
            expireSession();
        }

        return Promise.reject(toError(error))
    }
)

function toError(reason: unknown): Error{
    if (axios.isAxiosError(reason)) {
        const status = reason.response?.status
        const statusText = reason.response?.statusText
        const backendMsg =
        reason.response?.data?.message ||
        reason.response?.data?.error ||
        reason.response?.data?.details

        if(backendMsg) {
            return new Error(backendMsg);
        }

        if(status) {
            return new Error(`Erro ${status}${statusText ? `: ${statusText}` : ''}`)
        }

        return new Error(reason.message || 'Erro unknown')
    }    
    return reason instanceof Error ? reason : new Error(String(reason));
}

export default axiosService