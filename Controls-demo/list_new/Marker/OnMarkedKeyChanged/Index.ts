import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import { CrudEntityKey, Memory } from 'Types/source';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

import * as Template from 'wml!Controls-demo/list_new/Marker/OnMarkedKeyChanged/OnMarkedKeyChanged';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

function getData() {
    return [
        {
            key: 1,
            title: 'На записи разрешена установка маркера',
            markable: true,
        },
        {
            key: 2,
            title: 'На записи запрещена установка маркера',
            markable: false,
        },
        {
            key: 3,
            title: 'На записи разрешена установка маркера',
            markable: true,
        },
    ];
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _markedKey: CrudEntityKey;
    protected _boundItemsReadyCallback: Function;
    protected _items: RecordSet;

    _onMarkedKeyChanged(event: SyntheticEvent, key: CrudEntityKey): void {
        const item = this._items.getRecordById(key);
        if (item && item.get('markable') === true) {
            this._markedKey = key;
            this._options._dataOptionsValue.MarkerOnMarkedKeyChanged5.setState({
                markedKey: this._markedKey,
            });
        }
    }

    _itemsReadyCallback(items: RecordSet): void {
        this._items = items;
    }

    protected _beforeMount(): void {
        this._boundItemsReadyCallback = this._itemsReadyCallback.bind(this);
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            MarkerOnMarkedKeyChanged5: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    markerVisibility: 'visible',
                },
            },
        };
    },
});
