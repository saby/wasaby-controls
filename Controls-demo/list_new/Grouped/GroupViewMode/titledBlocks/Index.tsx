import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { Container as ScrollContainer } from 'Controls/scroll';
import { View } from 'Controls/list';

import { getGroupedCatalog as getData } from '../../../DemoHelpers/Data/Groups';

const itemTemplateOptions = {
    backgroundColorStyle: 'default',
    fixedBackgroundStyle: 'default',
};

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <ScrollContainer className={'controlsDemo_fixedWidth550 controlsDemo__height300'}>
                <View
                    className={'controlsDemo__background'}
                    backgroundStyle={'transparent'}
                    fixedBackgroundStyle={'default'}
                    storeId={'GroupViewModeTitledBlocks'}
                    groupViewMode={'titledBlocks'}
                    groupProperty={'brand'}
                    itemTemplateOptions={itemTemplateOptions}
                />
            </ScrollContainer>
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
