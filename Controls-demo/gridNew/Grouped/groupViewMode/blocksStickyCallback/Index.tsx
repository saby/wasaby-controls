import * as React from 'react';
import { Memory } from 'Types/source';
import { IColumn, View } from 'Controls/grid';

import { Tasks } from 'Controls-demo/gridNew/DemoHelpers/Data/Tasks';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { TInternalProps } from 'UICore/Executor';
import { Container } from 'Controls/scroll';
import { Model } from 'Types/entity';

const { getData } = Tasks;

const columns: IColumn[] = Tasks.getDefaultColumns().concat([
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

/**
 * На демке запись с id 4 прилипает при помощи StickyCallback, а группы не прилипают
 * @param _props
 * @param ref
 * @constructor
 */
function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const stickyCallback = React.useCallback((item: Model) => {
        return !!(`${item.getKey?.()}` === '4');
    }, []);

    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <Container className={'controlsDemo_fixedWidth550 controlsDemo__height300'}>
                <View
                    className={'controlsDemo__background'}
                    backgroundStyle={'transparent'}
                    fixedBackgroundStyle={'unaccented'}
                    storeId={'GroupViewModeBlocks'}
                    groupViewMode={'blocks'}
                    rowSeparatorSize={'s'}
                    groupProperty={'fullName'}
                    columns={columns}
                    itemTemplateOptions={itemTemplateOptions}
                    stickyCallback={stickyCallback}
                    stickyGroup={false}
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
                        data: getData(),
                    }),
                },
            },
        };
    },
});
