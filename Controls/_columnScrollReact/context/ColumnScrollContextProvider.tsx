import * as React from 'react';
import {
    getSelectorsState,
    ISelectorsProps,
    ISelectorsState,
} from '../common/selectors';
import { detection } from 'Env/Env';
import { EdgeState } from '../common/types';
import {
    ColumnScrollContext,
    IColumnScrollContext,
} from './ColumnScrollContext';
import { IColumnScrollWidths } from '../common/interfaces';
import {
    getEdgesState,
    getEdgesStateAfterScroll,
    getLimitedPosition,
    getMaxScrollPosition,
    isEdgeAnimated,
} from '../common/helpers';
import { Logger } from 'UICommon/Utils';
import 'css!Controls/columnScrollReact';

const NOTIFY_EDGE_STATE_CHANGED_OFFSET = 100;

export interface IColumnScrollContextProviderProps {
    GUID?: string;
    selectors?: ISelectorsProps;
    children: JSX.Element;
    columnScrollStartPosition?: IColumnScrollContext['columnScrollStartPosition'];
    onEdgesStateChanged?: (
        leftEdgeState: EdgeState,
        rightEdgeState: EdgeState
    ) => void;
}

interface IEdgesState {
    left: EdgeState;
    right: EdgeState;
}

export function ColumnScrollContextProvider(
    props: IColumnScrollContextProviderProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.FunctionComponentElement<IColumnScrollContextProviderProps> {
    const [selectors] = React.useState(
        getSelectorsState(props.selectors, 'GUID' /* props.GUID*/)
    );
    const [columnScrollStartPosition] = React.useState(
        props.columnScrollStartPosition || 0
    );

    const [isMobile] = React.useState(detection.isMobilePlatform);
    const [isMobileScrolling, setIsMobileScrolling] = React.useState(false);

    const [position, setPosition] = React.useState<number>(
        typeof columnScrollStartPosition === 'number'
            ? columnScrollStartPosition
            : 0
    );

    const [leftEdgeState, setLeftEdgeState] = React.useState<EdgeState>(
        typeof columnScrollStartPosition === 'number' &&
            columnScrollStartPosition > 0
            ? EdgeState.Invisible
            : EdgeState.Visible
    );
    const [rightEdgeState, setRightEdgeState] = React.useState<EdgeState>(
        EdgeState.Visible
    );

    const [leftTriggerEdgeState, setLeftTriggerEdgeState] =
        React.useState<EdgeState>(
            typeof columnScrollStartPosition === 'number' &&
                columnScrollStartPosition > NOTIFY_EDGE_STATE_CHANGED_OFFSET
                ? EdgeState.Invisible
                : EdgeState.Visible
        );
    const [rightTriggerEdgeState, setRightTriggerEdgeState] =
        React.useState<EdgeState>(EdgeState.Visible);

    const [viewPortWidth, setViewPortWidth] = React.useState<number>(0);
    const [contentWidth, setContentWidth] = React.useState<number>(0);
    const [fixedWidth, setFixedWidth] = React.useState<number>(0);
    const [isNeedByWidth, setIsNeedByWidth] = React.useState(false);

    // Temp. TODO: Удалю как только грид будет готов к вставке компонентов пересчета разеров.
    //  Пока не понятно как такое сделать.
    const positionRef = React.useRef(position);
    React.useEffect(() => {
        positionRef.current = position;
    });

    const setEdgesState = React.useCallback(
        (oldState: IEdgesState, newState: IEdgesState) => {
            if (oldState.left !== newState.left) {
                setLeftEdgeState(newState.left);
            }

            if (oldState.right !== newState.right) {
                setRightEdgeState(newState.right);
            }
        },
        []
    );

    const setTriggerEdgesState = React.useCallback(
        (oldState: IEdgesState, newState: IEdgesState) => {
            let isChanged = false;

            if (
                oldState.left !== newState.left &&
                !isEdgeAnimated(newState.left)
            ) {
                isChanged = true;
                setLeftTriggerEdgeState(newState.left);
            }

            if (
                oldState.right !== newState.right &&
                !isEdgeAnimated(newState.right)
            ) {
                isChanged = true;
                setRightTriggerEdgeState(newState.right);
            }

            if (isChanged) {
                props.onEdgesStateChanged(newState.left, newState.right);
            }
        },
        [props.onEdgesStateChanged]
    );

    const updateSizes = React.useCallback(() => {
        // Это времянка, уйдет после написания компонента калькулятора размеров в марте.
        // Размеры будут прилетать в параметрах метода.
        const newSizes = getSizes(positionRef.current, selectors);

        setViewPortWidth(newSizes.viewPortWidth);
        setContentWidth(newSizes.contentWidth);
        setFixedWidth(newSizes.fixedWidth);

        // Первая установка всех размеров.
        let newPosition = positionRef.current;
        if (
            viewPortWidth === 0 &&
            newSizes.viewPortWidth !== 0 &&
            contentWidth === 0 &&
            newSizes.contentWidth !== 0
        ) {
            // Устанавливаем максимальную позицию скролла, если была установлена изначальная позиция скролла
            // "вконец".
            if (columnScrollStartPosition === 'end') {
                newPosition = getMaxScrollPosition(newSizes);
            }

            // Если было передано конкретное значение в пикселях, то валидируем и корректируем его.
            // Не нужно позволять устанавливать позицию больше или меньше возможной.
            if (typeof columnScrollStartPosition === 'number') {
                newPosition = getLimitedPosition(
                    columnScrollStartPosition,
                    newSizes
                );
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
                    // TODO: Бросить предупреждение, что задали слишком большую высоту и неизбежен скачек.
                }
            }
        }

        setPosition(newPosition);

        const [newLeftEdgeState, newRightEdgeState] = getEdgesState(
            newPosition,
            newSizes
        );

        setEdgesState(
            {
                left: leftEdgeState,
                right: rightEdgeState,
            },
            {
                left: newLeftEdgeState,
                right: newRightEdgeState,
            }
        );

        setTriggerEdgesState(
            {
                left: leftTriggerEdgeState,
                right: rightTriggerEdgeState,
            },
            {
                left: newLeftEdgeState,
                right: newRightEdgeState,
            }
        );

        setIsNeedByWidth(newSizes.contentWidth > newSizes.viewPortWidth);
    }, [
        viewPortWidth,
        contentWidth,
        fixedWidth,
        leftEdgeState,
        rightEdgeState,
        leftTriggerEdgeState,
        rightTriggerEdgeState,
        setEdgesState,
    ]);

    const setPositionCallback = React.useCallback(
        (newPosition: number, smooth?: boolean) => {
            // eslint-disable-next-line no-param-reassign
            newPosition = getLimitedPosition(newPosition, {
                viewPortWidth,
                contentWidth,
                fixedWidth,
            });

            const maxScrollPosition = getMaxScrollPosition({
                fixedWidth,
                contentWidth,
                viewPortWidth,
            });

            // На мобильной платформе недоступна анимация.
            // TODO: Попробовать сделать плавную анимацию на мобильных платформах через метод
            //  setScrollLeft на зеркале с параметром smooth.
            // eslint-disable-next-line no-param-reassign
            smooth = !isMobile && smooth;

            const [newLeftEdgeState, newRightEdgeState] =
                getEdgesStateAfterScroll(
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
                {
                    left: newLeftEdgeState,
                    right: newRightEdgeState,
                }
            );

            setTriggerEdgesState(
                {
                    left: leftTriggerEdgeState,
                    right: rightTriggerEdgeState,
                },
                {
                    left: newLeftEdgeState,
                    right: newRightEdgeState,
                }
            );

            setPosition(newPosition);
        },
        [isMobile, position, viewPortWidth, contentWidth, fixedWidth]
    );

    const contextRefForHandlersOnly = React.useRef<IColumnScrollContext>();

    const contextValue = React.useMemo<IColumnScrollContext>(() => {
        return {
            contextRefForHandlersOnly,

            isMobile,
            isNeedByWidth,

            columnScrollStartPosition,
            position,
            setPosition: setPositionCallback,

            leftEdgeState,
            rightEdgeState,

            isMobileScrolling,
            setIsMobileScrolling,

            viewPortWidth,
            contentWidth,
            fixedWidth,

            SELECTORS: selectors,
            updateSizes,
        };
    }, [
        position,
        setPositionCallback,
        isMobileScrolling,
        isNeedByWidth,
        leftEdgeState,
        rightEdgeState,
        viewPortWidth,
        contentWidth,
        fixedWidth,
    ]);

    contextRefForHandlersOnly.current = contextValue;

    // TODO: Удалить когда либа листа перейдет на реакт.
    //  Такой проброс элемента нужен тогда, когда контрол без вёрстки вставляется окружение,
    //  где ближайшая дивка рождена в wasaby.
    return (
        <ColumnScrollContext.Provider value={contextValue}>
            {React.cloneElement(props.children as JSX.Element, {
                forwardedRef: ref,
            })}
        </ColumnScrollContext.Provider>
    );
}

