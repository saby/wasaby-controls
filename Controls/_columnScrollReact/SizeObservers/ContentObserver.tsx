import * as React from 'react';
import ObservableDivComponent from './ObservableDiv';
import {
    ColumnScrollContext,
    PrivateContextUserSymbol,
    IColumnScrollContext,
} from '../context/ColumnScrollContext';

interface IContentObserverInnerComponentProps extends IContentObserverComponentProps {
    onResize: (widths: Pick<IColumnScrollContext, 'fixedWidth' | 'contentWidth'>) => void;
}

const ContentObserverInnerComponent = React.memo(function ContentObserverInnerComponent(
    props: IContentObserverInnerComponentProps
) {
    const fixedDivRef = React.useRef<HTMLDivElement>();
    const scrollableDivRef = React.useRef<HTMLDivElement>();

    const [fixedWidth, setFixedWidth] = React.useState(0);
    const [scrollableWidth, setScrollableWidth] = React.useState(0);

    React.useLayoutEffect(() => {
        const widths = {
            fixedWidth: 0,
            contentWidth: 0,
        };

        // При первой отрисовке размеры кидаем пачкой раз размеры кидаем пачкой.
        if (fixedWidth !== 0 && scrollableWidth !== 0) {
            widths.fixedWidth = fixedWidth;
            widths.contentWidth = fixedWidth + scrollableWidth;
        }

        props.onResize(widths);
    }, [fixedWidth, scrollableWidth]);

    return (
        <>
            {React.cloneElement(props.fixedDiv, {
                ref: fixedDivRef,
                children: <ObservableDivComponent onResize={setFixedWidth} />,
            })}
            {React.cloneElement(props.scrollableDiv, {
                ref: scrollableDivRef,
                children: <ObservableDivComponent onResize={setScrollableWidth} />,
            })}
        </>
    );
});

export interface IContentObserverComponentProps {
    fixedDiv: React.ReactElement<{
        ref: React.MutableRefObject<HTMLDivElement>;
        children: React.ReactElement;
    }>;
    scrollableDiv: React.ReactElement<{
        ref: React.MutableRefObject<HTMLDivElement>;
        children: React.ReactElement;
    }>;
}

export default React.memo(function ContentObserverComponent(
    props: IContentObserverComponentProps
): JSX.Element {
    const context = React.useContext(ColumnScrollContext);
    const onResize = React.useCallback<IContentObserverInnerComponentProps['onResize']>(
        (widths) => {
            const ctx = context.contextRefForHandlersOnly.current;
            ctx.updateSizes(PrivateContextUserSymbol, widths);
        },
        []
    );
    return (
        <ContentObserverInnerComponent
            onResize={onResize}
            fixedDiv={props.fixedDiv}
            scrollableDiv={props.scrollableDiv}
        />
    );
});
