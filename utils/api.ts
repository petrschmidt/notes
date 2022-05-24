import { RegisterHandler } from '../pages/api/register';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { IronSession } from 'iron-session';
import { IRON_SESSION_CONFIG } from './constants';
import { withIronSessionApiRoute } from 'iron-session/next';
import { LoginHandler } from '../pages/api/login';

export enum API {
  Register = '/api/register',
  Login = '/api/login',
}

type OptionalError = {
  err?: string;
};

export type CommonSession = IronSession & {
  session: {
    user:
      | {
          id: number;
          token: string;
        }
      | undefined;
  };
};

export type JwtPayload = {
  userId: number;
};

export type Handler<T = { request: {}; response: {} }> = T;

export type HandlerData = {
  [API.Register]: RegisterHandler;
  [API.Login]: LoginHandler;
};

type ApiRequest<T extends API> = Omit<NextApiRequest, 'body'> & {
  body: HandlerData[T]['request'];
};

type ApiResponse<T extends API> = NextApiResponse<
  HandlerData[T]['response'] | OptionalError
>;

export type ApiHandler<T extends API> = (
  req: ApiRequest<T> & CommonSession,
  res: ApiResponse<T>,
) => void;

export const withSession = <T extends API>(handler: ApiHandler<T>) =>
  //@ts-ignore
  withIronSessionApiRoute(handler, IRON_SESSION_CONFIG);

export const post = <
  T extends API,
  Req = HandlerData[T]['request'],
  Res = HandlerData[T]['response'],
>(
  endpoint: T,
  data: Req,
  config?: AxiosRequestConfig<Req>,
): Promise<AxiosResponse<Res | OptionalError>> =>
  axios.post(endpoint, data, config);
