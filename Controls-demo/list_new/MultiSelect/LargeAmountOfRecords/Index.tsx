import * as React from 'react';
import {
    View as ListView,
    ItemTemplate as ListItemTemplate,
    MultiSelectTemplate,
} from 'Controls/list';
import 'css!Controls-demo/list_new/Marker/MarkerClassName/Style';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { Memory } from 'Types/source';
import { TInternalProps } from 'UICore/Executor';

function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div ref={ref} className={'controlsDemo__wrapper controlsDemo_fixedWidth1000'}>
            <ListView
                storeId="LargeAmountOfRecords"
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
            LargeAmountOfRecords: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        keyProperty: 'key',
                        data: Array.from({ length: 5000 }).map((_, index) => ({
                            key: index,
                            title: 'Record ' + index,
                            node: true,
                            parent: null,
                        })),
                    }),
                    displayProperty: 'title',
                    keyProperty: 'key',
                    multiSelectVisibility: 'visible',
                    markerVisibility: 'visible',
                },
            },
        };
    },
});
