import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import template = require('wml!Controls-demo/FocusWithEnter/FocusWithEnter');

import 'wml!Controls-demo/gridNew/EditInPlace/EditingCell/_cellEditor';
import { Editing } from 'Controls-demo/gridNew/DemoHelpers/Data/Editing';
import { IColumnRes } from 'Controls-demo/gridNew/DemoHelpers/DataCatalog';
import { RecordSet } from 'Types/collection';
import { data } from 'Controls-demo/Toolbar/resources/toolbarItems';

class FocusWithEnter extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _comboboxSource: Memory = null;
    protected _handbookSource: Memory = null;
    protected _gridSource: Memory = null;
    protected _gridSource2: Memory = null;
    protected _markedKey1: string | number = null;
    protected _markedKey2: string | number = null;
    protected _gridColumns: IColumnRes[] = Editing.getEditingColumns();
    protected _keyProperty: string = 'id';
    protected _displayProperty: string = 'title';
    protected _dateValue: Date = null;
    protected _textValue: string = 'some text';
    protected _numberValue1: number = 0;
    protected _numberValue2: number = 0;
    protected _phoneValue: string = '8888888888';
    protected _flagValue: boolean = false;
    protected _handbookSelectedKeys: string[];
    protected _selectedKey: string | null = '1';
    protected _selectedKey1: string | null = '1';
    protected _selectedKey2: string | null = '11';
    protected _dblSwitchValue: boolean = false;
    protected _toolbarItems: RecordSet;

    protected _radioGroupSelectedKey1: string = '1';
    protected _radioGroupSource1: Memory;
    protected _radioGroupSelectedKey2: string = '1';
    protected _radioGroupSource2: Memory;
    protected _items1: RecordSet;
    protected _items2: RecordSet;

    protected _beforeMount(cfg: IControlOptions): void {
        this._toolbarItems = new RecordSet({
            keyProperty: 'id',
            rawData: data.getDefaultItemsWithoutToolButton(),
        });
        this._dateValue = new Date();
        this._handbookSelectedKeys = ['1'];
        this._items1 = new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'Название 1',
                },
                {
                    id: '2',
                    caption: 'Название 2',
                },
                {
                    id: '3',
                    caption: 'Название 3',
                },
                {
                    id: '4',
                    caption: 'Название 4',
                },
                {
                    id: '5',
                    caption: 'Название 5',
                },
                {
                    id: '6',
                    caption: 'Название 6',
                },
            ],
            keyProperty: 'id',
        });
        this._items2 = new RecordSet({
            rawData: [
                {
                    id: '11',
                    caption: '1',
                },
                {
                    id: '12',
                    caption: '2',
                },
                {
                    id: '13',
                    caption: '3',
                },
                {
                    id: '14',
                    caption: '4',
                },
                {
                    id: '15',
                    caption: '5',
                },
                {
                    id: '16',
                    caption: '6',
                },
            ],
            keyProperty: 'id',
        });
        this._radioGroupSource1 = new Memory({
            keyProperty: 'id',
            displayProperty: 'caption',
            data: [
                {
                    id: '1',
                    title: 'State1',
                    caption: 'Additional caption1',
                    parent: null,
                    node: true,
                },
                {
                    id: '11',
                    title: 'State11',
                    caption: 'Additional caption11',
                    parent: '1',
                    node: false,
                },
                {
                    id: '12',
                    title: 'State12',
                    caption: 'Additional caption12',
                    parent: '1',
                    node: false,
                },
                {
                    id: '2',
                    title: 'State2',
                    caption: 'Additional caption2',
                    readOnly: true,
                    parent: null,
                    node: false,
                },
                {
                    id: '3',
                    title: 'State3',
                    caption: 'Additional caption3',
                    parent: null,
                    node: false,
                },
                {
                    id: '4',
                    title: 'State4',
                    caption: 'Additional caption4',
                    parent: null,
                    node: true,
                },
                {
                    id: '41',
                    title: 'State41',
                    caption: 'Additional caption41',
                    parent: '4',
                    node: false,
                },
                {
                    id: '42',
                    title: 'State42',
                    caption: 'Additional caption42',
                    readOnly: true,
                    parent: '4',
                    node: false,
                },
                {
                    id: '43',
                    title: 'State43',
                    caption: 'Additional caption43',
                    parent: '4',
                    node: false,
                },
                {
                    id: '5',
                    title: 'State5',
                    caption: 'Additional caption5',
                    parent: null,
                    node: false,
                },
                {
                    id: '6',
                    title: 'State6',
                    caption: 'Additional caption6',
                    parent: null,
                    node: false,
                },
            ],
        });
        this._radioGroupSource2 = new Memory({
            keyProperty: 'id',
            displayProperty: 'caption',
            data: [
                {
                    id: '1',
                    title: 'State1',
                    caption: 'Additional caption1',
                },
                {
                    id: '2',
                    title: 'State2',
                    caption: 'Additional caption2',
                    readOnly: true,
                },
                {
                    id: '3',
                    title: 'State3',
                    caption: 'Additional caption3',
                },
                {
                    id: '4',
                    title: 'State4',
                    caption: 'Additional caption4',
                },
                {
                    id: '5',
                    title: 'State5',
                    caption: 'Additional caption5',
                },
                {
                    id: '6',
                    title: 'State6',
                    caption: 'Additional caption6',
                },
            ],
        });

        const sourceRawData = [
            { id: '1', title: 'Красный', description: 'Стоп!' },
            { id: '2', title: 'Желтый', description: 'Жди!' },
            { id: '3', title: 'Зеленый', description: 'Поехали!' },
        ];

        this._comboboxSource = new Memory({
            keyProperty: this._keyProperty,
            data: sourceRawData,
        });
        this._handbookSource = new Memory({
            keyProperty: this._keyProperty,
            data: sourceRawData,
        });

        this._gridSource = new Memory({
            keyProperty: 'key',
            data: Editing.getEditingData(),
        });

        this._gridSource2 = new Memory({
            keyProperty: 'key',
            data: Editing.getEditingData(),
        });
    }

    /**
     * Происходит при деактивации контрола
     */
    protected _deactivatedHandlerList1(): void {
        this._markedKey1 = null;
    }
    protected _deactivatedHandlerList2(): void {
        this._markedKey2 = null;
    }

    static _styles: string[] = ['Controls-demo/FocusWithEnter/FocusWithEnter'];
}
export default FocusWithEnter;
