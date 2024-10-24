import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/EditInPlace/EditingRow/EditingRow';
import { Memory } from 'Types/source';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Model } from 'Types/entity';
import { IColumn } from 'Controls/grid';
import * as cellTemplate from 'wml!Controls-demo/gridNew/EditInPlace/EditingRow/cellTemplate';
import { Ports } from 'Controls-demo/gridNew/DemoHelpers/Data/Ports';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Ports.getData().map((cur) => {
        return ((data) => {
            for (const key in data) {
                if (data[key]) {
                    data[key] = '' + data[key];
                } else {
                    data[key] = '';
                }
            }
            return data;
        })(cur);
    });
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _documentSignMemory: Memory;
    protected selectedKey: number = 1;
    protected _fakeId: number = 100;

    protected _beforeMount(): void {
        this._cellTemplate = cellTemplate;

        this._documentSignMemory = new Memory({
            keyProperty: 'key',
            data: Ports.getDocumentSigns(),
        });
    }

    protected _colspanCallback(
        item: Model,
        column: IColumn,
        columnIndex: number,
        isEditing: boolean
    ) {
        if (isEditing && columnIndex === 0) {
            return 'end';
        }
    }

    protected _onBeforeBeginEdit(e, options, isAdd) {
        if (isAdd && !options.item) {
            return {
                item: new Model({
                    keyProperty: 'key',
                    rawData: {
                        key: ++this._fakeId,
                        name: '',
                        invoice: '0',
                        documentSign: '0',
                        documentNum: '0',
                        taxBase: '0',
                        document: '',
                        documentDate: null,
                        serviceContract: null,
                        description: '',
                        shipper: null,
                    },
                }),
            };
        }
    }

    private onChange1 = (_: SyntheticEvent, name: string, item: Model, value: number): void => {
        item.set(name, value);
    };

    private onChange2 = (_: SyntheticEvent, key: number): void => {
        this.selectedKey = key;
    };

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditInPlaceEditingRow: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    }
}
