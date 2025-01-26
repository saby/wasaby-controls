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
import type { GridRow } from 'Controls/gridDisplay';
import { isOldBrowser } from 'Controls/_gridRender/utils/isOldBrowser';

interface ICompatibleProps {
    _wrapInDivTag?: boolean;
    content?: React.FC;
}

/**
 * Свойства Компонента-обёртки значений лесенки.
 * @public
 */
export interface ILadderWrapperProps extends ICompatibleProps {
    /**
     * Название поля записи, котолрое будет отслеживаться и скрываться при помощи обёртки
     */
    ladderProperty: string;
    /**
     * Произвольный CSS класс
     */
    className?: string;
    children: React.ReactNode;
    forwardedRef?: React.ForwardedRef<HTMLDivElement>;
}

interface ILadderWrapperRender extends ICompatibleProps {
    className?: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
    forwardedRef?: React.ForwardedRef<HTMLDivElement>;
}

// Рендер, позволяющий в режиме совместимости не оборачивать рендер лесенки в div.
const LWRender = function LadderWrapperRender({
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

/**
 * Компонент-обёртка значений лесенки.
 * Используется для скрытия значений при настройке {@link /doc/platform/developmentapl/interface-development/controls/list/grid/ladder/ лесенки по нескольким полям с прилипающими данными в одной колонке}.
 * @param props
 * @demo Controls-demo/gridNew/LadderStickyMultiline/StickyMultilineWithHeader/Index
 */
function Wrapper(props: ILadderWrapperProps) {
    const currentCell = React.useContext(StickyPropertyContext) ?? null;
    const item: GridRow = React.useContext(CollectionItemContext) as GridRow;
    const { ladderProperty, className, children, content } = props;

    const stickyProperty = item?.getGridColumnsConfig()?.[0]?.stickyProperty;
    const ladderData = useItemData<Model>([ladderProperty]);
    const { renderValues } = useItemData<Model>(
        typeof stickyProperty === 'string' ? [stickyProperty] : stickyProperty
    );

    const hiddenClassName =
        currentCell && item?.getStickyLadder()?.[currentCell]?.headingStyle
            ? ' controls-Grid__row-cell__content_ladderHeader'
            : '';
    const isStickyLadder = stickyProperty && stickyProperty.indexOf(ladderProperty) !== -1;
    if (isStickyLadder && !isOldBrowser) {
        if (currentCell === null) {
            return (
                <LWRender
                    forwardedRef={props.forwardedRef}
                    style={{ visibility: 'hidden' }}
                    className={className + ' tw-invisible' + hiddenClassName}
                    _wrapInDivTag={props._wrapInDivTag}
                    content={content}
                >
                    {children}
                </LWRender>
            );
        }

        if (currentCell === stickyProperty[0] && currentCell === ladderProperty) {
            return (
                <LWRender
                    forwardedRef={props.forwardedRef}
                    className={className}
                    _wrapInDivTag={props._wrapInDivTag}
                    content={content}
                >
                    {children}
                </LWRender>
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
                <LWRender
                    forwardedRef={props.forwardedRef}
                    style={{ visibility: 'hidden' }}
                    className={className + ' tw-invisible' + hiddenClassName}
                    _wrapInDivTag={props._wrapInDivTag}
                    content={content}
                >
                    {children}
                </LWRender>
            );
        }

        if (
            currentCell === stickyProperty[1] &&
            currentCell === ladderProperty &&
            renderValues[stickyProperty[0]] === null
        ) {
            return (
                <LWRender
                    forwardedRef={props.forwardedRef}
                    className={className}
                    _wrapInDivTag={props._wrapInDivTag}
                    content={content}
                >
                    {children}
                </LWRender>
            );
        }

        if (currentCell === stickyProperty[1] && currentCell === ladderProperty) {
            return (
                <LWRender
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
                </LWRender>
            );
        }
    } else {
        if (ladderData.renderValues[ladderProperty] === null) {
            if (item.getLadderMode() === 'visibility') {
                return (
                    <LWRender
                        forwardedRef={props.forwardedRef}
                        style={{ visibility: 'hidden' }}
                        className={className + ' tw-invisible'}
                        _wrapInDivTag={props._wrapInDivTag}
                        content={content}
                    >
                        {children}
                    </LWRender>
                );
            } else {
                return (
                    <LWRender
                        forwardedRef={props.forwardedRef}
                        style={{ display: 'none' }}
                        className={className + ' tw-hidden'}
                        _wrapInDivTag={props._wrapInDivTag}
                        content={content}
                    >
                        {children}
                    </LWRender>
                );
            }
        }
    }
    return (
        <LWRender
            forwardedRef={props.forwardedRef}
            className={className}
            _wrapInDivTag={props._wrapInDivTag}
            content={content}
        >
            {children}
        </LWRender>
    );
}

// Внутренний компонент, используемый в совместимости с WML
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
