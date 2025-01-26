import { IColumnWidth } from 'Controls-Lists-editors/_columnsEditor/utils/columnEditor';
import * as React from 'react';

/**
 * Интерфейс элемента информационной полосы
 * @private
 */
interface IInformationLineElementProps {
    /**
     * Ширина колонки
     */
    width: IColumnWidth;
    /**
     * Ширина контейнера таблицы
     */
    containerWidth: number;
    /**
     * Правый отступ в ячейке таблицы
     */
    rightCellPadding: string | null;
    /**
     * Левый отступ в ячейке таблицы
     */
    leftCellPadding: string | null;
    /**
     * Дополнительные настройки стиля
     */
    style: object;
    /**
     * Соответствует ли главной колонке
     */
    isMainColumn?: boolean;
    /**
     * Обработчик наведения мыши на точку в информационной полосе
     * @param {MouseEvent} event
     */
    onSpotMouseOver?: (event: MouseEvent) => void;
    /**
     * Обработчик события, когда мышь увели с точки в информационной полосе
     * @param {MouseEvent} event
     */
    onSpotMouseOut?: (event: MouseEvent) => void;
}

/**
 * Переводит значение ширины в формат, понятный пользователю
 * @param {IColumnWidth} width ширина
 */
function getUserFriendlyFormat(width: IColumnWidth): string {
    if (width.mode === 'fixed') {
        if (width.units === 'px') {
            return String(width.amount);
        } else {
            return String(width.amount) + width.units;
        }
    } else {
        if (!width.minLimit && !width.maxLimit) {
            return 'авто';
        } else {
            let maxLimit = 'авто';
            let minLimit = 'авто';
            if (width.maxLimit) {
                if (width.units === 'px') {
                    maxLimit = String(width.maxLimit);
                } else {
                    maxLimit = String(width.maxLimit) + width.units;
                }
            }
            if (width.minLimit) {
                if (width.units === 'px') {
                    minLimit = String(width.minLimit);
                } else {
                    minLimit = String(width.minLimit) + width.units;
                }
            }
            return `(${minLimit}; ${maxLimit})`;
        }
    }
}

/**
 * Элемент информационной полосы
 * @param {IInformationLineElementProps} props Пропсы компонента
 * @category component
 * @private
 */
export function InformationLineElement(props: IInformationLineElementProps) {
    const {
        width,
        rightCellPadding,
        leftCellPadding,
        style,
        isMainColumn,
        containerWidth,
        onSpotMouseOut,
        onSpotMouseOver,
    } = props;
    const content = getUserFriendlyFormat(width, isMainColumn);
    const containerStyle = React.useMemo(() => {
        return {
            width: `${containerWidth}px`,
        };
    }, [containerWidth]);
    const textWrapperStyle = React.useMemo(() => {
        return {
            maxWidth: `calc(${containerWidth}px - ((2 * var(--offset_2xs) + (2 * var(--offset_xs)))))`,
        };
    }, [containerWidth]);
    return (
        <div
            className={`ControlsListsEditors_info-line ControlsListsEditors_info-line-spacingRight_${rightCellPadding}
                     ControlsListsEditors_info-line-spacingLeft_${leftCellPadding}`}
            style={style}
        >
            <div style={containerStyle} className={'ControlsListsEditors_info-line-container'}>
                <div className={'ControlsListsEditors_info-line-separator'}></div>
                <div
                    style={textWrapperStyle}
                    className={'ControlsListsEditors_info-line-text-wrapper'}
                >
                    <span>&#8203;</span>
                    <div
                        className={
                            ' ControlsListsEditors_info-line-content ControlsListsEditors_info-line-text'
                        }
                    >
                        {content}
                    </div>
                    <div
                        className={
                            'ControlsListsEditors_info-line-spot-wrapper  ControlsListsEditors_info-line-text tw-cursor-default '
                        }
                        title={content}
                        onMouseOver={onSpotMouseOver}
                        onMouseOut={onSpotMouseOut}
                        onClick={(event: MouseEvent) => {
                            event.stopPropagation();
                        }}
                    >
                        <div
                            className={'ControlsListsEditors_info-line-spot tw-cursor-default'}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