export default React.memo(React.forwardRef(ColumnScrollContextProvider));

// Это времянка, уйдет после написания компонента калькулятора размеров в марте.
function getSizes(
    position: number,
    selectors: ISelectorsState
): IColumnScrollWidths {
    const root = document.querySelector(
        `.${selectors.ROOT_TRANSFORMED_ELEMENT}`
    );
    const scroll = root?.closest(
        '.controls-Scroll-Container'
    ) as HTMLDivElement;
    let newViewPortWidth = 0;
    if (scroll) {
        newViewPortWidth = scroll.offsetWidth;
    }
    const rows = Array.from(
        document.querySelectorAll(
            `.${selectors.ROOT_TRANSFORMED_ELEMENT} .controls-ListView__itemV.tw-contents`
        )
    );
    const cells = Array.from(
        rows[0].querySelectorAll('.controls-GridReact__cell')
    );
    const fixedCells = Array.from(
        rows[0].querySelectorAll(`.${selectors.FIXED_ELEMENT}`)
    );

    const firstCell = cells[0].getBoundingClientRect();
    const lastFixedCell =
        fixedCells[fixedCells.length - 1].getBoundingClientRect();
    const lastScrollableCell = cells[cells.length - 1].getBoundingClientRect();

    return {
        viewPortWidth: newViewPortWidth,
        contentWidth:
            lastScrollableCell.left +
            position -
            firstCell.left +
            lastScrollableCell.width,
        fixedWidth: lastFixedCell.left - firstCell.left + lastFixedCell.width,
    };
}
