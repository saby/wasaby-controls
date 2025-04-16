import { forwardRef } from 'react';
import ExtSearch from 'Controls-ListEnv/ExtSearch';
import SearchMemory from 'Controls-ListEnv-demo/ExtSearch/resources/SearchMemory';
import 'Controls-ListEnv-demo/ExtSearch/GroupTemplate/GroupTemplate';
import 'css!Controls-ListEnv-demo/ExtSearch/Input';

const cities = [
    {
        id: 'Yaroslavl',
        title: 'Ярославль',
        region: 'ЦФО',
    },
    { id: 'Moscow', title: 'Москва', region: 'ЦФО' },
    { id: 'Kazan', title: 'Казань', region: 'ПФО' },
    { id: 'Rostov', title: 'Ростов', region: 'ЮФО' },
    { id: 'Saint Petersburg', title: 'Санкт-Петербург', region: 'СЗФО' },
    { id: 'Anapa', title: 'Анапа', region: 'ЮФО' },
    { id: 'Belgorod', title: 'Белгород', region: 'ЦФО' },
    { id: 'Veliky Novgorod', title: 'Великий Новгород', region: 'СЗФО' },
];

const filterDescription = [
    {
        name: 'city',
        caption: 'Город',
        editorTemplateName: 'Controls/filterPanelEditors:Lookup',
        type: 'list',
        resetValue: [],
        value: [],
        textValue: '',
        viewMode: 'basic',
        editorOptions: {
            source: new SearchMemory({
                keyProperty: 'id',
                data: cities,
            }),
            displayProperty: 'title',
            keyProperty: 'id',
            searchParam: 'title',
            suggestProps: {
                groupProperty: 'region',
                groupTemplate: 'Controls-ListEnv-demo/ExtSearch/GroupTemplate/GroupTemplate',
            },
        },
    },
];

export default forwardRef(function ExtSearchGroupDemo(_, ref) {
    return (
        <div ref={ref} className="search_Input-demo_wrapper">
            <ExtSearch
                className="engineDemo-ExtSearch-suggest demo-SuggestNew__withTabs"
                searchParam="title"
                filterDescription={filterDescription}
            ></ExtSearch>
        </div>
    );
});
