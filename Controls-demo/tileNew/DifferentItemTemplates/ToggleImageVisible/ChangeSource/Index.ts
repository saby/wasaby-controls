import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as explorerImages from 'Controls-demo/Explorer/ExplorerImagesLayout';
import { generateData } from 'Controls-demo/tileNew/DataHelpers/ForScroll';
import { RecordSet } from 'Types/collection';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/ToggleImageVisible/ChangeSource/ChangeSource';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

function getData() {
    return generateData(1, [0], true).concat(generateData(100));
}

function getSource(): HierarchicalMemory {
    return new HierarchicalMemory({
        keyProperty: 'key',
        parentProperty: 'parent',
        data: getData(),
    });
}

function getEmptySource(): HierarchicalMemory {
    return new HierarchicalMemory({
        keyProperty: 'key',
        parentProperty: 'parent',
        data: [],
    });
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _fallbackImage: string = `${explorerImages[0]}`;
    protected _isEmptySource: boolean = true;
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

    protected _toggleSource(): void {
        this._isEmptySource = !this._isEmptySource;
        const slice = this._options._dataOptionsValue.listData0;
        slice.setState({
            source: this._isEmptySource ? getEmptySource() : getSource(),
        });
        this._children.tile.reload();
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData0: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: getSource(),
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
