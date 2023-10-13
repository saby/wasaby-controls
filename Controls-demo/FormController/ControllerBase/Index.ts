import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/FormController/ControllerBase/Index');
import { RecordSet } from 'Types/collection';
import { StackOpener } from 'Controls/popup';
import { Model } from 'Types/entity';
import { Memory } from 'Types/source';
import { SyntheticEvent } from 'UI/Vdom';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { mergeRecord, addRecord } from 'Controls/Utils/RecordSynchronizer';
import 'Controls-demo/FormController/ControllerBase/PopupTemplate/PopupTemplate';

const columns: IColumn[] = [
    {
        displayProperty: 'id',
        width: '1fr',
    },
    {
        displayProperty: 'operation',
        width: '1fr',
    },
    {
        displayProperty: 'storage',
        width: '1fr',
    },
    {
        displayProperty: 'milestone',
        width: '1fr',
    },
    {
        displayProperty: 'branch',
        width: '1fr',
    },
];

const header: IHeaderCell[] = [
    {
        caption: 'id',
    },
    {
        caption: 'Регламент',
    },
    {
        caption: 'Хранилище',
    },
    {
        caption: 'Веха',
    },
    {
        caption: 'Ветка',
    },
];

function getData() {
    return [
        {
            id: 1,
            operation: 'Ошибка',
            storage: 'Controls',
            milestone: '3.7.5 online/inside (3.7.5 Platforma)',
            branch: '3.7.5/bugfix/fix_bug',
        },
        {
            id: 2,
            operation: 'Ошибка',
            storage: 'Engine',
            milestone: '19.2100 online/inside (19.2000 Platforma)',
            branch: '19.2100/bugfix/fix_bug',
        },
        {
            id: 3,
            operation: 'Задача',
            storage: 'Controls',
            milestone: '20.2100 online/inside (20.2000 Platforma)',
            branch: '20.2100/feature/make_cool',
        },
        {
            id: 4,
            operation: 'Ошибка',
            storage: 'Controls',
            milestone: '21.2100 online/inside (21.2000 Platforma)',
            branch: '21.2100/bugfix/fix_bug',
        },
    ];
}

class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _stackOpener: StackOpener = new StackOpener({
        template: 'Controls-demo/FormController/ControllerBase/PopupTemplate/PopupTemplate',
        width: 900,
    });
    protected _items: RecordSet;
    protected _gridColumns: IColumn[] = columns;
    protected _gridHeader: IColumn[] = header;

    protected _itemsReadyCallback: Function = (items: RecordSet) => {
        this._items = items;
    };

    protected _itemClickHandler(event: SyntheticEvent<MouseEvent>, item: Model): void {
        this._openDialog(item.clone());
    }

    protected _createClickHandler(): void {
        const key = this._items.getCount() + 1;
        const newModel = new Model({
            keyProperty: this._items.getKeyProperty(),
            format: this._items.getFormat(),
            rawData: {
                id: key,
            },
        });
        this._openDialog(newModel, true);
    }

    protected _openDialog(record: Model, isCreate?: boolean): void {
        this._stackOpener.open({
            opener: this,
            templateOptions: {
                record,
                isNewRecord: isCreate,
                saveCallback: (crecord: Model, isNewRecord?: boolean): void => {
                    const items = this._children.grid.getItems();
                    if (isNewRecord) {
                        addRecord(crecord, {}, items);
                    } else {
                        mergeRecord(crecord, items, crecord.getKey());
                    }
                },
            },
        });
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            FormControllerBase: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'id',
                        data: getData(),
                    }),
                },
            },
        };
    }
}

export default Demo;
