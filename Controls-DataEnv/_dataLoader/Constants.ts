import { constants } from 'Env/Constants';

export const SERVER_GET_CONFIG_TIMEOUT = 3000;
export const CLIENT_GET_CONFIG_TIMEOUT = 15000;
export const GET_CONFIG_TIMEOUT: number = constants.isServerSide
    ? SERVER_GET_CONFIG_TIMEOUT
    : CLIENT_GET_CONFIG_TIMEOUT;
