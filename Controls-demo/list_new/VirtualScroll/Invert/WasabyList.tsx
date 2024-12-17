import { type ForwardedRef, forwardRef, useCallback, useMemo, useEffect, useState } from 'react';
import {
    IInitialScrollPosition,
    SCROLL_POSITION,
    Container as ScrollContainer,
} from 'Controls/scroll';
import { View as List } from 'Controls/list';
import { USER } from 'ParametersWebAPI/Scope';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { default as Browser } from 'Layout/Browser';
import { Button } from 'Controls/buttons';
import { Invert as InvertAction } from 'Controls-ListEnv/actions';

import 'Controls-ListEnv/actions';

import {
    LoadConfig,
    virtualScrollConfig,
    wasabyListSource,
    wasabyInitNavigation,
} from './constants';

function Page(_: object, ref: ForwardedRef<HTMLDivElement>) {
    const itemAction = useMemo(() => {
        return new InvertAction({
            id: 'invertAction',
            propStorageId: 'wasabyList',
        });
    }, []);
    const invertActionClickHandler = useCallback(() => {
        itemAction.execute();
    }, [itemAction]);
    const [icon, setIcon] = useState(itemAction.icon);
    const [tooltip, setTooltip] = useState(itemAction.tooltip);
    const [initialScrollPosition, setInitialScrollPosition] = useState<IInitialScrollPosition>({
        vertical: SCROLL_POSITION.START,
        horizontal: SCROLL_POSITION.START,
    });
    const updateInvertButton = useCallback(
        (event, options) => {
            setIcon(options.icon);
            setTooltip(options.tootip);
        },
        [setIcon, setTooltip]
    );
    useEffect(() => {
        itemAction.subscribe('itemChanged', updateInvertButton);
        return () => {
            itemAction.unsubscribe('itemChanged', updateInvertButton);
        };
    }, [itemAction, updateInvertButton]);
    useEffect(() => {
        USER.load(['wasabyList-itemsOrder']).then((config) => {
            const itemsOrder = config.get('wasabyList-itemsOrder');
            if (itemsOrder && itemsOrder !== 'default') {
                setInitialScrollPosition({
                    vertical: SCROLL_POSITION.END,
                    horizontal: SCROLL_POSITION.START,
                });
            } else {
                setInitialScrollPosition({
                    vertical: SCROLL_POSITION.START,
                    horizontal: SCROLL_POSITION.START,
                });
            }
        });
    }, []);
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth1200">
            <Button
                icon={icon}
                tooltip={tooltip}
                onClick={invertActionClickHandler}
                viewMode="ghost"
                iconSize="m"
            />
            <Browser
                keyProperty={'key'}
                source={wasabyListSource}
                navigation={wasabyInitNavigation}
                useStore={true}
                propStorageId={'wasabyList'}
            >
                <ScrollContainer
                    className="controlsDemo_fixedWidth500 controlsDemo__maxWidth500 controlsDemo__height500 controlsDemo__mb1"
                    initialScrollPosition={initialScrollPosition}
                >
                    <List
                        attr:class="demo-Grid__control test_grid_1"
                        displayProperty="title"
                        virtualScrollConfig={virtualScrollConfig}
                    />
                </ScrollContainer>
            </Browser>
        </div>
    );
}

export default Object.assign(forwardRef(Page), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return LoadConfig;
    },
});
