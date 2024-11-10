import * as React from 'react';
import { Container as ScrollContainer } from 'Controls/scroll';
import { View } from 'Controls/explorer';
import { generateSimpleTreeData } from '../resources/generateTreeData';
import { HierarchicalMemory } from 'Types/source';
import useColumnsFactory from './useColumnsFactory';
import { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import 'Controls/gridColumnScroll';

type TZIndexRef = React.ForwardedRef<HTMLDivElement>;

const COLUMNS_COUNT = 30;

const KEY_PROPERTY = 'key';
const PARENT_PROPERTY = 'parent';
const NODE_PROPERTY = 'nodeType';

const getSource = () => {
    let index = 0;

    return new HierarchicalMemory({
        keyProperty: KEY_PROPERTY,
        parentProperty: PARENT_PROPERTY,
        data: generateSimpleTreeData({
            levelCount: 4,
            count: 30,
            keyProperty: KEY_PROPERTY,
            parentProperty: PARENT_PROPERTY,
            nodeProperty: NODE_PROPERTY,
            itemFactory: (key) => ({
                title: `Запись ${key}`,
                index: index++,
                fakeValue: ''
            })
        }),
    });
}
const SOURCE = getSource();

const NAVIGATION = {
    source: 'page',
    view: 'infinity',
    sourceConfig: {
        pageSize: 10,
        page: 0,
        hasMore: false,
    },
}
function ZIndex(props: never, ref: TZIndexRef): JSX.Element {
    const HEADER = useColumnsFactory<IHeaderConfig>(
        [
            {
                key: 'header-index',
                caption: '#',
            },
            {
                key: 'header-date-number',
                caption: 'Дата',
            },
        ],
        (index) => ({
            key: `sum-state-${index}`,
            caption: `Заголовок ${index}`,
        }),
        COLUMNS_COUNT
    );

    const COLUMNS = useColumnsFactory<IColumnConfig>(
        React.useMemo(
            () => [
                {
                    key: 'index-data',
                    width: '150px',
                    displayProperty: 'index'
                },
                {
                    key: 'main-data',
                    width: '260px',
                    minWidth: '160px',
                    maxWidth: '360px',
                    displayProperty: 'title'
                }
            ],
            []
        ),
        React.useCallback((index: number) => {
            return {
                key: `sum-state-${index}`,
                width: '150px',
                displayProperty: 'fakeValue'
            };
        }, []),
        COLUMNS_COUNT
    );

    return (
        <div ref={ref}>
            <h3>Таблица: 50 строк на странице, 100 колонок, включен виртуальный скролл строк.</h3>
            <ScrollContainer className="controlsDemo__height_70vh controlsDemo__width_70vw">
                <View
                    header={HEADER}
                    columns={COLUMNS}
                    source={SOURCE}
                    root={null}
                    stickyColumnsCount={2}
                    rowSeparatorSize={'s'}
                    columnSeparatorSize={'s'}
                    keyProperty={KEY_PROPERTY}
                    parentProperty={PARENT_PROPERTY}
                    nodeProperty={NODE_PROPERTY}
                    viewMode="table"
                    navigation={NAVIGATION}
                    columnScroll={true}
                    resizerVisibility={true}
                />
            </ScrollContainer>
        </div>
    );
}

export default React.forwardRef(ZIndex);
