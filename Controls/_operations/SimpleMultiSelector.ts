/**
 * @kaizen_zone ba2b1294-cc16-4bec-aaf4-e4f0bc5bd89b
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_operations/SimpleMultiSelector';
import { CancelablePromise } from 'Types/entity';
import { TKeysSelection, ISelectionObject, TSelectionCountMode } from 'Controls/interface';
import {
    default as getCountUtil,
    IGetCountCallParams,
} from 'Controls/_operations/MultiSelector/getCount';
import { isEqual } from 'Types/object';
import 'css!Controls/operations';
import { ControllerClass as OperationsController } from '../_operations/ControllerClass';
import { process } from 'Controls/error';

type TCount = null | number | void;
type CountPromise = CancelablePromise<TCount>;

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

export default class MultiSelector extends Control<IMultiSelectorOptions, TCount> {
    protected _template: TemplateFunction = template;
    protected _sizeChanged: boolean = false;
    protected _countPromise: CountPromise = null;
    protected _count: TCount;
    protected _renderProps: Partial<IMultiSelectorOptions>;
    protected _loading: boolean = false;

    protected _beforeMount(options: IMultiSelectorOptions): Promise<TCount> {
        this._renderProps = this._getRenderProps(options);
        this._loading = options.countLoading;
        return this._calculateCount(options);
    }

    protected _getRenderProps(options: IMultiSelectorOptions): Partial<IMultiSelectorOptions> {
        const defaultSelectedTypeHandler = (type) => {
            this._notify('selectedTypeChanged', [type], { bubbling: true });
        };
        return {
            isAllSelected: options.isAllSelected,
            selectedKeys: options.selectedKeys,
            selectionViewMode: options.selectionViewMode,
            excludedKeys: options.excludedKeys,
            fontColorStyle: options.fontColorStyle,
            menuHoverBackgroundStyle: options.menuHoverBackgroundStyle,
            menuBackgroundStyle: options.menuBackgroundStyle,
            fontSize: options.fontSize,
            closeButtonVisibility: options.closeButtonVisibility,
            onSelectedTypeChanged: options.onSelectedTypeChanged || defaultSelectedTypeHandler,
        };
    }

    protected _beforeUpdate(newOptions: IMultiSelectorOptions): void | Promise<TCount> {
        const options = this._options;
        const loadingChanged = this._options.countLoading !== newOptions.countLoading;
        const selectionIsChanged =
            options.selectedKeys !== newOptions.selectedKeys ||
            options.excludedKeys !== newOptions.excludedKeys;
        const isAllSelectedChanged = options.isAllSelected !== newOptions.isAllSelected;
        const selectionCfgChanged = !isEqual(
            options.selectedCountConfig,
            newOptions.selectedCountConfig
        );
        const selectionCountChanged = options.selectedKeysCount !== newOptions.selectedKeysCount;
        const shouldUpdateCount =
            selectionIsChanged ||
            selectionCountChanged ||
            isAllSelectedChanged ||
            (selectionCfgChanged && !this._isEmptySelection(newOptions)) ||
            loadingChanged;
        if (
            selectionIsChanged ||
            isAllSelectedChanged ||
            newOptions.selectionViewMode !== options.selectionViewMode
        ) {
            this._renderProps = this._getRenderProps(newOptions);
        }
        if (loadingChanged) {
            this._loading = newOptions.countLoading;
        }
        if (shouldUpdateCount) {
            return this._calculateCount(newOptions, selectionCfgChanged);
        }
    }

    protected _afterRender(oldOptions?: IMultiSelectorOptions): void {
        if (this._sizeChanged) {
            this._sizeChanged = false;
            this._notify('controlResize', [], { bubbling: true });
        }
    }

    private _isEmptySelection(options: IMultiSelectorOptions): boolean {
        return options.selectedKeys.length === 0 && options.excludedKeys.length === 0;
    }

    private _calculateCount(
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
        const count = counterConfigChanged && selectedKeysCount !== 0 ? null : selectedKeysCount;
        const getCountCallback = (itemsCount) => {
            this._count = itemsCount;
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
                this._loading = true;
                return getCountResult
                    .then((itemsCount) => {
                        getCountCallback(itemsCount);
                    })
                    .catch((error) => {
                        return error;
                    });
            } else {
                getCountCallback(getCountResult);
            }
        }
    }

    private _getCount(
        selection: ISelectionObject,
        count: TCount,
        {
            selectedCountConfig,
            parentProperty,
            selectionCountMode,
            recursiveSelection,
        }: IMultiSelectorOptions
    ): Promise<TCount> | TCount {
        const selectedKeysLength = selection.selected.length;
        let countResult;
        this._cancelCountPromise();
        if (!selectedCountConfig || !selectedKeysLength || this._isCorrectCount(count)) {
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
                selectedCountConfig,
                selectionCountMode,
                recursiveSelection
            );
        }
        return countResult;
    }

    private _resetCountPromise(): void {
        this._countPromise = null;
        this._loading = false;
    }

    private _cancelCountPromise(): void {
        this._resetCountPromise();
    }

    private _getCountBySourceCall(
        selection: ISelectionObject,
        selectionCountConfig: IGetCountCallParams,
        selectionCountMode: IMultiSelectorOptions['selectionCountMode'],
        recursiveSelection: boolean
    ): Promise<number> {
        this._countPromise = new CancelablePromise(
            getCountUtil.getCount(
                selection,
                selectionCountConfig,
                selectionCountMode,
                recursiveSelection
            )
        );
        this._loading = true;
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

    protected _beforeUnmount(): void {
        this._cancelCountPromise();
    }
}
