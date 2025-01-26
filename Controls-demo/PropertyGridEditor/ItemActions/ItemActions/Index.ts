import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridEditor/ItemActions/ItemActions/Index';
import { showType } from 'Controls/toolbars';
import { IItemAction } from 'Controls/itemActions';
import { Confirmation } from 'Controls/popup';
import 'wml!Controls-demo/PropertyGridEditor/ItemActions/ItemActions/ItemTemplate';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _typeDescription: object[] = [
        {
            name: 'number',
            caption: 'Number',
            editorTemplateName: 'Controls/propertyGridEditors:Number',
            editorOptions: {
                inputConfig: {
                    useGrouping: false,
                    showEmptyDecimals: false,
                    integersLength: 4,
                    precision: 0,
                    onlyPositive: true,
                },
            },
        },
        {
            caption: 'String',
            name: 'siteUrl',
            editorTemplateName: 'Controls/propertyGridEditors:String',
        },
        {
            name: 'decoration',
            caption: 'BooleanGroup',
            editorTemplateName: 'Controls/propertyGridEditors:BooleanGroup',
            editorOptions: {
                buttons: [
                    {
                        id: 0,
                        tooltip: 'Полужирный',
                        icon: 'icon-Bold',
                    },
                    {
                        id: 1,
                        tooltip: 'Курсив',
                        icon: 'icon-Italic',
                    },
                    {
                        id: 2,
                        tooltip: 'Подчеркнутый',
                        icon: 'icon-Underline',
                    },
                    {
                        id: 3,
                        tooltip: 'Зачёркнутый',
                        icon: 'icon-Stroked',
                    },
                ],
            },
        },
    ];
    protected _editingObject: object = {
        number: 55,
        string: 'text',
        decoration: [true, true, false, true],
    };
    protected _itemActions: IItemAction[] = [
        {
            id: 1,
            icon: 'icon-Edit',
            iconStyle: 'secondary',
            title: 'edit',
            showType: showType.MENU,
            handler: (item) => {
                return this._openConfirmation(`Edit clicked at ${item.getId()}`);
            },
        },
        {
            id: 2,
            icon: 'icon-Erase',
            iconStyle: 'danger',
            title: 'delete',
            showType: showType.MENU,
            handler: (item) => {
                return this._openConfirmation(`Delete clicked at ${item.getId()}`);
            },
        },
    ];

    protected _openConfirmation(message: string) {
        Confirmation.openPopup({ message, type: 'ok' });
    }

    static _styles: string[] = ['Controls-demo/PropertyGridEditor/PropertyGridEditor'];
}
