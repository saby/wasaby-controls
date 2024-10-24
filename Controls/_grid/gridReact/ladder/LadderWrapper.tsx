/*
 * Файл содержит публичный компонент LadderWrapper, который используется для многострочной лесенки
 * в шаблоне контента ячейки.
 * Демо: Controls-demo/gridReact/Ladder/StickyMultiline/Index
 */

import * as React from 'react';
import { useItemData } from 'Controls/_grid/gridReact/hooks/useItemData';
import { Model } from 'Types/entity';
import { StickyPropertyContext } from 'Controls/_grid/gridReact/ladder/StickyPropertyContext';
import { CollectionItemContext } from 'Controls/baseList';
import { detection } from 'Env/Env';

export interface ILadderWrapperProps {
    ladderProperty: string;
    className?: string;
    children: React.Node;
    stickyProperty?: string | string[];
    forwardedRef?: React.ForwardedRef<HTMLDivElement>;
    // compatibility only
    _wrapInDivTag?: boolean;
}

interface ILadderWrapperRender {
    className?: string;
    children: React.Node;
    style?: React.CSSProperties;
    forwardedRef?: React.ForwardedRef<HTMLDivElement>;
    // compatibility only
    _wrapInDivTag?: boolean;
}

const LadderWrapperRender = React.memo(function LadderWrapperRender({
    forwardedRef: ref,
    className,
    children,
    style,
    content: Content,
    _wrapInDivTag = true,
}: ILadderWrapperRender) {
    const render = Content ? (
        <Content style={style} className={className} attrs={{ style, className }} />
    ) : (
        children
    );

    return _wrapInDivTag ? (
        <div ref={ref} style={style} className={className}>
            {render}
        </div>
    ) : (
        React.cloneElement(render, {
            className,
            style,
        })
    );
});

const isOldBrowser = detection.isIE || (detection.isNotFullGridSupport && !detection.safari);

function LadderWrapper(props: ILadderWrapperProps) {
    const currentCell = React.useContext(StickyPropertyContext) ?? null;
    const item = React.useContext(CollectionItemContext);
    const { ladderProperty, className, children, content } = props;

    const stickyProperty = item?.getGridColumnsConfig()?.[0]?.stickyProperty;
    const ladderData = useItemData<Model>([ladderProperty]);
    const { renderValues } = useItemData<Model>(
        typeof stickyProperty === 'string' ? [stickyProperty] : stickyProperty
    );

    const isStickyLadder = stickyProperty && stickyProperty.indexOf(ladderProperty) !== -1;
    if (isStickyLadder && !isOldBrowser) {
        if (currentCell === null) {
            return (
                <LadderWrapperRender
                    forwardedRef={props.forwardedRef}
                    style={{ visibility: 'hidden' }}
                    className={className + ' tw-invisible'}
                    _wrapInDivTag={props._wrapInDivTag}
                    content={content}
                >
                    {children}
                </LadderWrapperRender>
            );
        }

        if (currentCell === stickyProperty[0] && currentCell === ladderProperty) {
            return (
                <LadderWrapperRender
                    forwardedRef={props.forwardedRef}
                    className={className}
                    _wrapInDivTag={props._wrapInDivTag}
                    content={content}
                >
                    {children}
                </LadderWrapperRender>
            );
        }

        if (currentCell === stickyProperty[0] && currentCell !== ladderProperty) {
            return null;
        }

        if (
            currentCell === stickyProperty[1] &&
            renderValues[stickyProperty[0]] === null &&
            currentCell !== ladderProperty
        ) {
            return null;
        }

        if (currentCell === stickyProperty[1] && currentCell !== ladderProperty) {
            return (
                <LadderWrapperRender
                    forwardedRef={props.forwardedRef}
                    style={{ visibility: 'hidden' }}
                    className={className + ' tw-invisible'}
                    _wrapInDivTag={props._wrapInDivTag}
                    content={content}
                >
                    {children}
                </LadderWrapperRender>
            );
        }

        if (
            currentCell === stickyProperty[1] &&
            currentCell === ladderProperty &&
            renderValues[stickyProperty[0]] === null
        ) {
            return (
                <LadderWrapperRender
                    forwardedRef={props.forwardedRef}
                    className={className}
                    _wrapInDivTag={props._wrapInDivTag}
                    content={content}
                >
                    {children}
                </LadderWrapperRender>
            );
        }

        if (currentCell === stickyProperty[1] && currentCell === ladderProperty) {
            return (
                <LadderWrapperRender
                    forwardedRef={props.forwardedRef}
                    style={{ position: 'absolute' }}
                    className={
                        className +
                        ' tw-absolute controls-Grid__row-cell__ladder-content_additional-with-main'
                    }
                    _wrapInDivTag={props._wrapInDivTag}
                    content={content}
                >
                    {children}
                </LadderWrapperRender>
            );
        }
    } else {
        if (ladderData.renderValues[ladderProperty] === null) {
            if (item.getLadderMode() === 'visibility') {
                return (
                    <LadderWrapperRender
                        forwardedRef={props.forwardedRef}
                        style={{ visibility: 'hidden' }}
                        className={className + ' tw-invisible'}
                        _wrapInDivTag={props._wrapInDivTag}
                        content={content}
                    >
                        {children}
                    </LadderWrapperRender>
                );
            } else {
                return (
                    <LadderWrapperRender
                        forwardedRef={props.forwardedRef}
                        style={{ display: 'none' }}
                        className={className + ' tw-hidden'}
                        _wrapInDivTag={props._wrapInDivTag}
                        content={content}
                    >
                        {children}
                    </LadderWrapperRender>
                );
            }
        }
    }
    return (
        <LadderWrapperRender
            forwardedRef={props.forwardedRef}
            className={className}
            _wrapInDivTag={props._wrapInDivTag}
            content={content}
        >
            {children}
        </LadderWrapperRender>
    );
}

export const LadderWrapperRef = React.forwardRef(function LadderWrapperRef(
    props: ILadderWrapperProps & { content: React.ReactElement },
    ref: React.ForwardedRef<HTMLDivElement>
) {
    return (
        <LadderWrapper
            {...props}
            children={props.children || props.content}
            forwardedRef={ref}
            _wrapInDivTag={false} // В режиме совместимости прикладник не ожидает, что лесенка будет обёрнута в div
        />
    );
});

export default LadderWrapper;
