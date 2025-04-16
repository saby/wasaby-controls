import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import 'Controls/gridReact';
import { View as GridView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { CrudEntityKey, Memory } from 'Types/source';
import { HotKeysContainer } from 'Controls/list';
import { Button } from 'Controls/buttons';
import { SyntheticEvent } from 'UICommon/Events';

interface IItem {
    title: string;
    key: number;
    keyProperty: string;
    count: number;
}

const MAX_ELEMENTS_COUNT: number = 100;
const SCROLL_TO_ITEM: number = 95;
let COUNT = MAX_ELEMENTS_COUNT - 1;
let textInfo = '';

function getData() {
    return generateData({
        count: MAX_ELEMENTS_COUNT,
        beforeCreateItemCallback: (item: IItem) => {
            item.title = `Запись с ключом ${item.key}.`;
        },
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
        pageSize: 99,
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
    const updateCount = React.useCallback(
        (e: SyntheticEvent, key: CrudEntityKey) => {
            COUNT = MAX_ELEMENTS_COUNT - 1 - Number(key);
        },
        [COUNT]
    );

    const clear = React.useCallback(() => {
        textInfo = '';
    }, []);

    const onPagingArrowClick = React.useCallback((e: SyntheticEvent, arrow: string): boolean => {
        switch (arrow) {
            case 'End':
                textInfo = `Нажали кнопку "в конец" скролим к ${SCROLL_TO_ITEM} элементу`;
                break;
        }
        //this._children.list.scrollToItem(SCROLL_TO_ITEM, 'bottom', true);
        return false;
    }, []);

    return (
        <div ref={ref} className={'controlsDemo__wrapper controlsDemo_fixedWidth800'}>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    Имитируем прокрутку к первой непрочитанной записи
                </div>
            </div>
            <ScrollContainer className={'controlsDemo__height400'}>
                <HotKeysContainer>
                    <GridView
                        displayProperty={'title'}
                        source={SOURCE}
                        navigation={NAVIGATION}
                        className={'controlsDemo_line-height18'}
                        moveMarkerOnScrollPaging={true}
                        onActiveElementChanged={updateCount}
                        onPagingArrowClick={onPagingArrowClick}
                        columns={COLUMNS}
                        pagingContentTemplate={<div>{COUNT}</div>}
                    />
                </HotKeysContainer>
            </ScrollContainer>
            <div className="controlsDemo__cell">
                <Button caption={'Очистить'} onClick={clear} />
            </div>
            {textInfo && <div className="controlsDemo__cell">{textInfo}</div>}
        </div>
    );
});
