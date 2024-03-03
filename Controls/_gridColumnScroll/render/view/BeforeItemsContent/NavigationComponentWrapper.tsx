/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import * as React from 'react';
import {
    ColumnScrollContext,
    IColumnScrollContext,
    NavigationComponent,
    INavigationComponentProps,
    ColumnScrollUtils,
} from 'Controls/columnScrollReact';

export interface IInnerNavigationComponentWrapperProps
    extends INavigationComponentWrapperConsumerProps,
        Pick<
            IColumnScrollContext,
            | 'startFixedWidth'
            | 'endFixedWidth'
            | 'viewPortWidth'
            | 'contentWidth'
            | 'isMobileScrolling'
            | 'SELECTORS'
        > {}

export const InnerNavigationComponentWrapper = React.memo(
    (props: IInnerNavigationComponentWrapperProps) => {
        const className = [
            'controls-GridReact__columnScroll__headerNavigation',
            `controls-GridReact__columnScroll__headerNavigation-part_${props.part}`,
            `controls-GridReact__columnScroll__headerNavigation-mode_${props.mode}`,
        ].join(' ');

        const scrollBarStyle: React.CSSProperties = {
            width: ColumnScrollUtils.getScrollableViewPortWidth(props) || 'auto',
        };

        if (props.part === 'scrollable') {
            // Во время скроллирования на мобильных устройствах скрываем навигацию
            // в скроллируемой части таблицы, т.к. по специфике механизма скроллирования,
            // она уедет вместе с контентом и займет верное положение после завершения скроллирования.
            // Все зафиксированные при скролле элементы находятся в фиксированной части.
            if (props.isMobileScrolling) {
                scrollBarStyle.display = 'none';
            }
        }

        // Нужно несколько оберток, подробнее ниже по тегу #Structure
        return (
            <div className={className} style={scrollBarStyle}>
                <NavigationComponent
                    className={props.SELECTORS.FIXED_ELEMENT}
                    mode={props.mode}
                    scrollBarValign={props.hasGridStickyHeader ? 'center' : 'bottom'}
                />
            </div>
        );
    }
);

interface INavigationComponentWrapperConsumerProps extends Pick<INavigationComponentProps, 'mode'> {
    hasGridStickyHeader: boolean;
    part: 'scrollable' | 'fixed';
}

export { INavigationComponentWrapperConsumerProps as INavigationComponentWrapperProps };

export default React.memo(function NavigationComponentWrapperConsumer(
    props: INavigationComponentWrapperConsumerProps
) {
    const context = React.useContext(ColumnScrollContext);

    return (
        <InnerNavigationComponentWrapper
            part={props.part}
            hasGridStickyHeader={props.hasGridStickyHeader}
            mode={props.mode}
            viewPortWidth={context.viewPortWidth}
            startFixedWidth={context.startFixedWidth}
            endFixedWidth={context.endFixedWidth}
            contentWidth={context.contentWidth}
            SELECTORS={context.SELECTORS}
            isMobileScrolling={context.isMobileScrolling}
        />
    );
});

/*
 * #StickyContentRoot
 *
 * Во первых, стики шапка клонирует детей и накидывает опции, перебивая
 * собственные опции детей, например, className и mode, которые имеет NavigationComponent.
 * Во вторых, стики шапка через переданный в className классе задает
 * минимальную высоту контента, лечит так ошибки связанные с ResizeObserver.
 *
 *
 * #Structure
 *
 * Верстка должна иметь такую структуру:
 * StickyBlock
 *  => content div(причина описана по тегу #StickyContentRoot)
 *   => NavWrapper1 div (задать min-height, т.к. контент этого враппера будет pos:abs, актуально для arrows)
 *      Минимальная высота нужна, т.к. навигация стрелками занимает высоту в таблице, между шапкой
 *      и элементами. В обоих частях таблицы это должно сохраняться, иначе части таблицы будут несимметричны.
 *    => NavWrapper(pos:abs, чтобы отобразить фиксированную навигацию в скроллируемой области)
 *     => Nav
 * */
