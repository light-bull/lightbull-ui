import {isActionOf} from 'typesafe-actions';
import {MiddlewareAPI} from 'redux';
import {LightBullState} from '../../index';
import axios, {AxiosRequestConfig} from 'axios';
import {HttpAction, HttpActions} from './actions';
import {RequestBase, RequestWithEmptyResponseBase, RequestWithResponseBase} from './types';
import {LightBullThunkDispatch} from '../../../types/redux';
import {selectHasRequest, selectRequestCancelSource, selectRequestIsPending} from './selectors';

type HMAction = HttpAction;
type HMDispatch = LightBullThunkDispatch;
type HMMiddlewareAPI = MiddlewareAPI<HMDispatch, LightBullState>;

export type AxiosRequestInterceptor = (config: AxiosRequestConfig) => AxiosRequestConfig;

export interface HttpMiddlewareConfig {
    baseUrl?: string;
    timeout?: number;
    interceptors?: Array<AxiosRequestInterceptor>;
}

export const httpMiddleware = (config: HttpMiddlewareConfig) => {
    const client = axios.create({
        baseURL: config.baseUrl,
        timeout: config.timeout || 10000
    });

    for (let interceptor of config.interceptors || []) {
        client.interceptors.request.use(interceptor);
    }

    const performRequestWithResponse = async <T>(dispatch: HMDispatch,
                                                 getState: () => LightBullState,
                                                 label: string,
                                                 request: RequestWithResponseBase<T>,
                                                 execution: () => Promise<T>) => {
        await performRequest(dispatch, getState, label, request, async () => {
            const response = await execution();
            if (selectHasRequest(getState(), label)) {
                if (request.successHandler) {
                    request.successHandler(response, dispatch, getState);
                }
                dispatch(HttpActions.success(label));
            }
        });
    };

    const performRequestWithEmptyResponse = async <T>(dispatch: HMDispatch,
                                                      getState: () => LightBullState,
                                                      label: string,
                                                      request: RequestWithEmptyResponseBase,
                                                      execution: () => Promise<void>) => {
        await performRequest(dispatch, getState, label, request, async () => {
            await execution();
            if (selectHasRequest(getState(), label)) {
                if (request.successHandler) {
                    request.successHandler(dispatch, getState);
                }
                dispatch(HttpActions.success(label));
            }
        });
    };

    const performRequest = async <T>(dispatch: HMDispatch, getState: () => LightBullState,
                                     label: string, request: RequestBase,
                                     execution: () => Promise<void>) => {
        try {
            await execution();
        } catch (error) {
            if (selectHasRequest(getState(), label)) {
                if (request.errorHandler) {
                    request.errorHandler(error, dispatch, getState);
                }
                dispatch(HttpActions.failure(label, error));
            }
        }

    };

    return (api: HMMiddlewareAPI) => (next: HMDispatch) => (action: HMAction) => {
        if (isActionOf(HttpActions.request, action)) {
            const {label, request} = action.payload;

            const isPending = selectRequestIsPending(api.getState(), label);
            if (isPending) {
                return next(action);
            }

            const cancelSource = axios.CancelToken.source();
            api.dispatch(HttpActions.initRequest(label, cancelSource));

            switch (request.method) {
                case 'get':
                    performRequestWithResponse(api.dispatch, () => api.getState(), label, request, async () => {
                        const response = await client.get(request.path, {
                            cancelToken: cancelSource.token
                        });
                        return response.data;
                    });
                    break;
                case 'post':
                    performRequestWithResponse(api.dispatch, () => api.getState(), label, request, async () => {
                        const response = await client.post(request.path, request.body, {
                            cancelToken: cancelSource.token
                        });
                        return response.data;
                    });
                    break;
                case 'put':
                    performRequestWithResponse(api.dispatch, () => api.getState(), label, request, async () => {
                        const response = await client.put(request.path, request.body, {
                            cancelToken: cancelSource.token
                        });
                        return response.data;
                    });
                    break;
                case 'delete':
                    performRequestWithEmptyResponse(api.dispatch, () => api.getState(), label, request, async () => {
                        await client.delete(request.path, {
                            cancelToken: cancelSource.token
                        });
                    });
                    break;
            }

            return next(action);
        } else if (isActionOf(HttpActions.reset, action)) {
            const {label} = action.payload;

            const isPending = selectRequestIsPending(api.getState(), label);
            if (!isPending) {
                return next(action);
            }

            const cancelSource = selectRequestCancelSource(api.getState(), label);
            if (cancelSource) {
                cancelSource.cancel(`Request ${label} was cancelled`);
            }

            return next(action);
        }
        return next(action);
    };
};