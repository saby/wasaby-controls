import * as React from 'react';
import { IColumnScrollWidths } from '../common/interfaces';
import { ColumnScrollContext } from '../context/ColumnScrollContext';
import ScrollEventsManager from './ScrollEventsManager';
import MirrorView from './MirrorView';

/*
 * Опции компонента "Зеркало".
 */
export interface IMirrorComponentProps extends IColumnScrollWidths {
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
function MirrorComponent(
    props: IMirrorComponentProps
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
            content={(contentProps) => {
                return (
                    <MirrorView
                        viewPortWidth={props.viewPortWidth}
                        contentWidth={props.contentWidth}
                        fixedWidth={props.fixedWidth}
                        onTouchStart={contentProps.onTouchStart}
                        onTouchEnd={contentProps.onTouchEnd}
                        onScroll={contentProps.onScroll}
                    />
                );
            }}
        />
    );
}

const MirrorComponentMemo = React.memo(MirrorComponent);

export function MirrorComponentConsumer(): React.FunctionComponentElement<{}> {
    const context = React.useContext(ColumnScrollContext);
    const ctx = React.useRef(context);

    React.useEffect(() => {
        ctx.current = context;
    });

    const onScroll = React.useCallback<IMirrorComponentProps['onScroll']>(
        (scrollPosition: number) => {
            ctx.current.setPosition(scrollPosition);
        },
        []
    );

    const onScrollStarted = React.useCallback(() => {
        ctx.current.setIsMobileScrolling(true);
    }, []);

    const onScrollStopped = React.useCallback(() => {
        ctx.current.setIsMobileScrolling(false);
    }, []);

    return (
        <MirrorComponentMemo
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
