import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import 'Controls/gridReact';
import { View as GridView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { Memory } from 'Types/source';
import { HotKeysContainer } from 'Controls/list';
import { Button } from 'Controls/buttons';

function getData() {
    return generateData({
        count: 100,
        entityTemplate: { title: 'lorem' },
    });
}

const COLUMNS = [
    {
        key: 'title',
        displayProperty: 'title',
    },
];

const SOURCE = new Memory({
    keyProperty: 'key',
    data: getData(),
});

const NAVIGATION = {
    source: 'page',
    view: 'infinity',
    sourceConfig: {
        pageSize: 15,
        page: 0,
        hasMore: false,
    },
    viewConfig: {
        pagingMode: 'end',
    },
};

export default React.forwardRef(function StickyCallbackDemo(
    props: TInternalProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    return (
        <div ref={ref} className={'controlsDemo__wrapper controlsDemo_fixedWidth800'}>
            <ScrollContainer className={'controlsDemo__height400'}>
                <HotKeysContainer>
                    <GridView
                        displayProperty={'title'}
                        source={SOURCE}
                        navigation={NAVIGATION}
                        className={'controlsDemo_line-height18'}
                        moveMarkerOnScrollPaging={true}
                        columns={COLUMNS}
                        pagingLeftTemplate={
                            <Button
                                iconSize={'s'}
                                inlineHeight={'l'}
                                icon={'icon-EmptyMessage'}
                                buttonStyle={'primary'}
                                viewMode={'filled'}
                                iconStyle={'contrast'}
                                tooltip={'{[Отправить]}'}
                                style={{ marginRight: '8px' }}
                            />
                        }
                    />
                </HotKeysContainer>
            </ScrollContainer>
        </div>
    );
});
