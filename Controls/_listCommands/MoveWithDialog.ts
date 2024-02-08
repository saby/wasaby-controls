/**
 * @kaizen_zone 1ae44c37-18d9-4109-b22c-bd35470364aa
 */
import { Logger } from 'UI/Utils';
import { Model } from 'Types/entity';
import { CrudEntityKey, LOCAL_MOVE_POSITION } from 'Types/source';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { TBeforeMoveCallback } from 'Controls/baseList';
import { Confirmation, IBasePopupOptions, StickyOpener, DialogOpener } from 'Controls/popup';
import { ISelectionObject } from 'Controls/interface';
import { IMoverDialogTemplateOptions } from 'Controls/moverDialog';
import Move, { IOptions as IMoveOptions } from './Move';

import { IValidationResult } from './Providers/Move';

import * as rk from 'i18n!Controls';

const BUTTON_SELECTOR = '.controls-BaseButton';
const DIALOG_FILTER = { 'Только узлы': true };
const NO_RECORDS = rk('Нет записей для обработки команды');
const CANCEL = 'Cancel';

/**
 * Интерфейс опций диалога перемещения.
 * @interface Controls/_listCommands/Providers/Move/IMoveProvider/IMoveDialogOptions
 * @public
 */
export interface IMoveDialogOptions extends IBasePopupOptions {
    beforeMoveCallback?: TBeforeMoveCallback;
}

/**
 * @interface Controls/_listCommands/MoveWithDialog/IMoveProviderWithDialog
 * @extends Controls/_listCommands/Providers/Move/IMoveProvider
 * @public
 */
export interface IOptions extends IMoveOptions {
    /**
     * @cfg {IMoverDialogOptions} опции диалога перемещения
     */
    popupOptions: IMoveDialogOptions;
    /**
     * @cfg {String} Свойство, содержащее тип узла
     */
    nodeProperty?: string;
    /**
     * @cfg {String} Свойство, содержащее признак наличия потомков узла
     */
    hasChildrenProperty?: string;
    /**
     * @cfg {Controls/baseList/TBeforeMoveCallback.typedef} функция, выполняемая после выбора папки назначения в окне, но перед перемещением
     */
    beforeMoveCallback?: TBeforeMoveCallback;
    /**
     * @cfg {String} имя провайдера для выполнения команды. Провайдер должен реализовывать интерфейс {@link Controls/_listCommands/interface/IProvider} и принимать конфиг с опциями {@link Controls/listCommands:IMoveWithDialogOptions}
     */
    providerName?: string;
    /**
     * Элемент, к которому происходит перемещение
     */
    targetItem?: string;
    /**
     * Текущая тема
     */
    theme?: string;
}

/**
 * Действие "перемещение записей при помощи диалога"
 * @implements Controls/_listCommands/MoveWithDialog/IMoveProviderWithDialog
 * @public
 */
export default class MoveWithDialog extends Move {
    // Менеджер диалоговых окон
    private _dialogOpener: StickyOpener | DialogOpener;

    constructor(options: IOptions = {} as IOptions) {
        super(options);
        if (!this._options.position) {
            this._options.position = LOCAL_MOVE_POSITION.On;
        }
    }

    /**
     * показывает диалог перемещения и получает ключ записи назначения
     * @param config
     * @private
     */
    protected _getTargetKey(config: Partial<IOptions>): Promise<CrudEntityKey> {
        const popupOptions = MoveWithDialog._getPopupOptions(config);
        const root = (popupOptions?.templateOptions as IMoverDialogTemplateOptions)?.root || null;
        return this._openMoveDialog({
            ...config,
            popupOptions,
        }).then((targetItem) => {
            return this._applyBeforeMoveCallback({
                ...config,
                popupOptions,
                targetItem,
            }).then(() => {
                return targetItem === root ? targetItem : (targetItem as Model).getKey();
            });
        });
    }

