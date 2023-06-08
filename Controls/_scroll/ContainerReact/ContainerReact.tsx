/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import * as React from 'react';
import { createElement, delimitProps } from 'UICore/Jsx';
import { _StickyContext, _StickyGroupContext } from 'Controls/stickyBlock';
import { SCROLL_POSITION } from '../Utils/Scroll';
import 'css!Controls/scroll';
import { ScrollContext } from '../Contexts/ScrollContext';

function ContainerReact(props) {
    const { clearProps, $wasabyRef, userAttrs, context } = delimitProps(props);

    const scrollContext = React.useContext(ScrollContext);
    const [_, forceUpdate] = React.useReducer((x) => {
        return x + 1;
    }, 0);
    const stickyModelsContext = React.useRef({});
    const stickyGroupModelsContext = React.useRef<{
        scrollState?: {
            scrollTop: number;
            horizontalPosition: string;
            horizontalScrollMode: string;
        };
    }>({});

    React.useEffect(() => {
        if (props.getContextValue) {
            props.getContextValue(scrollContext?.pagingVisible);
        }
    }, [scrollContext]);

    const updateContext = (
        stickyModels,
        groupModels,
        scrollModel,
        needRerender = true
    ) => {
        const stickyContextModels = { ...stickyModels, models: {} };
        for (const id in stickyModels.models) {
            if (stickyModels.models.hasOwnProperty(id)) {
                stickyContextModels.models[id] = { ...stickyModels.models[id] };
            }
        }

        stickyModelsContext.current = stickyContextModels;

        let newScrollState = {
            scrollTop: scrollModel?._scrollTop || 0,
            horizontalPosition:
                scrollModel?._horizontalPosition || SCROLL_POSITION.START,
            horizontalScrollMode:
                scrollModel?.horizontalScrollMode || 'default',
        };
        if (
            JSON.stringify(stickyGroupModelsContext.current.scrollState) ===
            JSON.stringify(newScrollState)
        ) {
            newScrollState = stickyGroupModelsContext.current.scrollState;
        }

        stickyGroupModelsContext.current = {
            ...groupModels,
            scrollState: newScrollState,
        };
        if (needRerender) {
            forceUpdate();
        }
    };

    props.setStickyContextUpdater(updateContext);

    if (!Object.keys(stickyModelsContext.current).length) {
        updateContext(
            clearProps.stickyModels,
            clearProps.stickyGroupModels,
            { horizontalScrollMode: props.horizontalScrollMode },
            false
        );
    }

    return (
        <_StickyContext.Provider value={stickyModelsContext.current}>
            <_StickyGroupContext.Provider
                value={stickyGroupModelsContext.current}
            >
                {createElement(
                    clearProps.content,
                    { $wasabyRef },
                    { ...userAttrs },
                    undefined,
                    context
                )}
            </_StickyGroupContext.Provider>
        </_StickyContext.Provider>
    );
}

export default React.memo(ContainerReact);
