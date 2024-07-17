/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import * as React from 'react';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import StickyShadow from 'Controls/_stickyBlock/StickyShadow';
import StickyObserver from 'Controls/_stickyBlock/StickyObserver';
import {
    FixedPosition,
    IStickyContextModel,
    Mode,
    StickyPosition,
    StickyShadowVisibility,
    StickyVerticalPosition,
} from 'Controls/_stickyBlock/types';
import 'css!Controls/stickyBlock';
import { detection } from 'Env/Env';
import { getPixelRatioBugFixClass } from 'Controls/_stickyBlock/BugFixes/PixelRatioBug';
import { getSubPixelArtifactBugFixClass } from 'Controls/_stickyBlock/BugFixes/SubPixelArtifactBug';
import { CONTENT_CLASS } from 'Controls/_stickyBlock/constants';
import { getNextId, isStickySupport } from 'Controls/_stickyBlock/Utils/Utils';
import { usePreviousProps } from 'Controls/_stickyBlock/Hooks/UsePreviusProps';
import { delimitProps } from 'UICore/Jsx';
import { Logger } from 'UICommon/Utils';
import { EMPTY_STICKY_MODEL, EMPTY_STICKY_GROUPED_MODEL } from './constants';

const getShadowVisible = (
    contextModel: IStickyContextModel,
    shadowVisibility: StickyShadowVisibility
) => {
    return {
        top: contextModel
            ? contextModel.shadow.top
            : shadowVisibility === StickyShadowVisibility.Initial,
        bottom: contextModel
            ? contextModel.shadow.bottom
            : shadowVisibility === StickyShadowVisibility.Initial,
        left: contextModel
            ? contextModel.shadow.left
            : shadowVisibility === StickyShadowVisibility.Initial,
        right: contextModel
            ? contextModel.shadow.right
            : shadowVisibility === StickyShadowVisibility.Initial,
    };
};

const isBackgroundDefault = (backgroundStyle: string, contextModel: IStickyContextModel) => {
    const isFixed = contextModel?.fixedPosition || '';
    return !(backgroundStyle && (backgroundStyle !== 'default' || isFixed));
};

const getBackgroundClass = (
    backgroundStyle: string,
    fixedBackgroundStyle: string,
    contextModel: IStickyContextModel
) => {
    if (contextModel?.fixedPosition && fixedBackgroundStyle) {
        return `controls-background-${fixedBackgroundStyle}`;
    }

    const isBackgroundDefaultSticky = isBackgroundDefault(backgroundStyle, contextModel);
    if (isBackgroundDefaultSticky) {
        return 'controls-background-default-sticky';
    }

    return `controls-background-${backgroundStyle}`;
};

const isStickyEnabled = (mode, stickyRef) => {
    if (
        stickyRef.current &&
        !stickyRef.current.closest('.controls-Scroll, .controls-Scroll-Container')
    ) {
        Logger.warn(
            'Controls.stickyBlock:StickyBlock: Используются фиксация вне Controls.scroll:Container. Либо используйте Controls.scroll:Container, либо отключите фиксацию заголовков в контролах в которых она включена.',
            this
        );
        return false;
    }
    return isStickySupport() && mode !== Mode.NotSticky;
};

const getPositionOffset = (position, stickyModel, props, stickyRef): number => {
    const isFirstRender = !stickyModel;
    let isStickedOnPosition = false;
    if (props.position) {
        isStickedOnPosition =
            props.position.toLowerCase().indexOf(position) !== -1 &&
            isStickyEnabled(props.mode, stickyRef);
    }
    if (isFirstRender && isStickedOnPosition) {
        return position === StickyPosition.Top ? props.offsetTop : (
            position === StickyPosition.Bottom ? (props.offsetTop || 0) : 0
        );
    }
    return stickyModel?.offset[position];
};

const isDOMTypeElement = (element) => {
    return React.isValidElement(element) && typeof element.type === 'string';
};

