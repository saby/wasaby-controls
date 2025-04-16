/**
 * @kaizen_zone dc88ba31-6327-460a-b366-c49086f87c38
 */
import {
    ReactElement,
    useRef,
    useEffect,
    useState,
    CSSProperties,
    forwardRef,
    useCallback,
    LegacyRef,
} from 'react';
import { IComponentProps } from 'Controls/interface';
import { StickyBlock } from 'Controls/stickyBlock';
import { ResizeObserverUtil } from 'Controls/sizeUtils';
import { Listener } from 'Controls/event';
import { IScrollState } from 'Controls/scroll';
import { Logger } from 'UI/Utils';

/**
 * Интерфейс для компонента
 * @interface Controls/StickyBlockDouble/IStickyBlockDoubleProps
 * @public
 */
interface IStickyBlockDoubleProps extends IComponentProps {
    /**
     * Шаблон компактной шапки
     */
    compactContentTemplate?: ReactElement;
    /**
     * Шаблон нормальной шапки
     */
    contentTemplate?: ReactElement;
    /**
     * Режим отображения тени.
     * @remark {@link Controls/scroll:IShadows#shadowMode Подробнее}
     * @demo Controls-demo/Scroll/StickyBlock/ShadowMode/Rounded/Index
     */
    shadowMode?: string;
    /**
     * Режим прилипания заголовка.
     * @demo Controls-demo/Scroll/StickyBlock/Mode/Index
     * @demo Controls-demo/StickyBlock/Mode/Index
     */
    mode?: 'replaceable' | 'stackable' | 'dynamic';
}

interface IStickyBlockDoubleState {
    /**
     * Высота компактной шапки
     */
    compactContentHeight: number;
    /**
     * Определяет в первый раз попали в observer компактной шапки или нет
     */
    isFirstCompactObserver?: boolean;
    /**
     * Высота нормальной шапки
     */
    normalContentHeight: number;
    /**
     * Определяет в первый раз попали в observer нормальной шапки или нет
     */
    isFirstNormalObserver?: boolean;
    /**
     * Отступ от верха окна шапки
     */
    headerClientTop: number;
    /**
     * Отступ от верха шапки с учетом позиции скрола
     */
    headerTop?: number;
}

/**
 * Компонент для отрисовки стики блока с двумя содержимыми
 * @class Controls/StickyBlockDouble:default
 * @implements Controls/StickyBlockDouble/IStickyBlockDoubleProps
 * @public
 * @demo Controls-demo/StickyBlockDouble/Index
 */
