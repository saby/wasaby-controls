import * as React from 'react';
import { Container as ScrollContainer } from 'Controls/scroll';
import { View } from 'Controls/explorer';
import { getData } from 'Controls-demo/gridReact/resources/BillsOrdersData';
import { Number } from 'Controls/baseDecorator';
import { useRenderData } from 'Controls/gridReact';
import { Model } from 'Types/entity';
import { HierarchicalMemory } from 'Types/source';
import useColumnsFactory from './useColumnsFactory';
import { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import 'Controls/gridColumnScroll';

type TKpiExtraRef = React.ForwardedRef<HTMLDivElement>;

const COLUMNS_COUNT = 100;
const VIRTUAL_SCROLL_CONFIG = {
    pageSize: 50,
    segmentSize: 10,
};

const KEY_PROPERTY = 'key';
const PARENT_PROPERTY = 'parent';
const NODE_PROPERTY = 'nodeType';

const SOURCE = new HierarchicalMemory({
    keyProperty: KEY_PROPERTY,
    parentProperty: PARENT_PROPERTY,
    data: getData().map((i) => ({
        ...i,
        [NODE_PROPERTY]: true,
        [PARENT_PROPERTY]: null,
    })),
});

function MainDataCell() {
    const { renderValues } = useRenderData<
        Model<{
            company: string;
            sender: string;
        }>
    >(['company', 'sender']);
    return (
        <div className={'ws-flex-column'} style={{ width: '100%' }}>
            <div className={'ws-flexbox ws-justify-content-between'}>
                <h3 className={'controls-text-secondary'}>{renderValues.company}</h3>
                <div className={'controls-text-label'}>{renderValues.sender}</div>
            </div>
        </div>
    );
}

function KpiExtra(props: never, ref: TKpiExtraRef): JSX.Element {
    const header = useColumnsFactory<IHeaderConfig>(
        [
            {
                key: 'header-date-number',
                caption: 'Дата',
            },
        ],
        (index) => ({
            key: `sum-state-${index}`,
            caption: `${index}`,
            getCellProps: () => {
                return {
                    padding: {
                        left: 'null',
                        right: 'null',
                    },
                };
            },
        }),
        COLUMNS_COUNT
    );

    const columns = useColumnsFactory<IColumnConfig>(
        React.useMemo(
            () => [
                {
                    key: 'main-data',
                    width: '260px',
                    render: <MainDataCell />,
                },
            ],
            []
        ),
        React.useCallback((index: number) => {
            return {
                key: `sum-state-${index}`,
                width: 'minmax(33px, max-content)',
                render: (
                    <Number
                        value={index}
                        tooltip=""
                        fontColorStyle={'secondary'}
                    />
                ),
                editorRender: <div />,
                getCellProps: () => {
                    return {
                        padding: {
                            left: 'null',
                            right: 'null',
                        },
                    };
                },
            };
        }, []),
        COLUMNS_COUNT
    );
    return (
        <div ref={ref}>
            <h3>Таблица: 50 строк на странице, 100 колонок, включен виртуальный скролл строк.</h3>
            <ScrollContainer className="controlsDemo__height_70vh controlsDemo__width_70vw">
                <View
                    header={header}
                    columns={columns}
                    virtualScrollConfig={VIRTUAL_SCROLL_CONFIG}
                    source={SOURCE}
                    root={null}
                    stickyColumnsCount={1}
                    rowSeparatorSize={'s'}
                    columnSeparatorSize={'s'}
                    keyProperty={KEY_PROPERTY}
                    parentProperty={PARENT_PROPERTY}
                    nodeProperty={NODE_PROPERTY}
                    viewMode="table"
                    columnScroll={true}
                    editingConfig={{
                        editOnClick: true,
                        mode: 'cell',
                    }}
                />
            </ScrollContainer>
        </div>
    );
}

export default React.forwardRef(KpiExtra);
