import * as React from 'react';
import { IColumnScrollWidths } from '../common/interfaces';
import { ColumnScrollContext, PrivateContextUserSymbol } from '../context/ColumnScrollContext';
import ScrollEventsManager from './ScrollEventsManager';
import MirrorView, { IMirrorViewAPI } from './MirrorView';

/*
 * Опции компонента "Зеркало".
 */
export interface IMirrorComponentProps extends IColumnScrollWidths, IMirrorComponentConsumerProps {
    onScroll?: (scrollPosition: number) => void;
    onScrollStarted?: () => void;
    onScrollStopped?: () => void;
}

/**
 * Компонент "Зеркало" для горизонтального скролирования в таблицах.
 * Компонент отображает невидимый блок с нативным скролом внутри и уведомляет о нем.
 * Также, по нему можно отследить начало и конец скролирования, с помощью колбеков: onScrollStarted и onScrollStopped.
 * Нативные события, не обрабатываемые зеркалом, проксируются "под" него.
 * Событие останавливается, зеркало синхронно скрываетс свою вёрстку, получает элемент по координатам события и делает
 * dispatchEvent на нем с клоном изначального события.
 * @private
 * @param {IMirrorComponentProps} props Опции компонента "Зеркало".
 * @constructor
 */
const MirrorComponent = React.memo(
    React.forwardRef(function MirrorComponent(
        props: IMirrorComponentProps,
        forwardedRef: React.ForwardedRef<IMirrorViewAPI>
    ): React.FunctionComponentElement<IMirrorComponentProps> {
        // Компонент ScrollEventsManager слушает события скролла и тача и нотифицирует о фактическом начале и конце скролла.
        // Он учитывает инерционность, прерывание инерционности тачем, скролл неотрывным тачем и тому подобные кейсы.
        // !!! ScrollEventsManager стреляет завершением скролла с задержкой, для оптимизации тяжелого рендеринга
        // фиксированной колонки, потому что может начаться еще один скролл и,
        // возможно не надо пока делать этот просчет. ЭКСПЕРИМЕНТ.
        return (
            <ScrollEventsManager
                onScrollStarted={props.onScrollStarted}
                onScroll={props.onScroll}
                onScrollStopped={props.onScrollStopped}
            >
                <MirrorView
                    ref={forwardedRef}
                    className={props.className}
                    viewPortWidth={props.viewPortWidth}
                    contentWidth={props.contentWidth}
                    fixedWidth={props.fixedWidth}
                />
            </ScrollEventsManager>
        );
    })
);

export interface IMirrorComponentConsumerProps {
    className?: string;
}

export function MirrorComponentConsumer(props: IMirrorComponentConsumerProps): JSX.Element {
    const context = React.useContext(ColumnScrollContext);
    const viewRef = React.useRef<IMirrorViewAPI>();

    const [localPosition, setLocalPosition] = React.useState(context.position);

    React.useLayoutEffect(() => {
        if (localPosition !== context.position) {
            setLocalPosition(context.position);
            viewRef.current?.setScrollPosition?.(context.position);
        }
    }, [localPosition, context.position]);

    React.useLayoutEffect(() => {
        if (typeof context.mobileSmoothedScrollPosition === 'number') {
            viewRef.current?.setScrollPosition?.(context.mobileSmoothedScrollPosition, true);
        }
    }, [context.mobileSmoothedScrollPosition]);

    const onScroll = React.useCallback<IMirrorComponentProps['onScroll']>(
        (scrollPosition: number) => {
            const ctx = context.contextRefForHandlersOnly.current;
            ctx.setPosition(scrollPosition, undefined, PrivateContextUserSymbol);
            setLocalPosition(scrollPosition);
        },
        []
    );

    const onScrollStarted = React.useCallback(() => {
        const ctx = context.contextRefForHandlersOnly.current;
        ctx.setIsMobileScrolling(true);
    }, []);

    const onScrollStopped = React.useCallback(() => {
        const ctx = context.contextRefForHandlersOnly.current;
        ctx.setIsMobileScrolling(false);
    }, []);

    return (
        <MirrorComponent
            ref={viewRef}
            className={props.className}
            viewPortWidth={context.viewPortWidth}
            contentWidth={context.contentWidth}
            fixedWidth={context.fixedWidth}
            onScroll={onScroll}
            onScrollStarted={onScrollStarted}
            onScrollStopped={onScrollStopped}
        />
    );
}

export default React.memo(MirrorComponentConsumer);
