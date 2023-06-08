import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as explorerImages from 'Controls-demo/Explorer/ExplorerImagesLayout';
import { generateData } from 'Controls-demo/tileNew/DataHelpers/ForScroll';
import { RecordSet } from 'Types/collection';
import { HierarchicalMemory } from 'Types/source';
import {
    INavigationOptionValue,
    INavigationSourceConfig,
} from 'Controls/interface';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/ToggleImageVisible/ImagePropertyValueChanged/ImagePropertyValueChanged';

const data = generateData(1, [0], true).concat(generateData(100));

export default class ImagePropertyValueChanged extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory = null;
    protected _navigation: INavigationOptionValue<INavigationSourceConfig>;
    protected _fallbackImage: string = `${explorerImages[0]}`;
    protected _imageAdded: boolean;
    protected _imagePosition: string = 'left';
    protected _gradientEnabled: boolean;
    private _records: RecordSet;

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            parentProperty: 'parent',
            data,
        });
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

    protected _toggleImage(): void {
        if (this._records) {
            const record = this._records.at(14);
            if (!this._imageAdded) {
                this._imageAdded = true;
                record.set('image', explorerImages[8]);
            } else {
                this._imageAdded = false;
                record.set('image', null);
            }
        }
    }

    protected _toggleGradient(): void {
        this._gradientEnabled = !this._gradientEnabled;
        this._imagePosition = this._gradientEnabled ? 'top' : 'left';
    }
}
