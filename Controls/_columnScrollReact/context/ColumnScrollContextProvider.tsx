import * as React from 'react';
import { getSelectorsState, ISelectorsProps } from '../common/selectors';
import { detection } from 'Env/Env';
import { EdgeState, TColumnScrollStartPosition } from '../common/types';
import {
    ColumnScrollContext,
    IColumnScrollContext,
    PrivateContextUserSymbol,
} from './ColumnScrollContext';
import { IColumnScrollWidths } from '../common/interfaces';
import {
    getEdgesState,
    getEdgesStateAfterScroll,
    getLimitedPosition,
    getMaxScrollPosition,
    isEdgeAnimated,
} from '../common/helpers';
import { DebugLogger } from '../common/DebugLogger';
import { Logger } from 'UICommon/Utils';
import 'css!Controls/columnScrollReact';

const NOTIFY_EDGE_STATE_CHANGED_OFFSET = 100;

export interface IColumnScrollContextProviderProps {
    GUID?: string;
    selectors?: ISelectorsProps;
    children: JSX.Element;
    columnScrollStartPosition?: TColumnScrollStartPosition;
    onEdgesStateChanged?: (leftEdgeState: EdgeState, rightEdgeState: EdgeState) => void;
    onPositionChanged?: (position: number) => void;
}

interface IEdgesState {
    left: EdgeState;
    right: EdgeState;
}

