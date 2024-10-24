/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractMiddleware } from 'Controls-DataEnv/dispatcher';

import type { TListMobileActions } from '../actions';
import type { TListMobileMiddlewareContext } from './TListMobileMiddlewareContext';
import type { IListMobileState } from 'Controls-Lists/_dataFactory/ListMobile/interface/IListMobileState';

/**
 * Тип промежуточного слоя для списка на базе мобильного контроллера.
 *
 * Промежуточный слой отвечает за обработку действий и их передачу следующему промежуточному слою или компоненту.
 * Поддерживает асинхронность, для этого необходимо использовать async/await или возврат обещания.
 *
 * Наследник абстрактного промежуточного слоя.
 *
 * @see TAbstractMiddleware
 *
 * @private
 * @author Родионов Е.А.
 */
export type TListMobileMiddleware = TAbstractMiddleware<
    IListMobileState,
    TListMobileActions.TAnyListMobileAction,
    TListMobileMiddlewareContext
>;
