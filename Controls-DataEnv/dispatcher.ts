/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
/**
 * Библиотека, содержащая Dispatcher.
 * Механизм и назначение описаны в {@link https://n.sbis.ru/shared/disk/eebbf702-d40d-4d35-b55c-8b8793f99f3d документе}.
 * @library
 * @public
 * @module
 */
export { Dispatcher } from './newLists/_dispatcher/Dispatcher';
export { TDispatcherProps } from './newLists/_dispatcher/types/TDispatcherProps';

export { conditionalMiddlewareFactory } from './newLists/_dispatcher/middlewareFactory/conditional';
export { asyncMiddlewareFactory } from './newLists/_dispatcher/middlewareFactory/async';

export { TAbstractAction } from './newLists/_dispatcher/types/TAbstractAction';
export { TAbstractMiddleware } from './newLists/_dispatcher/types/TAbstractMiddleware';
export {
    TAbstractMiddlewareContext,
    TAbstractMiddlewareContextGetter,
} from './newLists/_dispatcher/types/TAbstractMiddlewareContext';
