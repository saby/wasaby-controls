import * as React from 'react';
import { Memory } from 'Types/source';
import { View as FilterView } from 'Controls-ListEnv/filterConnected';
import { View as ListView } from 'Controls/list';
import * as filter from './DataFilter';
import 'css!Controls-ListEnv-demo/Filter/View/Editors/TagEditor/Index';

export const tagItems = [
    {
        id: 'null',
        title: 'Цвет не задан',
    },
    {
        id: 'pink',
        title: 'Розовый',
        backgroundColor: 'tagColorPink',
    },
    {
        id: 'green',
        title: 'Зеленый',
        backgroundColor: 'success',
    },
    {
        id: 'blue',
        title: 'Голубой',
        backgroundColor: 'tagColorBlue',
    },
    {
        id: 'orange',
        title: 'Оранжевый',
        backgroundColor: 'danger',
    },
];

export const tagEditorConfig = {
    name: 'tags',
    value: null,
    resetValue: null,
    caption: 'Тег',
    viewMode: 'extended',
    editorTemplateName: 'Controls-ListEnv/filterPanelExtEditors:TagEditor',
    type: 'filterPopupList',
    editorOptions: {
        cloudBackgroundStyleProperty: 'backgroundColor',
        extendedCaption: 'Тег',
        source: new Memory({
            keyProperty: 'id',
            data: tagItems,
        }),
        displayProperty: 'title',
        keyProperty: 'id',
        selectorTemplate: {
            templateName: 'Controls-ListEnv-demo/FilterPanel/View/resources/DialogTemplate',
            templateOptions: {
                items: tagItems,
                headingCaption: 'Выберите тег',
            },
            mode: 'dialog',
        },
    },
};

const filterNames = ['tags'];

const TagEditorFilterDemo = React.forwardRef((_, ref) => {
    return (
        <div ref={ref} className="engineDemo__wrapper ws-flexbox">
            <FilterView filterNames={filterNames} storeId="tags" alignment="left" />
            <ListView storeId="tags" />
        </div>
    );
});

TagEditorFilterDemo.getLoadConfig = function () {
    return {
        tags: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                filterDescription: [tagEditorConfig],
                source: new Memory({
                    data: [
                        {
                            tag: 'pink',
                            title: 'Розовый тег',
                        },
                        {
                            tag: 'green',
                            title: 'Зеленый тег',
                        },
                        {
                            tag: 'orange',
                            title: 'Оранжевый тег',
                        },
                    ],
                    keyProperty: 'tag',
                    filter,
                }),
                keyProperty: 'tag',
                displayProperty: 'title',
            },
        },
    };
};

export default TagEditorFilterDemo;
