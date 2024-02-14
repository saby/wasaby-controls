import type { IRequestId } from '../../_interface/IExternalTypes';

export const getRequestIdFromResponse = (response: unknown): IRequestId => {
    // TODO сейчас бекенд не возвращает requestId, но в светлом будущем должен
    // requestId нужен для параллельного выполнения нескольких асинхронных операций с ожиданием данных за раз
    // без него невозможно однозначно связать посланную команду и результаты, которые прислал бекенд
    void response;
    return undefined;
};