function StickyBlockReactView({ stickyModel, setStickyId, shadowMode, ...props }) {
    const stickyRef = React.useRef(null);
    const observerTop = React.useRef(null);
    const observerTop2 = React.useRef(null);
    const observerTop2Right = React.useRef(null);
    const observerBottomLeft = React.useRef(null);
    const observerBottomRight = React.useRef(null);
    const observerLeft = React.useRef(null);
    const observerRight = React.useRef(null);
    const [borderWidth, setBorderWidth] = React.useState({
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
    });

    const shadowStyle = props.horizontalScrollMode === 'custom' ? 'custom' : 'default';

    const id = React.useRef(getNextId());
    const getId = () => {
        return id.current;
    };

    // https://online.sbis.ru/opendoc.html?guid=b4c45beb-38b3-425d-b1c3-1b453fb619f6
    props.attrs = { ...props.attrs, ...props.stickyAttrs };
    const { userAttrs, clearProps } = delimitProps(props);

    const shadowVisible = getShadowVisible(stickyModel, props.shadowVisibility);
    const { className, style } = wasabyAttrsToReactDom(userAttrs);

    const prevProps = usePreviousProps(
        {
            mode: props.mode,
            offsetTop: props.offsetTop,
            offsetLeft: props.offsetLeft,
            syntheticFixedPosition: stickyModel?.syntheticFixedPosition,
            className,
        },
        {
            mode: undefined,
            offsetTop: undefined,
            offsetLeft: undefined,
            syntheticFixedPosition: undefined,
            className: null,
        }
    );

    React.useLayoutEffect(() => {
        const idTemp = getId();
        setStickyId(idTemp);

        const registerData = getRegisterData(idTemp);
        if (isStickyEnabled(props.mode, stickyRef)) {
            props.register(registerData);
        }
        return () => {
            if (isStickyEnabled(props.mode, stickyRef)) {
                props.unregister(idTemp);
                props.onFixedCallback({
                    id: getId(),
                    fixedPosition: FixedPosition.None,
                    prevPosition:
                        stickyModel?.syntheticFixedPosition.prevPosition || FixedPosition.None,
                    content: stickyRef.current,
                });
            }
        };
    }, []);

    React.useLayoutEffect(() => {
        if (!isStickyEnabled(props.mode, stickyRef)) {
            return;
        }

        if (prevProps.mode && props.mode !== prevProps.mode && prevProps.mode !== undefined) {
            if (prevProps.mode === Mode.NotSticky) {
                props.register(getRegisterData(getId()));
            } else {
                props.modeChanged(getId(), props.mode);
            }
        }

        const nowInitialization = getId() === '';
        if (
            !nowInitialization &&
            ((props.offsetTop !== prevProps.offsetTop && prevProps.offsetTop !== undefined) ||
                (props.offsetLeft !== prevProps.offsetLeft && prevProps.offsetLeft !== undefined))
        ) {
            const offsetValue =
                props.position === StickyPosition.Left ? props.offsetLeft : props.offsetTop;
            props.offsetChanged(getId(), offsetValue);
        }

        if (
            JSON.stringify(stickyModel?.syntheticFixedPosition) !==
            JSON.stringify(prevProps.syntheticFixedPosition)
        ) {
            props.onFixedCallback({
                id: getId(),
                fixedPosition:
                    stickyModel?.syntheticFixedPosition.fixedPosition || FixedPosition.None,
                prevPosition:
                    stickyModel?.syntheticFixedPosition.prevPosition || FixedPosition.None,
            });
        }
    }, [props.mode, props.offsetTop, props.offsetLeft, stickyModel?.syntheticFixedPosition]);

    const getRegisterData = (id: string) => {
        return {
            id,
            stickyRef,
            observers: {
                observerTop,
                observerTop2,
                observerTop2Right,
                observerBottomLeft,
                observerBottomRight,
                observerLeft,
                observerRight,
            },
            props: {
                mode: props.mode,
                position: props.position,
                shadowVisibility: props.shadowVisibility,
                offsetTop: props.offsetTop,
                offsetLeft: props.offsetLeft,
                initiallyFixed: props.initiallyFixed,
            },
            isGroup: false,
        };
    };

    const getZIndex = (position: StickyVerticalPosition) => {
        let zIndex;
        if (position && stickyRef.current) {
            // В ios на стикиблоках всегда установлен z-index: fixedZIndex,
            // т.к в момент оттягивания из-за смены z-index происходят прыжки.
            // Из-за этого возникает следующая проблема: в списке лежат стики и не стики элементы. У не стики элеметов
            // присутствует весло с itemAction. Если следующим элементом идёт стикиблок, то он перекроет весло.
            // Получается, нужно чтобы весло был выше незафиксированного стикиблока, но ниже зафиксированного.
            if (props._isIosZIndexOptimized || stickyModel?.fixedPosition) {
                zIndex = props.fixedZIndex;
            }
        } else if (props.zIndex) {
            zIndex = props.zIndex;
        }

        return zIndex;
    };

    const styles = React.useMemo(() => {
        const isIosOptimizedMode = detection.isMobileIOS && props.task1181007458 !== true;
        const top = getPositionOffset(StickyPosition.Top, stickyModel, props, stickyRef);
        const bottom = getPositionOffset(StickyPosition.Bottom, stickyModel, props, stickyRef);
        const left = getPositionOffset(StickyPosition.Left, stickyModel, props, stickyRef);
        const right = getPositionOffset(StickyPosition.Right, stickyModel, props, stickyRef);
        const resultStyle = {
            top,
            bottom,
            left,
            right,
            zIndex: undefined,
        };

        // На IOS чтобы избежать дерганий скролла при достижении нижней или верхей границы, требуется
        // отключить обновления в DOM дереве дочерних элементов скролл контейнера. Сейчас обновления происходят
        // в прилипающих заголовках в аттрибуте style при закреплении/откреплении заголовка. Опция позволяет
        // отключить эти обновления.
        // Повсеместно включать нельзя, на заголовках где есть бордеры или в контенте есть разные цвета фона
        // могут наблюдаться проблемы.
        let optimizedPosition = stickyModel?.fixedPosition || '';
        if (!optimizedPosition && isIosOptimizedMode) {
            optimizedPosition = props.position;
        }
        resultStyle.zIndex = getZIndex(optimizedPosition);
        return { ...resultStyle, ...style };
    }, [stickyModel, props.position, props.fixedZIndex, props.zIndex, userAttrs.style]);

    const getClasses = () => {
        const classResult = [];
        const backgroundStyle = isBackgroundDefault(props.backgroundStyle, stickyModel)
            ? 'backgroundDefault'
            : stickyModel?.fixedPosition
            ? props.fixedBackgroundStyle || props.backgroundStyle
            : props.backgroundStyle;
        if (props.pixelRatioBugFix) {
            classResult.push(getPixelRatioBugFixClass(backgroundStyle));
        }
        if (props.subPixelArtifactFix) {
            classResult.push(
                getSubPixelArtifactBugFixClass(
                    stickyModel?.fixedPosition && props.fixedBackgroundStyle
                        ? props.fixedBackgroundStyle
                        : backgroundStyle
                )
            );
        }
        classResult.push(
            getBackgroundClass(props.backgroundStyle, props.fixedBackgroundStyle, stickyModel)
        );
        classResult.push(className);
        return classResult.join(' ');
    };

    function updateBorderWidth(): void {
        if (prevProps.className === null || prevProps.className !== className) {
            const styles = getComputedStyle(stickyRef.current);
            const newBorderWidth = {
                borderTopWidth: parseInt(styles['border-top-width'], 10),
                borderBottomWidth: parseInt(styles['border-bottom-width'], 10),
                borderLeftWidth: parseInt(styles['border-left-width'], 10),
                borderRightWidth: parseInt(styles['border-left-width'], 10),
            };
            if (JSON.stringify(borderWidth) !== JSON.stringify(newBorderWidth)) {
                setBorderWidth(newBorderWidth);
            }
        }
    }

    const setRef = (node) => {
        if (!node) {
            return;
        }
        stickyRef.current = node;
        props.$wasabyRef(node);
        updateBorderWidth();
    };

    delete clearProps.children;
    const updatedChildren = React.Children.map(props.children, (child) => {
        let className = CONTENT_CLASS;
        if (child.props?.className) {
            className = ' ' + child.props.className;
        }
        if (isDOMTypeElement(child)) {
            return React.cloneElement(child, {
                className,
            });
        } else {
            const childProps = { ...clearProps };
            delete childProps['data-qa'];
            return React.cloneElement(child, {
                isHeaderFixed: stickyModel?.fixedPosition,
                stickyContentClass: CONTENT_CLASS,
                className,
                wasabyContext: props.wasabyContext,
                ...childProps,
                style: undefined,
                shadowVisibility: undefined,
            });
        }
    });

    return (
        <div
            data-qa={clearProps['data-qa']}
            {...wasabyAttrsToReactDom(userAttrs)}
            className={`controls-StickyBlock ${getClasses()}`}
            style={styles}
            ref={setRef}
            onClick={(e) => {
                return props.onClick?.(e);
            }}
            onContextMenu={(e) => {
                return props.onContextMenu?.(e);
            }}
            onMouseUp={(e) => {
                return props.onMouseUp?.(e);
            }}
            onMouseDown={(e) => {
                return props.onMouseDown?.(e);
            }}
            onMouseEnter={(e) => {
                return props.onMouseEnter?.(e);
            }}
            onMouseMove={(e) => {
                return props.onMouseMove?.(e);
            }}
            onTouchMove={(e) => {
                return props.onTouchMove?.(e);
            }}
            onTouchStart={(e) => {
                return props.onTouchStart?.(e);
            }}
            onTouchEnd={(e) => {
                return props.onTouchEnd?.(e);
            }}
        >
            {updatedChildren}

            {isStickyEnabled(props.mode, stickyRef) ? (
                <>
                    {/* OBSERVERS*/}
                    <StickyObserver
                        ref={observerTop}
                        position={'top'}
                        offset={
                            stickyModel?.offset.top ||
                            getPositionOffset(StickyPosition.Top, stickyModel, props, stickyRef)
                        }
                        borderWidth={borderWidth.borderTopWidth}
                    />
                    <StickyObserver
                        ref={observerTop2}
                        position={'top2'}
                        offset={0}
                        borderWidth={borderWidth.borderTopWidth}
                    />
                    <StickyObserver
                        ref={observerTop2Right}
                        position={'top2Right'}
                        offset={0}
                        borderWidth={borderWidth.borderTopWidth}
                    />
                    <StickyObserver
                        ref={observerBottomLeft}
                        position={'bottomLeft'}
                        offset={
                            stickyModel?.offset.bottom ||
                            getPositionOffset(StickyPosition.Bottom, stickyModel, props, stickyRef)
                        }
                        borderWidth={borderWidth.borderBottomWidth}
                    />
                    <StickyObserver
                        ref={observerBottomRight}
                        position={'bottomRight'}
                        offset={
                            stickyModel?.offset.bottom ||
                            getPositionOffset(StickyPosition.Bottom, stickyModel, props, stickyRef)
                        }
                        borderWidth={borderWidth.borderBottomWidth}
                    />
                    <StickyObserver
                        ref={observerLeft}
                        position={'left'}
                        offset={
                            stickyModel?.offset.left ||
                            getPositionOffset(StickyPosition.Left, stickyModel, props, stickyRef)
                        }
                        borderWidth={borderWidth.borderLeftWidth}
                    />
                    <StickyObserver
                        ref={observerRight}
                        position={'right'}
                        offset={
                            stickyModel?.offset.right ||
                            getPositionOffset(StickyPosition.Right, stickyModel, props, stickyRef)
                        }
                        borderWidth={borderWidth.borderRightWidth}
                    />

                    {/* SHADOWS*/}
                    {(stickyModel?.offset.top !== undefined ||
                        stickyModel?.offset.bottom !== undefined) && (
                        <StickyShadow
                            isVisible={shadowVisible.top}
                            shadowVisibility={props.shadowVisibility}
                            shadowStyle={'default'}
                            orientation={'horizontal'}
                            position={'top'}
                            shadowMode={shadowMode}
                        />
                    )}
                    {(stickyModel?.offset.top !== undefined ||
                        stickyModel?.offset.bottom !== undefined) && (
                        <StickyShadow
                            isVisible={shadowVisible.bottom}
                            shadowVisibility={props.shadowVisibility}
                            shadowStyle={'default'}
                            orientation={'horizontal'}
                            position={'bottom'}
                            shadowMode={shadowMode}
                        />
                    )}
                    {(stickyModel?.offset.left !== undefined ||
                        stickyModel?.offset.right !== undefined) && (
                        <StickyShadow
                            isVisible={shadowVisible.left}
                            shadowVisibility={props.shadowVisibility}
                            shadowStyle={shadowStyle}
                            orientation={'vertical'}
                            position={'left'}
                            shadowMode={shadowMode}
                        />
                    )}
                    {(stickyModel?.offset.left !== undefined ||
                        stickyModel?.offset.right !== undefined) && (
                        <StickyShadow
                            isVisible={shadowVisible.right}
                            shadowVisibility={props.shadowVisibility}
                            shadowStyle={shadowStyle}
                            orientation={'vertical'}
                            position={'right'}
                            shadowMode={shadowMode}
                        />
                    )}
                </>
            ) : null}
        </div>
    );
}

