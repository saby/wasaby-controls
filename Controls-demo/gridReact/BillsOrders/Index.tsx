import * as React from 'react';

import { TInternalProps } from 'UICore/Executor';
import { date as dateFormat } from 'Types/formatter';
import { Date } from 'Controls/baseDecorator';
import { Memory } from 'Types/source';
import { IColumnConfig, TGetRowPropsCallback } from 'Controls/gridReact';
import { View as GridView } from 'Controls/grid';
import 'Controls/gridReact';
import {
    TrackedPropertiesTemplate,
    ITrackedPropertiesTemplateProps,
    IVirtualScrollConfig,
} from 'Controls/list';
import { Container as ScrollContainer } from 'Controls/scroll';
import {
    INavigationOptionValue,
    INavigationPageSourceConfig,
} from 'Controls/interface';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { Button } from 'Controls/buttons';

import { getMoreActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { getSource } from '../resources/BillsOrdersData';
import DateNumberCell from './CellRenders/DateNumberCell';
import MainDataCell from './CellRenders/MainDataCell';
import SumStateCell from './CellRenders/SumStateCell';

const SOURCE: Memory = getSource();
const ACTIONS: IItemAction[] = getMoreActions().map((it) => {
    return { ...it, showType: TItemActionShowType.MENU };
});
const NAVIGATION: INavigationOptionValue<INavigationPageSourceConfig> = {
    source: 'page',
    sourceConfig: { hasMore: false, page: 1, pageSize: 10 },
    view: 'infinity',
};
const LADDER_PROPERTIES: string[] = ['date', 'number'];
const VIRTUAL_SCROLL_CONFIG: IVirtualScrollConfig = {
    pageSize: 10,
};

// Аналог stickyProperty
function StickedProperties(
    props: ITrackedPropertiesTemplateProps
): React.ReactElement {
    const date = props.trackedValues.date as Date;
    return (
        <TrackedPropertiesTemplate {...props}>
            {date && (
                <Date value={date} format={dateFormat.FULL_DATE_FULL_YEAR} />
            )}
        </TrackedPropertiesTemplate>
    );
}

function Index(
    props: TInternalProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    // Для примера как нужно прокидывать свои кастомные значения в рендер
    const [showImportantFlag, setShowImportantFlag] = React.useState(false);

    const getRowProps = React.useCallback<TGetRowPropsCallback>((item) => {
        return {
            actionsClassName: 'controls-itemActionsV_position_topRight',
        };
    }, []);

    const columns = React.useMemo<IColumnConfig[]>(() => {
        return [
            {
                key: 'date-number',
                width: '100px',
                render: <DateNumberCell />,
                getCellProps: (_item) => {
                    return { halign: 'right' };
                },
            },
            {
                key: 'main-data',
                width: '2fr',
                render: <MainDataCell />,
            },
            {
                key: 'sum-state',
                width: '1fr',
                render: <SumStateCell showImportantFlag={showImportantFlag} />,
            },
        ];
    }, [showImportantFlag]);

    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <Button
                caption={'Change showImportantFlag'}
                onClick={() => {
                    return setShowImportantFlag((prev) => {
                        return !prev;
                    });
                }}
            />

            <ScrollContainer
                className={'controlsDemo__height500 controlsDemo__width800px'}
            >
                <GridView
                    columns={columns}
                    source={SOURCE}
                    navigation={NAVIGATION}
                    virtualScrollConfig={VIRTUAL_SCROLL_CONFIG}
                    multiSelectVisibility={'visible'}
                    itemActions={ACTIONS}
                    getRowProps={getRowProps}
                    ladderProperties={LADDER_PROPERTIES}
                    trackedProperties={LADDER_PROPERTIES}
                    trackedPropertiesTemplate={StickedProperties}
                />
            </ScrollContainer>
        </div>
    );
}

export default React.forwardRef(Index);
