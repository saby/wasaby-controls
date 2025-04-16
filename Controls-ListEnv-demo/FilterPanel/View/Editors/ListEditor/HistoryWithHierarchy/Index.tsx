import * as React from 'react';
import { View } from 'Controls-ListEnv/filterPanelConnected';
import { View as List } from 'Controls/list';
import * as filter from './DataFilter';
import * as listFilter from './ListDataFilter';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';
import { Memory } from 'Types/source';
import { FilterMemory } from './filterSource';

const Index = React.forwardRef((props, ref) => {
    return (
        <div ref={ref} className="engine-demo__Widgets_filter-container">
            <View storeId="departments" filterNames="['department']" />
            <List storeId="departments" />
        </div>
    );
});

Index.getLoadConfig = () => {
    return {
        departments: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new Memory({
                    data: getData(),
                    keyProperty: 'department',
                    filter: listFilter,
                }),
                filterDescription: [
                    {
                        name: 'department',
                        resetValue: null,
                        value: 'Разработка',
                        textValue: '',
                        editorTemplateName: 'Controls/filterPanel:ListEditor',
                        editorOptions: {
                            historyId: 'myHistoryId',
                            keyProperty: 'department',
                            displayProperty: 'title',
                            source: new FilterMemory({
                                data: getData(),
                                keyProperty: 'department',
                                filter,
                                historyId: 'myHistoryId',
                            }),
                            parentProperty: 'parent',
                            nodeProperty: '@parent',
                            selectorTemplate: {
                                templateName:
                                    'Controls-ListEnv-demo/FilterPanel/View/resources/DialogTemplate',
                                templateOptions: { items: getData() },
                                popupOptions: {
                                    width: 500,
                                },
                                mode: 'dialog',
                            },
                            navigation: {
                                source: 'page',
                                view: 'page',
                                sourceConfig: {
                                    pageSize: 4,
                                    page: 0,
                                    hasMore: false,
                                },
                            },
                        },
                    },
                ],
                displayProperty: 'department',
                keyProperty: 'department',
            },
        },
    };
};

function getData() {
    return [
        {
            id: 1,
            department: 'Разработка',
            title: 'Разработка',
            parent: null,
            '@parent': true,
        },
        {
            id: 11,
            department: 'Платформа',
            title: 'Платформа',
            parent: 'Разработка',
            '@parent': null,
        },
        {
            id: 12,
            department: 'Каталоги',
            title: 'Каталоги',
            parent: 'Разработка',
            '@parent': null,
        },
        {
            id: 3,
            department: 'Федеральная клиентская служба',
            title: 'Федеральная клиентская служба',
            parent: null,
            '@parent': null,
        },
        {
            id: 2,
            department: 'Продвижение СБИС',
            title: 'Продвижение СБИС',
            parent: null,
            '@parent': null,
        },
    ];
}

export default Index;
