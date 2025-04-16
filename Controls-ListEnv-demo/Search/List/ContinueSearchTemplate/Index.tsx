import * as React from 'react';
import { View } from 'Controls/list';
import { Container as ScrollContainer } from 'Controls/scroll';
import { View as FilterSearchView } from 'Controls-ListEnv/filterSearchConnected';
import { Continue } from 'Controls-ListEnv/listSearchHints';
import PortionedSearchMemory from 'Controls-ListEnv-demo/Search/List/DataHelpers/PortionedSearchMemory';
import {
    companyBasicFilter,
    deletedExtendedFilter,
} from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import { useSlice } from 'Controls-DataEnv/context';

const SEARCH_HINT_FILTER_NAMES = ['deleted', 'company'];
const FILTER_VALUES = {
    deleted: {
        value: true,
        textValue: 'Удаленные',
    },
};
const VIRTUAL_SCROLL_CONFIG = { pageSize: 15 };

function MyContinueSearchTemplate(props) {
    return (
        <Continue
            {...props}
            filterNames={SEARCH_HINT_FILTER_NAMES}
            filterValues={FILTER_VALUES}
            storeId="continueSearch"
            details={
                <span>
                    Просмотр некоторых сотрудников может быть ограничен - обратитесь к
                    администратору
                </span>
            }
        />
    );
}

const ContinueSearchTemplateDemo = React.forwardRef(function (_, ref) {
    const slice = useSlice('continueSearch');
    React.useEffect(() => {
        slice?.state?.source.setLongLoad(true);
    });
    return (
        <div ref={ref}>
            <FilterSearchView className="controlsDemo__maxWidth500" storeId="continueSearch" />
            <ScrollContainer className="controlsDemo__height300">
                <View
                    storeId="continueSearch"
                    continueSearchTemplate={MyContinueSearchTemplate}
                    virtualScrollConfig={VIRTUAL_SCROLL_CONFIG}
                />
            </ScrollContainer>
        </div>
    );
});

ContinueSearchTemplateDemo.getLoadConfig = () => {
    return {
        continueSearch: {
            dataFactoryName:
                'Controls-ListEnv-demo/Search/List/DataHelpers/PortionedSearchCustomFactory',
            dataFactoryArguments: {
                displayProperty: 'title',
                source: new PortionedSearchMemory({
                    direction: 'down',
                    keyProperty: 'key',
                }),
                filter: {},
                searchParam: 'title',
                navigation: {
                    source: 'position',
                    view: 'infinity',
                    sourceConfig: {
                        field: 'key',
                        position: 0,
                        direction: 'forward',
                        limit: 20,
                    },
                    viewConfig: {
                        pagingMode: 'basic',
                    },
                },
                filterDescription: [companyBasicFilter, deletedExtendedFilter],
                minSearchLength: 3,
            },
        },
    };
};

export default ContinueSearchTemplateDemo;
