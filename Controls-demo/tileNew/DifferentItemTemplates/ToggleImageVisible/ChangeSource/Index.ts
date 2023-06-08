import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as explorerImages from 'Controls-demo/Explorer/ExplorerImagesLayout';
import { generateData } from 'Controls-demo/tileNew/DataHelpers/ForScroll';
import { RecordSet } from 'Types/collection';
import { HierarchicalMemory } from 'Types/source';
import {
    INavigationOptionValue,
    INavigationSourceConfig,
} from 'Controls/interface';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/ToggleImageVisible/ChangeSource/ChangeSource';

const data = generateData(1, [0], true).concat(generateData(100));

export default class ImagePropertyValueChanged extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory = null;
    protected _navigation: INavigationOptionValue<INavigationSourceConfig>;
    protected _fallbackImage: string = `${explorerImages[0]}`;
    protected _isEmptySource: boolean = true;
    private _records: RecordSet;
    private _dataSource: HierarchicalMemory = new HierarchicalMemory({
        keyProperty: 'key',
        parentProperty: 'parent',
        data,
    });
    private _emptySource: HierarchicalMemory = new HierarchicalMemory({
        keyProperty: 'key',
        parentProperty: 'parent',
        data: [],
    });

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._initSource();
        this._navigation = {
            source: 'page',
            view: 'infinity',
            sourceConfig: {
                hasMore: false,
                page: 0,
                pageSize: 20,
            },
        };
        this._itemsReadyCallback = this._itemsReadyCallback.bind(this);
    }

    protected _itemsReadyCallback(records: RecordSet): void {
        this._records = records;
    }

    protected _toggleSource(): void {
        this._isEmptySource = !this._isEmptySource;
        this._initSource();
        this._children.tile.reload();
    }

    private _initSource(): void {
        this._viewSource = this._isEmptySource
            ? this._emptySource
            : this._dataSource;
    }
}
