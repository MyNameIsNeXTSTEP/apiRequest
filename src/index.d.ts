// declare module "apirequest" {
  export type TapiRequestMethods = keyof typeof EApiRequestMethods;

  export const EApiRequestMethods: {
    GET: 'GET';
    POST: 'POST';
    PUT: 'PUT';
    DELETE: 'DELETE';
  };

  export interface IRequestConfig {
    url: string,
    method: TapiRequestMethods,
    query?: Record<string, string | number | null>,
    headers?: Record<string, string>,
    body?: string,
    signal?: AbortSignal,
  };

  export class APIRequest {
    #hostname: string;
    #port: string;
    #host: string;
    #requestConfig: IRequestConfig;
    #abortController: AbortController;

    constructor(requestConfig: IRequestConfig);

    public doRequest(): Promise<Response | undefined>;

    #prepareRequestConfig(): IRequestConfig;

    public abort(): void;

    public retryWith(interval: number, attempts?: number): Promise<void>;
  }
// }