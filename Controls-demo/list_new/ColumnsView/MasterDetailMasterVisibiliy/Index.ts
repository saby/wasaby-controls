import { Control, TemplateFunction } from 'UI/Base';
import * as data from 'Controls-demo/DragNDrop/MasterDetail/Data';
import { HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import 'css!Controls-demo/DragNDrop/MasterDetail/MasterDetail';
import template = require('wml!Controls-demo/list_new/ColumnsView/MasterDetailMasterVisibiliy/MasterDetailMasterVisibiliy');

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;
    protected gridColumns: IColumn[] = [
        {
            displayProperty: 'name',
            width: '1fr',
        },
    ];
    protected _currentIcon: string = 'ArrangeList04';
    protected _masterVisibility: string = null;

    protected _toggleMaster(): void {
        this._currentIcon =
            this._currentIcon === 'ArrangeList04' ? 'ArrangeList03' : 'ArrangeList04';
        this._masterVisibility = this._masterVisibility === 'hidden' ? 'visible' : 'hidden';
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            master: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    keyProperty: 'id',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: data.master,
                    }),
                    markerVisibility: 'visible',
                },
            },
            detail: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    keyProperty: 'id',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: data.detail,
                    }),
                    markerVisibility: 'visible',
                },
            },
        };
    }
}
