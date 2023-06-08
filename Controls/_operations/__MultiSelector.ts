/**
 * @kaizen_zone ba2b1294-cc16-4bec-aaf4-e4f0bc5bd89b
 */
import rk = require('i18n!Controls');
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_operations/__MultiSelector';
import { Model, CancelablePromise } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import {
    TKeysSelection,
    ISelectionObject,
    TSelectionCountMode,
} from 'Controls/interface';
import {
    default as getCountUtil,
    IGetCountCallParams,
} from 'Controls/_operations/MultiSelector/getCount';
import { LoadingIndicator } from 'Controls/LoadingIndicator';
import { getAdditionalItems } from 'Controls/_operations/Utils/getAdditionalItems';
import { isEqual } from 'Types/object';
import 'css!Controls/operations';
import { ControllerClass as OperationsController } from '../_operations/ControllerClass';
import { RecordSet } from 'Types/collection';
import { process } from 'Controls/error';

const DEFAULT_CAPTION = rk('Отметить');

interface IMultiSelectorChildren {
    countIndicator: LoadingIndicator;
}

interface IMultiSelectorMenuItem {
    id: string;
    title: string;
}

type TCount = null | number | void;
type CountPromise = CancelablePromise<TCount>;
type MultiSelectorMenuItems = IMultiSelectorMenuItem[];

export interface IMultiSelectorOptions extends IControlOptions {
    selectedKeys: TKeysSelection;
    excludedKeys: TKeysSelection;
    selectedKeysCount: TCount;
    countLoading?: boolean;
    isAllSelected?: boolean;
    selectionViewMode?: 'all' | 'selected' | 'partial';
    selectedCountConfig?: IGetCountCallParams;
    parentProperty?: string;
    operationsController?: OperationsController;
    selectionCountMode?: TSelectionCountMode;
    recursiveSelection?: boolean;
}

/**
 * Контрол отображающий выпадающий список, который позволяет отмечать все записи, инвертировать, снимать с них отметку.
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/actions/operations/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_operations.less переменные тем оформления}
 *
 * @class Controls/_operations/SimpleMultiSelector
 * @extends Core/Control
 *
 * @public
 * @demo Controls-demo/operations/SimpleMultiSelector/Index
 */

export default class MultiSelector extends Control<
    IMultiSelectorOptions,
    TCount
