import * as React from 'react';

import { ITrackedPropertiesTemplateProps, TGetRowPropsCallback } from 'Controls/gridReact';
import { View } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';

import { TrackedPropertiesTemplate } from 'Controls/baseList';
import { Memory } from 'Types/source';
import { getData } from 'Controls-demo/gridReact/Ladder/WI/Sticky/Data';
import { FirstColumnCell } from 'Controls-demo/gridNew/TrackedTemplate/Dev/Templates/FirstColumnCell';
import { SecondColumnCell } from 'Controls-demo/gridNew/TrackedTemplate/Dev/Templates/SecondColumnCell';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

interface IDemoProps {
    stickyResults?: boolean;
    getRowProps?: TGetRowPropsCallback;
}

function TrackedPropertiesTemplateSlice(
    props: IDemoProps,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    const columns = [
        { key: 'photo', render: <FirstColumnCell />, width: '80px' },
        { key: 'descriprion', render: <SecondColumnCell /> },
    ];
    return (
        <div ref={ref}>
            <ScrollContainer className={'controlsDemo__height400 controlsDemo__width800px'}>
                <View
                    storeId="TrackedPropertiesTemplateSlice"
                    columns={columns}
                    ladderProperties={['photo']}
                    trackedProperties={['photo']}
                    rowSeparatorSize={'s'}
                    trackedPropertiesTemplate={(props: ITrackedPropertiesTemplateProps) => (
                        <TrackedPropertiesTemplate backgroundStyle="transparent">
                            <img
                                src={props.trackedValues.photo}
                                style={{
                                    height: '60px',
                                    width: '60px',
                                    borderRadius: '13px',
                                }}
                            />
                        </TrackedPropertiesTemplate>
                    )}
                />
            </ScrollContainer>
        </div>
    );
}

export default Object.assign(React.forwardRef(TrackedPropertiesTemplateSlice), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            TrackedPropertiesTemplateSlice: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    displayProperty: 'title',
                },
            },
        };
    },
});
