/**
 * @kaizen_zone 7932f75e-2ad3-49ad-b51a-724eb5c140eb
 */
/**
 * Библиотека контролов для работы с формами.
 * @library
 * @includes TConfirmationDialogResult Controls/form/TConfirmationDialogResult
 * @public
 */

/*
 * form library
 * @library
 * @public
 * @author Мочалов М.А.
 */

export { default as PrimaryAction } from './_form/PrimaryAction';
export { default as FocusWithEnter } from './_form/FocusWithEnter';
export { default as Controller, INITIALIZING_WAY, IResultEventData } from './_form/FormController';
export { default as ControllerBase } from './_form/ControllerBase';
export { default as CrudController, CRUD_EVENTS } from './_form/CrudController';
export { default as IFormController } from './_form/interface/IFormController';
export {
    IControllerBase,
    IUpdateConfig,
    TConfirmationDialogResult,
} from './_form/interface/IControllerBase';
