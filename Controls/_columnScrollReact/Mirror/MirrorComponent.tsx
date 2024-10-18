/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
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
 *
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
                    startFixedWidth={props.startFixedWidth}
                    endFixedWidth={props.endFixedWidth}
                />
            </ScrollEventsManager>
        );
    })
);

export interface IMirrorComponentConsumerProps {
    className?: string;
}

export function MirrorComponentConsumer(props: IMirrorComponentConsumerProps): React.JSX.Element {
    const context = React.useContext(ColumnScrollContext);
    const viewRef = React.useRef<IMirrorViewAPI>();

    const [localPosition, setLocalPosition] = React.useState(0);

    const syncPositionDownByTree = React.useCallback((position) => {
        setLocalPosition(position);
        viewRef.current?.setScrollPosition?.(position);
    }, []);

    // После инициализации размеров, нужно синхронизировать позицию с зеркалом
    React.useLayoutEffect(() => {
        if (context.isNeedByWidth) {
            syncPositionDownByTree(context.position);
        }
    }, [context.isNeedByWidth, syncPositionDownByTree]);

    React.useLayoutEffect(() => {
        if (localPosition !== context.position) {
            syncPositionDownByTree(context.position);
        }
    }, [localPosition, context.position]);

    React.useLayoutEffect(() => {
        if (typeof context.mobileSmoothedScrollPosition === 'number') {
            viewRef.current?.setScrollPosition?.(context.mobileSmoothedScrollPosition, true);
        }
    }, [context.mobileSmoothedScrollPosition]);

    const onScroll = React.useCallback<Required<IMirrorComponentProps>['onScroll']>(
        (scrollPosition: number) => {
            context.setPosition(scrollPosition, undefined, PrivateContextUserSymbol);
            setLocalPosition(scrollPosition);
        },
        []
    );

    const onScrollStarted = React.useCallback(() => {
        context.setIsMobileScrolling(true);
    }, []);

    const onScrollStopped = React.useCallback(() => {
        context.setIsMobileScrolling(false);
    }, []);

    return (
        <MirrorComponent
            ref={viewRef as React.MutableRefObject<IMirrorViewAPI>}
            className={props.className}
            viewPortWidth={context.viewPortWidth}
            contentWidth={context.contentWidth}
            startFixedWidth={context.startFixedWidth}
            endFixedWidth={context.endFixedWidth}
            onScroll={onScroll}
            onScrollStarted={onScrollStarted}
            onScrollStopped={onScrollStopped}
        />
    );
}

export default React.memo(MirrorComponentConsumer);
