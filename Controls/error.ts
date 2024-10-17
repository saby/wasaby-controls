/**
 * @kaizen_zone 6c2c3a3e-9f32-4e3f-a2ed-d6042ebaaf7c
 */
/**
 * Библиотека компонентов для обработки ошибок.
 * @library
 * @public
 */

import {
    ErrorHandler,
    ErrorViewConfig,
    IErrorHandlerConfig,
    ErrorType,
    ErrorViewMode,
    ErrorViewSize,
    IErrorControllerOptions,
    IErrorRepeatConfig,
    IDefaultTemplateOptions,
} from './_error/interface';
import ErrorController, {
    IControllerOptions,
    IProcessConfig,
    OnProcessCallback,
} from './_error/Controller';
import process, { IProcessOptions, IDialogOptions } from './_error/process';
import Popup, { IPopupHelper } from './_error/Popup';
import DialogOpener from './_error/DialogOpener';

// TODO удалить совместимость после перевода всех на новые имена
export {
    DialogOpener,
    ErrorController as Controller, // для совместимости
    ErrorController,
    ErrorHandler as Handler, // для совместимости
    ErrorHandler,
    ErrorType,
    ErrorViewConfig,
    ErrorViewConfig as ViewConfig, // для совместимости
    ErrorViewMode as Mode, // для совместимости
    ErrorViewMode,
    ErrorViewSize,
    IControllerOptions,
    IDefaultTemplateOptions,
    IDialogOptions,
    IErrorControllerOptions,
    IErrorHandlerConfig as HandlerConfig, // для совместимости
    IErrorHandlerConfig,
    IErrorRepeatConfig,
    IPopupHelper,
    IProcessConfig,
    IProcessOptions,
    OnProcessCallback,
    Popup,
    process,
};
