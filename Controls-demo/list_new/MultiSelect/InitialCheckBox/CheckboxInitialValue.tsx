import * as React from 'react';
import {
    View as ListView,
    ItemTemplate as ListItemTemplate,
    MultiSelectTemplate,
} from 'Controls/list';
import 'css!Controls-demo/list_new/Marker/MarkerClassName/Style';
import { IDataConfig, IListDataFactoryArguments, ListSlice } from 'Controls/dataFactory';
import { Memory } from 'Types/source';
import { useSlice } from 'Controls-DataEnv/context';
import { TInternalProps } from 'UICore/Executor';

const data = [
    {
        key: 1,
        title: 'Notebooks',
        node: true,
        parent: null,
        checkbox: null,
    },
    {
        key: 2,
        title: 'Tablets',
        node: false,
        parent: null,
        checkbox: true,
    },
    {
        key: 3,
        title: 'Laptop computers',
        node: null,
        parent: null,
        checkbox: null,
    },
    {
        key: 4,
        title: 'Apple gadgets',
        node: null,
        parent: null,
    },
    {
        key: 5,
        title: 'Android gadgets',
        node: null,
        parent: null,
    },
];

function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const slice = useSlice<ListSlice>('CheckBoxInitial');

    return (
        <div ref={ref} className={'controlsDemo__wrapper controlsDemo_fixedWidth1000'}>
            <ListView
                storeId="CheckBoxInitial"
                customEvents={['onCheckBoxClick']}
                onCheckBoxClick={(key: number) => {
                    const record = slice?.state.items.getRecordById(key);
                    record?.set('checkbox', undefined);
                }}
                multiSelectTemplate={(props) => {
                    const checkbox = props.item.contents.get('checkbox');
                    return <MultiSelectTemplate value={checkbox} {...props} />;
                }}
                itemTemplate={(innerProps) => {
                    return (
                        <ListItemTemplate
                            {...innerProps}
                            className={'controlsDemo__listNew__MarkerClassName_item'}
                            markerClassName={'controlsDemo__listNew__MarkerClassName_marker'}
                        />
                    );
                }}
            />
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            CheckBoxInitial: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        keyProperty: 'key',
                        data,
                    }),
                    selectedKeys: [1, 2, 3],
                    displayProperty: 'title',
                    keyProperty: 'key',
                    multiSelectVisibility: 'visible',
                    markerVisibility: 'visible',
                },
            },
        };
    },
});