const propsAreEqual = (prevProps, curProps) => {
    if (
        prevProps.children !== curProps.children ||
        prevProps.shadowVisibility !== curProps.shadowVisibility ||
        prevProps.fixedZIndex !== curProps.fixedZIndex ||
        prevProps.zIndex !== curProps.zIndex ||
        prevProps.backgroundStyle !== curProps.backgroundStyle ||
        prevProps.mode !== curProps.mode ||
        prevProps.position !== curProps.position ||
        prevProps.content !== curProps.content ||
        prevProps.offsetLeft !== curProps.offsetLeft ||
        JSON.stringify(prevProps.attrs) !== JSON.stringify(curProps.attrs) ||
        prevProps.className !== curProps.className
    ) {
        return false;
    }

    const emptyStickyModel =
        curProps.position === 'left' ? EMPTY_STICKY_GROUPED_MODEL : EMPTY_STICKY_MODEL;
    // После регистрации блока, в пропсы придет заполненная undefined'ами stickyModel, в prevProps будет лежать
    // undefined. Не будем вызывать обновление в таком случае
    const prevPropsStickyModel = prevProps.stickyModel || {
        ...emptyStickyModel,
        offset: {
            top: getPositionOffset(StickyPosition.Top, prevProps.stickyModel, curProps, {
                current: undefined,
            }),
            bottom: getPositionOffset(StickyPosition.Bottom, prevProps.stickyModel, curProps, {
                current: undefined,
            }),
            left: getPositionOffset(StickyPosition.Left, prevProps.stickyModel, curProps, {
                current: undefined,
            }),
            right: getPositionOffset(StickyPosition.Right, prevProps.stickyModel, curProps, {
                current: undefined,
            }),
        },
    };
    const curPropsStickyModel = curProps.stickyModel || {
        ...emptyStickyModel,
        offset: {
            top: getPositionOffset(StickyPosition.Top, prevProps.stickyModel, curProps, {
                current: undefined,
            }),
            bottom: getPositionOffset(StickyPosition.Bottom, prevProps.stickyModel, curProps, {
                current: undefined,
            }),
            left: getPositionOffset(StickyPosition.Left, prevProps.stickyModel, curProps, {
                current: undefined,
            }),
            right: getPositionOffset(StickyPosition.Right, prevProps.stickyModel, curProps, {
                current: undefined,
            }),
        },
    };
    return JSON.stringify(prevPropsStickyModel) === JSON.stringify(curPropsStickyModel);
};

export default React.memo(StickyBlockReactView, propsAreEqual);