    /**
     * Открывает диалог перемещения и после выбора возвращает узел, в который происходит перемещение
     * @private
     */
    private _openMoveDialog(config: Partial<IOptions>): Promise<Model | CrudEntityKey> {
        const validationResult = MoveWithDialog._validateBeforeOpenDialog(
            config.selection,
            config.popupOptions
        );
        if (validationResult.isError) {
            Confirmation.openPopup({
                type: 'ok',
                message: validationResult.message,
            });
            Logger.error(validationResult.message, this);
            return Promise.reject(new Error(validationResult.message));
        }

        const templateOptions: IMoverDialogTemplateOptions = {
            movedItems: config.selection.selected,
            source: config.source,
            ...(config.popupOptions.templateOptions as IMoverDialogTemplateOptions),
        };

        const target = this._calculateTarget(config);
        const centerOfWindow = window?.innerWidth ? window.innerWidth / 2 : 0;
        const direction = {
            horizontal: 'right',
        };
        const targetPoint = {
            vertical: 'top',
            horizontal: 'left',
        };
        if (target?.x > centerOfWindow) {
            direction.horizontal = 'left';
            targetPoint.horizontal = 'right';
        }

        return new Promise((resolve) => {
            this._getOpener(config).open({
                target,
                fittingMode: {
                    vertical: 'overflow',
                    horizontal: 'adaptive',
                },
                direction,
                targetPoint,
                className: config.target?.left
                    ? ''
                    : `controls_popupTemplate_theme-${config.theme} controls-MoveDialog__content_popup`,
                opener: config.popupOptions.opener,
                templateOptions,
                closeOnOutsideClick: true,
                template: config.popupOptions.template,
                maxHeight: window?.innerHeight,
                eventHandlers: {
                    onResult: (targetItem: Model | CrudEntityKey) => {
                        resolve(targetItem);
                    },
                },
            });
        });
    }

    private _getOpener(config: Partial<IOptions>): StickyOpener | DialogOpener {
        if (!this._dialogOpener) {
            this._dialogOpener = this._calculateTarget(config)
                ? new StickyOpener()
                : new DialogOpener();
        }
        return this._dialogOpener;
    }

    private _calculateTarget(config: Partial<IOptions>): HTMLElement {
        if (!config.target) {
            return;
        }
        // При работе Actions на чистых слайсах в target может попадать событие
        let target = config.target.target ? config.target.target : config.target;
        // Преобразуем координаты, если в качестве target передан boundingClientRect
        if (target.left) {
            target = {
                x: target.left,
                y: target.top,
                width: target.width,
                height: target.height,
            };
        } else {
            target = target.closest(BUTTON_SELECTOR);
        }
        return target as HTMLElement;
    }

    /**
     * Применяет beforeMoveCallback
     * @param config
     * @private
     */
    private _applyBeforeMoveCallback(config: Partial<IOptions>): Promise<void | boolean> {
        const { popupOptions, selection, targetItem, filter } = config;
        const beforeMoveCallback = popupOptions.beforeMoveCallback;
        if (beforeMoveCallback) {
            let callbackResult: boolean | Promise<void | boolean>;
            if (typeof beforeMoveCallback === 'string') {
                callbackResult = loadAsync(beforeMoveCallback).then((callback: Function) => {
                    return callback(selection, targetItem, filter);
                });
            } else {
                callbackResult = beforeMoveCallback(selection, targetItem, filter);
            }
            if (callbackResult instanceof Promise) {
                return callbackResult.then((result?: void | boolean) => {
                    if (result === false) {
                        return Promise.reject(CANCEL);
                    }
                });
            } else if (callbackResult === false) {
                return Promise.reject(CANCEL);
            }
        }
        return Promise.resolve();
    }

    /**
     * Производит проверку переданного объекта с идентификаторами элементов для перемещения.
     * Если список идентификаторов пуст, возвращает false и выводит окно с текстом, иначе возвращает true.
     * @private
     */
    private static _validateBeforeOpenDialog(
        selection: ISelectionObject,
        popupOptions: IMoveDialogOptions
    ): IValidationResult {
        const result: IValidationResult = {
            message: undefined,
            isError: false,
        };
        if (!popupOptions.template) {
            result.message = 'MoveWithDialog: MoveDialogTemplate option is undefined';
            result.isError = true;
        } else if (!selection || (!selection.selected && !selection.excluded)) {
            result.message =
                'MoveWithDialog: Selection type must be Controls/interface:ISelectionObject';
            result.isError = true;
        } else if (selection.selected && !selection.selected.length) {
            result.message = NO_RECORDS;
            result.isError = true;
        }
        return result;
    }

    private static _getPopupOptions(config: Partial<IOptions>): IMoveDialogOptions {
        return (
            config.popupOptions || {
                template: 'Controls/moverDialog:Template',
                templateOptions: {
                    displayProperty: config.displayProperty,
                    parentProperty: config.parentProperty,
                    nodeProperty: config.nodeProperty,
                    hasChildrenProperty: config.hasChildrenProperty,
                    columns: config.columns,
                    filter: { ...DIALOG_FILTER, ...config.filter },
                },
                beforeMoveCallback: config.beforeMoveCallback,
            }
        );
    }
}
