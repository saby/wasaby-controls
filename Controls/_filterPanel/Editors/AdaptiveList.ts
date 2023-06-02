/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import * as ListTemplate from 'wml!Controls/_filterPanel/Editors/AdaptiveList/AdaptiveList';
import { ISourceOptions, TKey, IHierarchyOptions } from 'Controls/interface';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { factory as CollectionFactory, RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { factory } from 'Types/chain';
import { isEqual } from 'Types/object';

type TViewMode = 'collapsed' | 'expanded';

export interface IAdaptiveListEditorOptions
    extends IControlOptions,
        ISourceOptions,
        IHierarchyOptions {
    propertyValue: TKey[] | TKey;
    sourceController?: SourceController;
    multiSelect?: boolean;
}

/**
 * Компонент-обертка для редактора списка в режиме адаптивности.
 * @private
 */

export default class ListEditor extends Control<IAdaptiveListEditorOptions> {
    protected _template: TemplateFunction = ListTemplate;
    protected _viewMode: TViewMode = 'collapsed';
    protected _roots: RecordSet<Model>;
    protected _selectedKeys: TKey[] = [];

    protected _beforeMount(
        options: IAdaptiveListEditorOptions
    ): void | Promise<void> {
        this._subsrcibeSourceController(options.sourceController);
        this._setRoots(options);
        if (options.propertyValue) {
            this._selectedKeys = options.multiSelect
                ? options.propertyValue
                : [options.propertyValue];
        }
    }

    protected _beforeUpdate(options: IAdaptiveListEditorOptions): void {
        const { sourceController } = options;
        if (sourceController !== this._options.sourceController) {
            this._unsubsrcibeSourceController();
            this._subsrcibeSourceController(options.sourceController);
            this._setRoots(options);
        }
        if (this._options.propertyValue !== options.propertyValue) {
            this._selectedKeys = options.multiSelect
                ? options.propertyValue
                : [options.propertyValue];
        }
    }

    /**
     * Метод получения корневых элементов
     * @param items
     * @param options
     */
    protected _getRoots(
        items: RecordSet<Model>,
        options: IAdaptiveListEditorOptions
    ): RecordSet<Model> {
        if (items) {
            return factory(items)
                .filter((item) => {
                    const parent = item.get(options.parentProperty);
                    if (!parent || parent === options.root) {
                        return true;
                    }
                })
                .value(CollectionFactory.recordSet, {
                    adapter: items.getAdapter(),
                    keyProperty: items.getKeyProperty(),
                    format: items.getFormat(),
                    model: items.getModel(),
                });
        }
    }

    protected _selectedKeysChanged(
        event: SyntheticEvent,
        keys: TKey[],
        added: TKey[]
    ): void {
        if (!this._options.multiSelect) {
            this._selectedKeys = added;
        } else {
            this._selectedKeys = keys;
        }
        let value;
        if (
            !this._selectedKeys.length ||
            isEqual(this._selectedKeys, this._options.resetValue)
        ) {
            value = [];
        } else {
            value = this._options.multiSelect
                ? this._selectedKeys
                : this._selectedKeys[0];
        }
        const extendedValue = {
            value,
            textValue: this._getTextValue(this._selectedKeys),
        };
        this._notify('propertyValueChanged', [extendedValue], {
            bubbling: true,
        });
    }

    protected _beforeUnmount(): void {
        this._unsubsrcibeSourceController();
    }

    private _dataLoadCallback(event: Event, items: RecordSet): void {
        this._setRoots(this._options, items);
    }

    /**
     * Метод установки поля с корневыми элементами
     * @param options
     * @param items
     */
    private _setRoots(
        options: IAdaptiveListEditorOptions,
        items?: RecordSet
    ): void {
        this._roots = this._getRoots(
            items || options.sourceController.getItems(),
            options
        );
    }

    protected _viewModeChanged(): void {
        this._viewMode =
            this._viewMode === 'collapsed' ? 'expanded' : 'collapsed';
    }

    private _unsubsrcibeSourceController(): void {
        this._options.sourceController.unsubscribe(
            'dataLoad',
            this._dataLoadCallback.bind(this)
        );
    }

    private _subsrcibeSourceController(
        sourceController: SourceController
    ): void {
        sourceController.subscribe(
            'dataLoad',
            this._dataLoadCallback.bind(this)
        );
    }

    /**
     * Метод получения текстового значения редактора
     * @param keys
     */
    private _getTextValue(keys: TKey[]): string {
        const text = keys.map((key) => {
            const item = this._roots.getRecordById(key);
            if (item) {
                return item.get(this._options.displayProperty);
            }
        });
        return text.join(', ');
    }
    static getDefaultOptions(): object {
        return {
            root: null,
        };
    }
}
