import { stub } from '../types';

/**
 * Конструктор действия для установки видимости заглушки.
 * @function
 * @param {boolean} needShowStub Показывать ли заглушку
 * @return stub.TSetStubVisibilityAction
 */
export const setStubVisibility = (needShowStub: boolean): stub.TSetStubVisibilityAction => ({
    type: 'setStubVisibility',
    payload: {
        needShowStub,
    },
});
