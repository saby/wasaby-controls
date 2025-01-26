/*
 * Файл содержит публичный компонент LadderWrapper, который используется для многострочной лесенки
 * в шаблоне контента ячейки.
 * Демо: Controls-demo/Ladder/StickyMultiline/Index
 */

import * as React from 'react';
import { useItemData } from 'Controls/_gridRender/hooks/useItemData';
import { Model } from 'Types/entity';
import { StickyPropertyContext } from 'Controls/_gridRender/ladder/StickyPropertyContext';
import { CollectionItemContext } from 'Controls/listsCommonLogic';
import { isOldBrowser } from 'Controls/gridDisplay';

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

const LadderWrapperRender = function LadderWrapperRender({
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
};

function Wrapper(props: ILadderWrapperProps) {
    const currentCell = React.useContext(StickyPropertyContext) ?? null;
    const item = React.useContext(CollectionItemContext);
    const { ladderProperty, className, children, content } = props;

    const stickyProperty = item?.getGridColumnsConfig()?.[0]?.stickyProperty;
    const ladderData = useItemData<Model>([ladderProperty]);
    const { renderValues } = useItemData<Model>(
        typeof stickyProperty === 'string' ? [stickyProperty] : stickyProperty
    );

    const hiddenClassName = item?.getStickyLadder()?.[props.stickyProperty]?.headingStyle
        ? ' controls-Grid__row-cell__content_ladderHeader'
        : '';
    const isStickyLadder = stickyProperty && stickyProperty.indexOf(ladderProperty) !== -1;
    if (isStickyLadder && !isOldBrowser) {
        if (currentCell === null) {
            return (
                <LadderWrapperRender
                    forwardedRef={props.forwardedRef}
                    style={{ visibility: 'hidden' }}
                    className={className + ' tw-invisible' + hiddenClassName}
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
                    className={className + ' tw-invisible' + hiddenClassName}
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
        <Wrapper
            {...props}
            children={props.children || props.content}
            forwardedRef={ref}
            _wrapInDivTag={false} // В режиме совместимости прикладник не ожидает, что лесенка будет обёрнута в div
        />
    );
});

export default Wrapper;
