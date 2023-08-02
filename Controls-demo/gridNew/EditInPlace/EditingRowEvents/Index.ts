import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/EditInPlace/EditingRowEvents/EditingRowEvents';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { IColumn } from 'Controls/grid';
import * as cellTemplate from 'wml!Controls-demo/gridNew/EditInPlace/EditingRowEvents/cellTemplate';
import { Ports } from 'Controls-demo/gridNew/DemoHelpers/Data/Ports';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Ports.getData().map((cur) => {
        return ((data) => {
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    data[key] = `${data[key]}` || '';
                }
            }
            return data;
        })(cur);
    });
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _documentSignMemory: Memory;
    private selectedKey: number = 1;
    private _fakeId: number = 100;
    private _cellTemplate: TemplateFunction;
    private _mouseDownLog: string[] = [];

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: this.data,
        });

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
    ): 'end' {
        if (isEditing && columnIndex === 0) {
            return 'end';
        }
    }

    protected _onBeforeBeginEdit(
        e: Event,
        options: {
            item: Model;
        },
        isAdd: boolean
    ) {
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

    _onMouseDown() {
        this._mouseDownLog.push('on:mousedown');
    }

    _clearLog = () => {
        this._mouseDownLog = [];
    };

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
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
