import * as React from 'react';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { View } from 'Controls/treeGrid';

import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { TInternalProps } from 'UICore/Executor';
import { Container } from 'Controls/scroll';

import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

const { getData } = Flat;

const columns: IColumn[] = Flat.getColumns().concat([
    {
        displayProperty: 'message',
        width: '200px',
        textOverflow: 'ellipsis',
    },
]);
const itemTemplateOptions = {
    backgroundStyle: 'transparent',
    backgroundColorStyle: 'default',
    fixedBackgroundStyle: 'unaccented',
};

function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <Container className={'controlsDemo_fixedWidth550 controlsDemo__height300'}>
                <View
                    className={'controlsDemo__background'}
                    backgroundStyle={'transparent'}
                    fixedBackgroundStyle={'unaccented'}
                    storeId={'GroupViewModeBlocks'}
                    groupViewMode={'blocks'}
                    groupProperty={'group'}
                    columns={columns}
                    itemTemplateOptions={itemTemplateOptions}
                />
            </Container>
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            GroupViewModeBlocks: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData().map((it) => {
                            it.parent = null;
                            it.type = null;
                            return it;
                        }),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    multiSelectVisibility: 'onhover',
                },
            },
        };
    },
});