export default forwardRef(function StickyBlockDouble(
    props: IStickyBlockDoubleProps,
    ref: LegacyRef<StickyBlock>
) {
    const normalContentRef = useRef<HTMLElement>(null);
    const compactContentRef = useRef<HTMLElement>(null);
    const [offsetTop, setOffsetTop] = useState<number>(0);
    // Начальный position: absolute нужен для того, чтобы не было морганий при построении на сервере.
    // В дальнейшем заменится на sticky и перекроется нормальной шапкой через отрицательный margin-top
    const [stickyStyle, setStickyStyle] = useState<CSSProperties>({
        position: 'absolute',
        top: 0,
        opacity: 0,
        transition: 'opacity 0.1s',
    });
    const [contentStyle, setContentStyle] = useState<CSSProperties>({
        transition: 'opacity 0.1s',
    });

    const state = useRef<IStickyBlockDoubleState>({
        compactContentHeight: 0,
        normalContentHeight: 0,
        headerClientTop: 0,
    });

    useEffect(() => {
        const compactContentObserver = new ResizeObserverUtil(null, ([entity]) => {
            if (!entity.contentBoxSize[0]?.blockSize) {
                return;
            }
            state.current.compactContentHeight = entity.contentBoxSize[0].blockSize;
            // при 1 построении не нужно определять offsetTop
            if (state.current.isFirstCompactObserver === false) {
                setOffsetTop(
                    state.current.compactContentHeight - state.current.normalContentHeight
                );
            }
            state.current.isFirstCompactObserver = false;

            setContentStyle((oldStyle) => {
                return {
                    ...oldStyle,
                    marginTop: state.current.compactContentHeight * -1,
                };
            });
        });
        const normalContentObserver = new ResizeObserverUtil(null, ([entity]) => {
            if (!entity.contentBoxSize[0]?.blockSize) {
                return;
            }
            state.current.normalContentHeight = entity.contentBoxSize[0].blockSize;
            // при 1 построении не нужно определять offsetTop
            if (state.current.isFirstNormalObserver === false) {
                setOffsetTop(
                    state.current.compactContentHeight - state.current.normalContentHeight
                );
            }
            state.current.isFirstNormalObserver = false;
        });
        if (compactContentRef.current) {
            compactContentObserver.observe(compactContentRef.current);
            state.current.compactContentHeight = compactContentRef.current.offsetHeight;
        }
        if (normalContentRef.current) {
            normalContentObserver.observe(normalContentRef.current);
            state.current.normalContentHeight = normalContentRef.current.offsetHeight;
        } else {
            Logger.error(
                'StickyBlockBouble: Не указана опция contentTemplate, компонент будет работать не корректно!'
            );
        }

        if (state.current.compactContentHeight && state.current.normalContentHeight) {
            setContentStyle({
                ...contentStyle,
                marginTop: state.current.compactContentHeight * -1,
            });
            setStickyStyle({
                ...stickyStyle,
                position: 'sticky',
            });
            state.current.headerClientTop =
                normalContentRef.current?.getBoundingClientRect().top || 0;
        }
        return () => {
            if (normalContentRef.current) {
                compactContentObserver.unobserve(normalContentRef.current);
            }
            if (compactContentRef.current) {
                normalContentObserver.unobserve(compactContentRef.current);
            }
        };
    }, []);

    const scrollStateChangedHandler = useCallback(
        (scrollState: IScrollState, oldScrollState: IScrollState) => {
            if (typeof state.current.headerTop === 'undefined') {
                const scrollClientRect = scrollState.content?.getBoundingClientRect();
                state.current.headerTop =
                    state.current.headerClientTop - (scrollClientRect?.top || 0);
            }

            if (state.current.normalContentHeight && state.current.compactContentHeight) {
                // Если позиция скрола изменилась, то пересчитываем offsetTop, всегда высчитывать его нельзя
                // так как если шапку расположить в середине контента, то скролбар отобразится с учетом шапки
                // такая логика нужна только в том случае, если шапка расположена в начале
                // В проверке 2 для подстраховки, на случай если будет zoom
                if (
                    (scrollState.scrollTop !== oldScrollState.scrollTop &&
                        oldScrollState.scrollTop !== undefined) ||
                    state.current.headerTop < 2
                ) {
                    setOffsetTop(
                        state.current.compactContentHeight - state.current.normalContentHeight
                    );
                }
                const diff = state.current.normalContentHeight - state.current.compactContentHeight;
                const scrollTop = (scrollState.scrollTop || 0) - state.current.headerTop;
                if (scrollTop) {
                    if (scrollTop >= diff) {
                        setStickyStyle((oldStyle) => {
                            // чтобы избежать лишних перерисовок
                            if (oldStyle.opacity === 1) {
                                return oldStyle;
                            }
                            return { ...oldStyle, opacity: 1 };
                        });
                        setContentStyle((oldStyle) => {
                            // чтобы избежать лишних перерисовок
                            if (!oldStyle.opacity) {
                                return oldStyle;
                            }
                            return { ...oldStyle, opacity: 0 };
                        });
                    } else {
                        const opacity = scrollTop / diff;
                        setStickyStyle((oldStyle) => {
                            return { ...oldStyle, opacity };
                        });
                        if (opacity < 0.8) {
                            setContentStyle((oldStyle) => {
                                // чтобы избежать лишних перерисовок
                                if (oldStyle.opacity) {
                                    return oldStyle;
                                }
                                return { ...oldStyle, opacity: 1 };
                            });
                        } else {
                            setContentStyle((oldStyle) => {
                                // чтобы избежать лишних перерисовок
                                if (!oldStyle.opacity) {
                                    return oldStyle;
                                }
                                return { ...oldStyle, opacity: 0 };
                            });
                        }
                    }
                } else {
                    setStickyStyle((oldStyle) => {
                        return { ...oldStyle, opacity: 0 };
                    });
                    setContentStyle((oldStyle) => {
                        return { ...oldStyle, opacity: 1 };
                    });
                }
            }
        },
        []
    );

    return (
        <StickyBlock
            className={props.className}
            // @ts-ignore
            style={props.style}
            dataQa={props.dataQa}
            offsetTop={offsetTop}
            mode={props.mode}
            ref={ref}
        >
            <div>
                <Listener
                    event="scrollStateChanged"
                    // @ts-ignore
                    onScrollStateChanged={scrollStateChangedHandler}
                />
                {props.compactContentTemplate && (
                    <div ref={compactContentRef as LegacyRef<HTMLDivElement>} style={stickyStyle}>
                        {props.compactContentTemplate}
                    </div>
                )}
                <div ref={normalContentRef as LegacyRef<HTMLDivElement>} style={contentStyle}>
                    {props.contentTemplate}
                </div>
            </div>
        </StickyBlock>
    );
});
