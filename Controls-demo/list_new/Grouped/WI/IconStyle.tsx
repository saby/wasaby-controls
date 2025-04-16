import * as React from 'react';
import { TInternalProps } from 'UICore/executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { Container as ScrollContainer } from 'Controls/scroll';
import { View as ListView, GroupTemplate as ListGroupTemplate } from 'Controls/list';

const data = [
    {
        key: 1,
        title: 'MacBook Pro',
        group: 'apple',
    },
    {
        key: 2,
        title: 'ASUS X751SA-TY124D',
        group: 'asus',
    },
];

const GroupTemplate = React.forwardRef(function GroupTemplate(
    groupTemplateProps: object,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    return <ListGroupTemplate {...groupTemplateProps} forwardedRef={ref} iconStyle={'danger'} />;
});

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className={'controlsDemo__wrapper ' + props.className}>
            <ScrollContainer>
                <ListView
                    groupProperty="group"
                    groupTemplate={GroupTemplate}
                    storeId="GroupedIconStyles"
                />
            </ScrollContainer>
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            GroupedIconStyles: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data,
                    }),
                },
            },
        };
    },
});
