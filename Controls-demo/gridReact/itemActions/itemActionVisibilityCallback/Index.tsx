import * as React from 'react';

import { TInternalProps } from 'UICore/Executor';

import 'Controls/gridReact';

import { IColumnConfig } from 'Controls/gridReact';
import { ItemsView as GridView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';
import { Model } from 'Types/entity';
import { IItemAction } from 'Controls/itemActions';

import { getItemsWithItemActions } from 'Controls-demo/gridReact/resources/CountriesData';

const COLUMNS: IColumnConfig[] = [
    {
        key: 'key',
        displayProperty: 'key',
        width: '50px',
    },
    {
        key: 'country',
        width: '1fr',
        displayProperty: 'country',
    },
    {
        key: 'capital',
        width: '250px',
        displayProperty: 'capital',
    },
];

const ITEMS = getItemsWithItemActions();

export default React.forwardRef(function StickyCallbackDemo(
    props: TInternalProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const getRowProps = React.useCallback(() => {
        return {};
    }, []);

    const visibilityCallback = React.useCallback(
        (action: IItemAction, item: Model, isEditing: boolean): boolean => {
            if (action.title === 'delete pls') {
                return item.get('group') !== 'Asia';
            }
            return true;
        },
        []
    );

    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <ScrollContainer className={'controlsDemo__height300 controlsDemo__width800px'}>
                <GridView
                    columns={COLUMNS}
                    items={ITEMS}
                    itemActionsProperty={'itemActions'}
                    itemActionsVisibility={'onhover'}
                    itemActionsPosition={'inside'}
                    getRowProps={getRowProps}
                    customEvents={['onActionClick']}
                    itemActionVisibilityCallback={visibilityCallback}
                />
            </ScrollContainer>
        </div>
    );
});
