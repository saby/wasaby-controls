/**
 * @kaizen_zone 9667df49-f81c-47b7-8671-9b43a1025495
 */
/**
 * Библиотека, которая предоставляет редактирование по месту в коллекции.
 * @library
 *
 * @public
 */

/*
 * Library that provides edit in place for collection
 * @library
 *
 * @public
 * @author Родионов Е.А.
 */
/**
 * @ignore
 */
export const JS_SELECTORS: Record<'NOT_EDITABLE', TNotEditableJsSelector> = {
    NOT_EDITABLE: 'js-controls-ListView__notEditable',
};

export type TNotEditableJsSelector = 'js-controls-ListView__notEditable';

import { Controller } from './_editInPlace/Controller';

import { InputActivationHelper as InputHelper } from './_editInPlace/InputActivationHelper';

export {
    Controller,
    TAsyncOperationResult,
    IBeforeBeginEditCallbackParams,
    IBeforeEndEditCallbackParams,
    IEditInPlaceOptions,
} from './_editInPlace/Controller';
export { InputHelper };
export {
    CONSTANTS,
    TCancelConstant,
    TGoToNextConstant,
    TGoToPrevConstant,
    TNextColumnConstant,
    TPrevColumnConstant,
} from './_editInPlace/Types';

export interface IEditInPlaceLibPublicExports {
    Controller: typeof Controller;
    InputHelper: typeof InputHelper;
}
