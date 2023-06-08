import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Memory } from 'Types/source';
import * as template from 'wml!Controls-demo/PropertyGridNew/Preload/Wrapper';
import 'css!Controls-demo/PropertyGridNew/PropertyGrid';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _typeDescription: object[];

    static getLoadConfig(): unknown {
        return {
            propertyGrid: {
                dataFactoryName: 'Controls/dataFactory:PropertyGrid',
                dataFactoryArguments: {
                    editingObject: {
                        dropdown: ['2'],
                        lookup: [1],
                    },
                    typeDescription: [
                        {
                            type: 'list',
                            name: 'dropdown',
                            caption: 'dropdown',
                            editorTemplateName: 'Controls/propertyGrid:DropdownEditor',
                            editorOptions: {
                                keyProperty: 'key',
                                displayProperty: 'title',
                                source: new Memory({
                                    keyProperty: 'key',
                                    data: [
                                        {
                                            key: '1',
                                            icon: 'icon-EmptyMessage',
                                            iconStyle: 'info',
                                            title: 'Message',
                                        },
                                        {
                                            key: '2',
                                            title: 'Report',
                                        },
                                        {
                                            key: '3',
                                            icon: 'icon-TFTask',
                                            title: 'Task',
                                        },
                                        {
                                            key: '4',
                                            title: 'News',
                                            readOnly: true,
                                        },
                                    ],
                                }),
                            },
                        },
                        {
                            type: 'lookup',
                            name: 'lookup',
                            caption: 'lookup',
                            value: [],
                            editorTemplateName: 'Controls/propertyGrid:LookupEditor',
                            editorOptions: {
                                source: new Memory({
                                    keyProperty: 'id',
                                    data: [
                                        {
                                            id: 1,
                                            title: 'Наша компания',
                                        },
                                        {
                                            id: 2,
                                            title: 'Все юридические лица',
                                        },
                                        {
                                            id: 3,
                                            title: 'Инори, ООО',
                                        },
                                    ],
                                }),
                                keyProperty: 'id',
                                displayProperty: 'title',
                                searchParam: 'title',
                                selectorTemplate: {
                                    templateName:
                                        'Controls-demo/LookupNew/Input/SelectorTemplate/resources/SelectorTemplate',
                                    templateOptions: {
                                        headingCaption: 'Выберите организацию',
                                    },
                                    popupOptions: {
                                        width: 500,
                                        height: 500,
                                    },
                                    mode: 'dialog',
                                },
                            },
                        },
                    ],
                },
            },
        };
    }
}
