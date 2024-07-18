import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as explorerImages from 'Controls-demo/Explorer/ExplorerImagesLayout';
import { generateData } from 'Controls-demo/tileNew/DataHelpers/ForScroll';
import { RecordSet } from 'Types/collection';
import { HierarchicalMemory } from 'Types/source';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/ToggleImageVisible/ImagePropertyValueChanged/ImagePropertyValueChanged';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

function getData() {
    return generateData(1, [0], true).concat(generateData(100).slice(1));
}

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
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
        this._itemsReadyCallback = this._itemsReadyCallback.bind(this);
    }

    protected _itemsReadyCallback(records: RecordSet): void {
        this._records = records;
    }

    protected _toggleImage(): void {
        if (this._records) {
            const record = this._records.getRecordById(14);
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

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ImagePropertyValueChanged: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    navigation: {
                        source: 'page',
                        view: 'infinity',
                        sourceConfig: {
                            hasMore: false,
                            page: 0,
                            pageSize: 20,
                        },
                    },
                    root: null,
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    multiSelectVisibility: 'hidden',
                },
            },
        };
    },
});
