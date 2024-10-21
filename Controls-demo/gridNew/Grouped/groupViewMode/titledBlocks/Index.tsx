import * as React from 'react';
import { Memory } from 'Types/source';
import { IColumn, View } from 'Controls/grid';

import { Tasks } from 'Controls-demo/gridNew/DemoHelpers/Data/Tasks';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { TInternalProps } from 'UICore/Executor';
import { Container } from 'Controls/scroll';

const { getData } = Tasks;

const columns: IColumn[] = Tasks.getDefaultColumns().concat([
    {
        displayProperty: 'message',
        width: '200px',
        textOverflow: 'ellipsis',
    },
]);
const itemTemplateOptions = {
    backgroundColorStyle: 'default',
    fixedBackgroundStyle: 'default',
};

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <Container className={'controlsDemo_fixedWidth550 controlsDemo__height300'}>
                <View
                    className={'controlsDemo__background'}
                    backgroundStyle={'transparent'}
                    fixedBackgroundStyle={'default'}
                    storeId={'GroupViewModeTitledBlocks'}
                    groupViewMode={'titledBlocks'}
                    groupProperty={'fullName'}
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
            GroupViewModeTitledBlocks: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    },
});