> {
    protected _template: TemplateFunction = template;
    protected _menuItems: RecordSet = null;
    protected _sizeChanged: boolean = false;
    protected _menuCaption: string = null;
    protected _countPromise: CountPromise = null;
    protected _children: IMultiSelectorChildren;

    protected _beforeMount(options: IMultiSelectorOptions): Promise<TCount> {
        this._menuItems = this._getMenuItems(options);
        return this._updateMenuCaptionByOptions(options);
    }

    protected _beforeUpdate(
        newOptions: IMultiSelectorOptions
    ): void | Promise<TCount> {
        const options = this._options;
        const loadingChanged =
            this._options.countLoading !== newOptions.countLoading;
        const selectionIsChanged =
            options.selectedKeys !== newOptions.selectedKeys ||
            options.excludedKeys !== newOptions.excludedKeys;
        const viewModeChanged =
            options.selectionViewMode !== newOptions.selectionViewMode;
        const isAllSelectedChanged =
            options.isAllSelected !== newOptions.isAllSelected;
        const selectionCfgChanged = !isEqual(
            options.selectedCountConfig,
            newOptions.selectedCountConfig
        );
        const selectionCountChanged =
            options.selectedKeysCount !== newOptions.selectedKeysCount;
        const shouldUpdateCount =
            selectionIsChanged ||
            selectionCountChanged ||
            isAllSelectedChanged ||
            (selectionCfgChanged && !this._isEmptySelection(newOptions)) ||
            loadingChanged;

        if (
            selectionIsChanged ||
            viewModeChanged ||
            isAllSelectedChanged ||
            selectionCfgChanged
        ) {
            this._menuItems = this._getMenuItems(newOptions);
        }

        if (loadingChanged) {
            if (newOptions.countLoading) {
                this._children.countIndicator?.show();
            } else {
                this._children.countIndicator?.hide();
            }
        }

        if (shouldUpdateCount) {
            return this._updateMenuCaptionByOptions(
                newOptions,
                selectionCfgChanged
            );
        }
    }

    protected _afterRender(oldOptions?: IMultiSelectorOptions): void {
        if (this._sizeChanged) {
            this._sizeChanged = false;
            this._notify('controlResize', [], { bubbling: true });
        }
    }

    private _isEmptySelection(options: IMultiSelectorOptions): boolean {
        return (
            options.selectedKeys.length === 0 &&
            options.excludedKeys.length === 0
        );
    }

    private _getAdditionalMenuItems({
        selectedKeys,
        selectionViewMode,
        isAllSelected,
        selectedKeysCount,
    }: IMultiSelectorOptions): MultiSelectorMenuItems {
        return getAdditionalItems(
            selectionViewMode,
            isAllSelected,
            selectedKeys,
            selectedKeysCount,
            false
        );
    }

    private _getMenuItems(options: IMultiSelectorOptions): RecordSet {
        return new RecordSet({
            keyProperty: 'id',
            rawData: [...this._getAdditionalMenuItems(options)],
        });
    }

    private _updateMenuCaptionByOptions(
        options: IMultiSelectorOptions,
        counterConfigChanged?: boolean
    ): Promise<TCount> {
        const {
            selectedKeys,
            excludedKeys,
            selectedKeysCount,
            operationsController,
            selectedCountConfig,
        } = options;
        const selection = this._getSelection(selectedKeys, excludedKeys);
        const count =
            counterConfigChanged && selectedKeysCount !== 0
                ? null
                : selectedKeysCount;
        const getCountCallback = (itemsCount, isAllSelected) => {
            this._menuCaption = this._getMenuCaption(
                selection,
                itemsCount,
                isAllSelected
            );
            this._sizeChanged = true;
            operationsController?.setSelectedKeysCount(itemsCount);
        };
        const needUpdateCount =
            !selectedCountConfig ||
            !counterConfigChanged ||
            this._isCorrectCount(count) ||
            !options.isAllSelected;

        if (needUpdateCount && !options.countLoading) {
            const getCountResult = this._getCount(selection, count, options);

            // Если счётчик удаётся посчитать без вызова метода, то надо это делать синхронно,
            // иначе promise порождает асинхронность и перестроение панели операций будет происходить скачками,
            // хотя можно было это сделать за одну синхронизацию
            if (getCountResult instanceof Promise) {
                return getCountResult
                    .then((itemsCount) => {
                        getCountCallback(
                            itemsCount,
                            this._options.isAllSelected
                        );
                    })
                    .catch((error) => {
                        return error;
                    });
            } else {
                getCountCallback(getCountResult, options.isAllSelected);
            }
        }
    }

    private _getMenuCaption(
        { selected }: ISelectionObject,
        count: TCount,
        isAllSelected: boolean
    ): string {
        const hasSelected = !!selected.length;
        let caption;

        if (hasSelected) {
            if (count > 0) {
                caption = rk('Отмечено') + ' ' + count;
            } else if (isAllSelected) {
                caption = rk('Отмечено все');
            } else if (count === null) {
                caption = rk('Отмечено');
            } else {
                caption = DEFAULT_CAPTION;
            }
        } else {
            caption = DEFAULT_CAPTION;
        }

        return caption;
    }

    private _getCount(
        selection: ISelectionObject,
        count: TCount,
        { selectedCountConfig, parentProperty }: IMultiSelectorOptions
    ): Promise<TCount> | TCount {
        const selectedKeysLength = selection.selected.length;
        let countResult;
        this._cancelCountPromise();
        if (
            !selectedCountConfig ||
            !selectedKeysLength ||
            this._isCorrectCount(count)
        ) {
            if (count === undefined) {
                // Для иерархических списков нельзя посчитать кол-во отмеченных записей по количеству ключей
                if (!parentProperty) {
                    countResult = selection.selected.length;
                } else if (selectedKeysLength) {
                    countResult = null;
                }
            } else {
                countResult = count;
            }
        } else {
            countResult = this._getCountBySourceCall(
                selection,
                selectedCountConfig
            );
        }
        return countResult;
    }

    private _resetCountPromise(): void {
        if (this._children.countIndicator) {
            this._children.countIndicator.hide();
        }
        this._countPromise = null;
    }

    private _cancelCountPromise(): void {
        if (this._countPromise) {
            this._countPromise.cancel();
        }
        this._resetCountPromise();
    }

    private _getCountBySourceCall(
        selection,
        selectionCountConfig
    ): Promise<number> {
        const { selectionCountMode, recursiveSelection } = this._options;
        this._children.countIndicator?.show();
        this._countPromise = new CancelablePromise(
            getCountUtil.getCount(
                selection,
                selectionCountConfig,
                selectionCountMode,
                recursiveSelection
            )
        );
        return this._countPromise.promise
            .then((result: number): number => {
                this._resetCountPromise();
                return result;
            })
            .catch((error) => {
                if (!error.isCanceled) {
                    process({ error });
                }
                return Promise.reject(error);
            });
    }

    private _getSelection(
        selectedKeys: TKeysSelection,
        excludedKeys: TKeysSelection
    ): ISelectionObject {
        return {
            selected: selectedKeys,
            excluded: excludedKeys,
        };
    }

    private _isCorrectCount(count: TCount): boolean {
        return typeof count === 'number' || count === undefined;
    }

    protected _onMenuItemActivate(
        event: SyntheticEvent<'menuItemActivate'>,
        item: Model
    ): void {
        const itemId: string = item.get('command');

        this._notify('selectedTypeChanged', [itemId], {
            bubbling: true,
        });
    }

    protected _beforeUnmount(): void {
        this._cancelCountPromise();
    }

    static getDefaultOptions(): object {
        return {
            selectedKeys: [],
            excludedKeys: [],
            fontColorStyle: 'operationsPanel',
        };
    }
}

/**
 * @name Controls/_operations/SimpleMultiSelector#selectedKeysCount
 * @cfg {Number} Счётчик отмеченных записей.
 * @example
 * <pre class="brush: html">
 *    <Controls.operations:SimpleMultiSelector selectedKeysCount="{{10}}"/>
 * </pre>
 */

/**
 * @name Controls/_operations/SimpleMultiSelector#selectedTypeChanged
 * @event Происходит при выборе из выпадающего списка, который открывается при клике на кнопку "Отметить".
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {String} selectedType Идентификатор выбранного пункта
 */