export function ColumnScrollContextProvider(
    props: IColumnScrollContextProviderProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.FunctionComponentElement<IColumnScrollContextProviderProps> {
    const [selectors] = React.useState(getSelectorsState(props.selectors, props.GUID || 'GUID'));
    const [columnScrollStartPosition] = React.useState(props.columnScrollStartPosition || 0);

    const [isMobile] = React.useState(detection.isMobilePlatform);
    const [mobileSmoothedScrollPosition, setMobileSmoothedScrollPosition] = React.useState<
        undefined | number
    >(undefined);
    const [isMobileScrolling, setIsMobileScrolling] = React.useState(false);

    const [position, _setPosition] = React.useState<number>(
        typeof columnScrollStartPosition === 'number' ? columnScrollStartPosition : 0
    );
    const setPosition = React.useCallback(
        (newPosition: number) => {
            _setPosition(newPosition);
            props.onPositionChanged?.(newPosition);
            DebugLogger.contextStateSetPosition(newPosition);
        },
        [_setPosition]
    );

    const [leftEdgeState, setLeftEdgeState] = React.useState<EdgeState>(
        typeof columnScrollStartPosition === 'number' && columnScrollStartPosition > 0
            ? EdgeState.Invisible
            : EdgeState.Visible
    );
    const [rightEdgeState, setRightEdgeState] = React.useState<EdgeState>(EdgeState.Visible);

    const [leftTriggerEdgeState, setLeftTriggerEdgeState] = React.useState<EdgeState>(
        typeof columnScrollStartPosition === 'number' &&
            columnScrollStartPosition > NOTIFY_EDGE_STATE_CHANGED_OFFSET
            ? EdgeState.Invisible
            : EdgeState.Visible
    );
    const [rightTriggerEdgeState, setRightTriggerEdgeState] = React.useState<EdgeState>(
        EdgeState.Visible
    );

    const [viewPortWidth, setViewPortWidth] = React.useState<number>(0);
    const [contentWidth, setContentWidth] = React.useState<number>(0);
    const [fixedWidth, setFixedWidth] = React.useState<number>(0);
    const [isNeedByWidth, setIsNeedByWidth] = React.useState(false);

    const positionRef = React.useRef(position);
    React.useEffect(() => {
        positionRef.current = position;
    });

    const setEdgesState = React.useCallback((oldState: IEdgesState, newState: IEdgesState) => {
        if (oldState.left !== newState.left) {
            setLeftEdgeState(newState.left);
        }

        if (oldState.right !== newState.right) {
            setRightEdgeState(newState.right);
        }
    }, []);

    const setTriggerEdgesState = React.useCallback(
        (oldState: IEdgesState, newState: IEdgesState) => {
            let isChanged = false;

            if (oldState.left !== newState.left && !isEdgeAnimated(newState.left)) {
                isChanged = true;
                setLeftTriggerEdgeState(newState.left);
            }

            if (oldState.right !== newState.right && !isEdgeAnimated(newState.right)) {
                isChanged = true;
                setRightTriggerEdgeState(newState.right);
            }

            if (isChanged && props.onEdgesStateChanged) {
                props.onEdgesStateChanged(newState.left, newState.right);
            }
        },
        [props.onEdgesStateChanged]
    );

    const updateSizes = React.useCallback(
        (
            privateContextUserSymbol: typeof PrivateContextUserSymbol,
            widths: Partial<IColumnScrollWidths>
        ) => {
            // Никто, кроме компонентов библиотеки не имеет доступа к этому методу.
            if (privateContextUserSymbol !== PrivateContextUserSymbol) {
                return;
            }
            const currentSizes: IColumnScrollWidths = {
                viewPortWidth,
                contentWidth,
                fixedWidth,
            };

            const newSizes: IColumnScrollWidths = {
                ...currentSizes,
                ...widths,
            };

            const hasAllSizes = (sizes: IColumnScrollWidths) =>
                sizes.fixedWidth !== 0 && sizes.contentWidth !== 0 && sizes.viewPortWidth !== 0;

            setViewPortWidth(newSizes.viewPortWidth);
            setContentWidth(newSizes.contentWidth);
            setFixedWidth(newSizes.fixedWidth);

            let newPosition = positionRef.current;

            if (hasAllSizes(newSizes)) {
                // Первая установка всех размеров.
                if (!hasAllSizes(currentSizes)) {
                    // Устанавливаем максимальную позицию скролла, если была установлена изначальная позиция скролла
                    // "вконец".
                    if (columnScrollStartPosition === 'end') {
                        newPosition = getMaxScrollPosition(newSizes);
                    }

                    // Если было передано конкретное значение в пикселях, то валидируем и корректируем его.
                    // Не нужно позволять устанавливать позицию больше или меньше возможной.
                    if (typeof columnScrollStartPosition === 'number') {
                        newPosition = getLimitedPosition(columnScrollStartPosition, newSizes);
                        if (newPosition < position || position < 0) {
                            Logger.warn(
                                'Ошибка конфигурации горизонтального скролл в таблице! \n' +
                                    'Задана неверная начальная позиция скролла! \n' +
                                    `Опции columnScrollStartPosition передано значение {${position}}(px), при допустимых значениях \n` +
                                    'от 0 до максимальной позиции скролла. \n' +
                                    `В данном построении это значение от 0 до ${getMaxScrollPosition(
                                        newSizes
                                    )}. \n` +
                                    'Скачек таблицы при построении по прикладной ошибке!'
                            );
                        }
                    }
                } else {
                    // TODO: #TEST
                    // Если контент стал меньше, то позицию скролла нужно ограничить по новому размеру.
                    newPosition = getLimitedPosition(newPosition, newSizes);
                }

                setPosition(newPosition);

                const newEdgesState = getEdgesState(newPosition, newSizes);

                setEdgesState(
                    {
                        left: leftEdgeState,
                        right: rightEdgeState,
                    },
                    newEdgesState
                );

                setTriggerEdgesState(
                    {
                        left: leftTriggerEdgeState,
                        right: rightTriggerEdgeState,
                    },
                    newEdgesState
                );

                setIsNeedByWidth(newSizes.contentWidth > newSizes.viewPortWidth);
            }
        },
        [
            viewPortWidth,
            contentWidth,
            fixedWidth,
            leftEdgeState,
            rightEdgeState,
            leftTriggerEdgeState,
            rightTriggerEdgeState,
            setEdgesState,
        ]
    );

    const setPositionCallback = React.useCallback(
        (
            newPosition: number,
            smooth?: boolean,
            privateContextUserSymbol?: typeof PrivateContextUserSymbol
        ) => {
            // eslint-disable-next-line no-param-reassign
            newPosition = getLimitedPosition(newPosition, {
                viewPortWidth,
                contentWidth,
                fixedWidth,
            });

            // На мобильной платформе недоступна анимация через CSS трансформацию,
            // с помощью которой сделана плавная прокрутка(smooth) к позиции.
            // На мобильной платформе используется нативный механизм скроллирования.
            // Подробное описание в интерфейсе контекста IColumnScrollContext.mobileSmoothedScrollPosition.
            if (smooth && isMobile) {
                setMobileSmoothedScrollPosition(newPosition);
                return;
            } else {
                setMobileSmoothedScrollPosition(undefined);
            }

            const maxScrollPosition = getMaxScrollPosition({
                fixedWidth,
                contentWidth,
                viewPortWidth,
            });

            const newEdgesState = getEdgesStateAfterScroll(
                [0, maxScrollPosition],
                position,
                newPosition,
                smooth
            );

            setEdgesState(
                {
                    left: leftEdgeState,
                    right: rightEdgeState,
                },
                newEdgesState
            );

            setTriggerEdgesState(
                {
                    left: leftTriggerEdgeState,
                    right: rightTriggerEdgeState,
                },
                newEdgesState
            );

            DebugLogger.contextSetPositionCalled(newPosition, smooth, privateContextUserSymbol);
            setPosition(newPosition);
        },
        [
            isMobile,
            leftEdgeState,
            rightEdgeState,
            leftTriggerEdgeState,
            rightTriggerEdgeState,
            position,
            viewPortWidth,
            contentWidth,
            fixedWidth,
        ]
    );

    const contextRefForHandlersOnly = React.useRef<IColumnScrollContext>();

    const contextValue = React.useMemo<IColumnScrollContext>(() => {
        const value = {
            contextRefForHandlersOnly,

            isMobile,
            isNeedByWidth,

            position,
            setPosition: setPositionCallback,

            leftEdgeState,
            rightEdgeState,

            isMobileScrolling,
            setIsMobileScrolling,
            mobileSmoothedScrollPosition,

            viewPortWidth,
            contentWidth,
            fixedWidth,

            SELECTORS: selectors,
            updateSizes,
        };

        contextRefForHandlersOnly.current = value;

        return value;
    }, [
        position,
        isMobile,
        setPositionCallback,
        isMobileScrolling,
        isNeedByWidth,
        leftEdgeState,
        rightEdgeState,
        viewPortWidth,
        contentWidth,
        fixedWidth,
        updateSizes,
        mobileSmoothedScrollPosition,
    ]);

    // TODO: Удалить когда либа листа перейдет на реакт.
    //  Такой проброс элемента нужен когда провайдер вставляется в wasaby окружение.
    //  В таком случае необходимо прокинуть ссылку до ближайшего div.
    //  Т.к. у провайдера нет вёрстки, навешивает ref первый ребенок с вёрсткой.
    //  Провайдер обязан лишь не прервать эту связь.
    return (
        <ColumnScrollContext.Provider value={contextValue}>
            {React.cloneElement(props.children as JSX.Element, {
                forwardedRef: ref,
            })}
        </ColumnScrollContext.Provider>
    );
}

export default React.memo(React.forwardRef(ColumnScrollContextProvider));
