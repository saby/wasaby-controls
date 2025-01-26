import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Enum } from 'Types/collection';
import { Memory } from 'Types/source';
import * as SearchMemory from 'Controls-demo/Search/SearchMemory';
import * as MemorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';
import * as template from 'wml!Controls-demo/PropertyGridNew/JumpingLabelExtended/Index';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: object = {
        textEditor: 'TextEditorContent',
        stringEditor: 'StringEditorContent',
        numberEditor: 125000,
        dateEditor: new Date(2022, 0, 1),
        enumEditor: new Enum({
            dictionary: ['left', 'right', 'center', 'justify'],
            index: 0,
        }),
        booleanGroupEditor: [true, false, false, true],
        checkboxGroupEditor: [1],
        dropdownEditor: [1],
        dateRangeEditor: [
            new Date(2022, 0, 1, 12, 15, 30, 123),
            new Date(2022, 0, 2, 12, 15, 30, 123),
        ],
        timeIntervalEditor: null,
        flatEnumEditor: new Enum({
            dictionary: ['left', 'right', 'center', 'justify'],
            index: 0,
        }),
        inputMaskEditor: '9999999999',
        phoneEditor: '9999999999',
        logicEditor: true,
    };
    protected _typeDescription: object[];

    protected _beforeMount(): void {
        this._typeDescription = [
            {
                name: 'textEditor',
                caption: 'TextEditor',
                editorOptions: {
                    placeholder: 'TextEditorPlaceholder',
                    minLines: 3,
                    required: true,
                },
                type: 'text',
                group: 'defaultEditors',
            },
            {
                name: 'stringEditor',
                caption: 'StringEditor',
                editorOptions: {
                    placeholder: 'StringEditorPlaceholder',
                    required: true,
                },
                type: 'string',
                group: 'defaultEditors',
            },
            {
                name: 'numberEditor',
                caption: 'NumberEditor',
                editorOptions: {
                    inputConfig: {
                        useGrouping: false,
                        showEmptyDecimals: false,
                        integersLength: 4,
                        precision: 0,
                        onlyPositive: true,
                    },
                    placeholder: 'Placeholder',
                    required: true,
                },
                group: 'defaultEditors',
            },
            {
                name: 'dateEditor',
                caption: 'DateEditor',
                type: 'date',
                group: 'defaultEditors',
            },
            {
                name: 'booleanEditor',
                caption: 'BooleanEditor',
                type: 'boolean',
                group: 'defaultEditors',
            },
            {
                name: 'enumEditor',
                caption: 'EnumEditor',
                type: 'enum',
                group: 'defaultEditors',
                editorOptions: {
                    required: true,
                },
            },
            /**
             * Extended editors
             */
            {
                name: 'booleanGroupEditor',
                caption: 'BooleanGroupEditor',
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
                group: 'extendedEditors',
            },
            {
                name: 'checkboxGroupEditor',
                caption: 'CheckboxGroupEditor',
                editorTemplateName: 'Controls/propertyGridEditors:CheckboxGroup',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'key',
                        data: [
                            {
                                key: 1,
                                title: 'First option',
                            },
                            {
                                key: 2,
                                title: 'Second option',
                            },
                        ],
                    }),
                    keyProperty: 'key',
                },
                group: 'extendedEditors',
            },
            {
                name: 'dropdownEditor',
                caption: 'DropdownEditor',
                editorTemplateName: 'Controls/propertyGridEditors:Dropdown',
                editorOptions: {
                    source: new SearchMemory({
                        keyProperty: 'key',
                        data: [
                            {
                                key: 1,
                                title: 'First option',
                            },
                            {
                                key: 2,
                                title: 'Second option',
                            },
                            {
                                key: 3,
                                title: 'Third option',
                            },
                        ],
                        searchParam: 'title',
                        filter: MemorySourceFilter(),
                    }),
                    keyProperty: 'key',
                    displayProperty: 'title',
                    searchParam: 'title',
                },
                group: 'extendedEditors',
            },
            {
                name: 'dateRangeEditor',
                caption: 'DateRangeEditor',
                editorTemplateName: 'Controls/propertyGridEditors:DateRange',
                editorOptions: {
                    mask: 'DD.MM.YYYY',
                },
                group: 'extendedEditors',
            },
            {
                name: 'timeIntervalEditor',
                caption: 'TimeIntervalEditor',
                editorTemplateName: 'Controls/propertyGridEditors:TimeInterval',
                editorOptions: {
                    mask: 'HH:mm',
                    placeholder: 'TimeIntervalEditorPlaceholder',
                },
                group: 'extendedEditors',
            },
            {
                name: 'flatEnumEditor',
                caption: 'FlatEnumEditor',
                editorTemplateName: 'Controls/propertyGridEditors:FlatEnum',
                editorOptions: {
                    buttons: [
                        {
                            id: 'left',
                            icon: 'icon-AlignmentLeft',
                            tooltip: 'По левому краю',
                        },
                        {
                            id: 'center',
                            icon: 'icon-AlignmentCenter',
                            tooltip: 'По центру',
                        },
                        {
                            id: 'right',
                            icon: 'icon-AlignmentRight',
                            tooltip: 'По правому краю',
                        },
                        {
                            id: 'justify',
                            icon: 'icon-AlignmentWidth',
                            tooltip: 'По ширине',
                        },
                    ],
                },
                group: 'extendedEditors',
            },
            {
                name: 'inputMaskEditor',
                caption: 'InputMaskEditor',
                editorTemplateName: 'Controls/propertyGridEditors:InputMask',
                editorOptions: {
                    mask: '+7(ddd)ddd-dd-dd',
                    placeholder: 'InputMaskEditorPlaceholder',
                },
                group: 'extendedEditors',
            },
            {
                name: 'phoneEditor',
                caption: 'PhoneEditor',
                editorTemplateName: 'Controls/propertyGridEditors:Phone',
                editorOptions: {
                    placeholder: 'PhoneEditorPlaceholder',
                },
                group: 'extendedEditors',
            },
            {
                name: 'logicEditor',
                caption: 'LogicEditor',
                editorTemplateName: 'Controls/propertyGridEditors:Logic',
                group: 'extendedEditors',
            },
            {
                name: 'lookupEditor',
                caption: 'LookupEditor',
                editorTemplateName: 'Controls/propertyGridEditors:Lookup',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'key',
                        data: [
                            { id: 1, title: 'Sasha', text: 'test' },
                            { id: 2, title: 'Dmitry', text: 'test' },
                        ],
                    }),
                    keyProperty: 'key',
                    displayProperty: 'title',
                    searchParam: 'title',
                    selectorTemplate: {
                        templateName:
                            'Controls-demo/PropertyGridNew/Editors/Lookup/resources/SelectorTemplate',
                        templateOptions: {
                            headingCaption: 'Выберите',
                        },
                        popupOptions: {
                            width: 500,
                        },
                    },
                    placeholder: 'LookupEditorPlaceholder',
                },
                group: 'extendedEditors',
            },
        ];
    }

    static _styles: string[] = ['Controls-demo/PropertyGridNew/PropertyGrid'];
}
