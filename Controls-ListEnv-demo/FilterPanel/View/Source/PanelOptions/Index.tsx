import { Memory } from 'Types/source';
import { View as FilterView } from 'Controls-ListEnv/filterConnected';
import { View as FilterPanel } from 'Controls-ListEnv/filterPanelConnected';
import { Text as Skeleton } from 'Controls/skeleton';
import { View as List } from 'Controls/list';
import { forwardRef } from 'react';

const PanelOptions = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__flex ws-flex-column ws-align-items-center controls-padding_top-l controls-background-unaccented"
        >
            <div className="tw-flex tw-flex-col controls-padding_left-s">
                <div className="controlsDemo_fixedWidth600 tw-flex tw-justify-end">
                    <FilterView storeId="list" alignment="right" />
                </div>
                <div className="controlsDemo_fixedWidth600 tw-flex">
                    <div className="controlsDemo_fixedWidth200 controlsDemo__background">
                        <Skeleton rows={5} fontSize="xl" active={true} />
                        <FilterPanel storeId="list" className="controls-FilterPanel__air" />
                    </div>
                    <div className="tw-flex-grow controls-padding_left-s controls-background-default">
                        <List storeId="list" className="controls-air-m" />
                    </div>
                </div>
            </div>
        </div>
    );
});

Object.assign(PanelOptions, {
    getLoadConfig: () => {
        const source = new Memory({
            data: [
                { cityId: 0, title: 'Ярославль' },
                { cityId: 1, title: 'Москва' },
                { cityId: 2, title: 'Ростов' },
            ],
            keyProperty: 'cityId',
        });
        return {
            list: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source,
                    displayProperty: 'title',
                    keyProperty: 'cityId',
                    filterDescription: [
                        {
                            name: 'cityId',
                            value: null,
                            resetValue: null,
                            editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
                            expanderVisible: true,
                            descriptionToValueConverter:
                                'Controls-ListEnv-demo/FilterPanel/View/Source/PanelOptions/descriptionToValueConverter',
                            panel: {
                                caption: 'Город',
                                viewMode: 'extended',
                                extendedCaption: 'Выберите город',
                                editorOptions: {
                                    source,
                                    displayProperty: 'title',
                                    keyProperty: 'cityId',
                                    multiSelect: false,
                                },
                            },
                            window: {
                                viewMode: 'basic',
                                editorOptions: {
                                    source,
                                    displayProperty: 'title',
                                    keyProperty: 'cityId',
                                    emptyText: 'Любой город',
                                },
                            },
                        },
                    ],
                },
            },
        };
    },
});

export default PanelOptions;
