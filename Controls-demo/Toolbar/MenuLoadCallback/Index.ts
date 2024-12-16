import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/Toolbar/MenuLoadCallback/Template');
import { Memory } from 'Types/source';
import 'css!DemoStand/Controls-demo';
import { showType } from 'Controls/toolbars';
import { RecordSet } from 'Types/collection';

class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;
    protected _menuSource: Memory;

    protected _beforeMount(): void {
        this._menuLoadCallback = this._menuLoadCallback.bind(this);
        this._menuSource = new Memory({
            keyProperty: 'id',
            data: [
                {
                    id: '7',
                    showType: showType.MENU,
                    icon: 'icon-Groups',
                    title: 'Совещания',
                    '@parent': false,
                    parent: null,
                    additional: true,
                },
                {
                    id: '2',
                    icon: 'icon-Linked',
                    viewMode: 'ghost',
                    contrastBackground: true,
                    title: 'Связанные документы',
                    showType: showType.MENU,
                    '@parent': true,
                    parent: null,
                },
                {
                    id: '8',
                    showType: showType.MENU,
                    icon: 'icon-Report',
                    title: 'Список задач',
                    '@parent': true,
                    parent: null,
                    additional: true,
                },
                {
                    id: '21',
                    showType: showType.MENU,
                    title: 'Проекту',
                    viewMode: 'link',
                    '@parent': false,
                    parent: '2',
                },
                {
                    id: '22',
                    showType: showType.MENU,
                    title: 'Этапу',
                    '@parent': false,
                    parent: '2',
                },
                {
                    id: '81',
                    showType: showType.MENU,
                    title: 'Согласование',
                    '@parent': true,
                    parent: '8',
                },
                {
                    id: '811',
                    showType: showType.MENU,
                    title: 'Срок',
                    '@parent': false,
                    parent: '81',
                },
                {
                    id: '812',
                    showType: showType.MENU,
                    title: 'План',
                    '@parent': false,
                    parent: '81',
                },
                {
                    id: '82',
                    showType: showType.MENU,
                    title: 'Задача',
                    '@parent': false,
                    parent: '8',
                },
                {
                    id: '9',
                    viewMode: 'icon',
                    icon: 'icon-ArrangePreview',
                    showType: showType.MENU,
                    title: 'Вид',
                    '@parent': true,
                    parent: null,
                },
                {
                    id: '91',
                    showType: showType.MENU,
                    icon: 'icon-ArrangePreview',
                    isUpdateIcon: true,
                    title: 'Плитка',
                    '@parent': false,
                    parent: '9',
                },
                {
                    id: '92',
                    showType: showType.MENU,
                    icon: 'icon-Burger',
                    isUpdateIcon: true,
                    title: 'Список',
                    '@parent': false,
                    parent: '9',
                },
            ],
        });
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: '1',
                    icon: 'icon-Time',
                    viewMode: 'filled',
                    buttonStyle: 'pale',
                    inlineHeight: 'l',
                    '@parent': false,
                    title: 'Отметить время',
                    parent: null,
                },
                {
                    id: '3',
                    viewMode: 'icon',
                    icon: 'icon-Link',
                    title: 'Скопировать в буфер',
                    '@parent': false,
                    parent: null,
                },
                {
                    id: '4',
                    icon: 'icon-EmptyMessage',
                    showHeader: true,
                    viewMode: 'link',
                    showType: showType.TOOLBAR,
                    contrastBackground: true,
                    title: 'Обсудить',
                    '@parent': true,
                    parent: null,
                },
            ],
        });
    }

    protected _menuLoadCallback(items: RecordSet): void {
        items.each((item) => {
            item.set('iconStyle', 'danger');
        });
    }
}

export default Base;
