import { IBaseCellComponentProps } from '../Base';

import {
    IActionsProps,
    IMarkerProps,
    ITagProps,
    TBackgroundStyle,
    IColspanProps,
    IRowspanProps,
    IColumnScrollColspanProps,
    ICellPositionProps,
    IFontProps,
    ICursorProps,
    TItemActionsVisibility,
    IAlignProps,
} from 'Controls/interface';

import {
    IBorderRadiusProps,
    ICellComponentBorderProps,
    ICellTypeProps,
    IHorizontalSeparatorsConfig,
    IVerticalSeparatorsConfig,
    TDisplayType,
} from 'Controls/_gridRender/cell/interface/ICell';

import { THorizontalMarginsSize } from 'Controls/_gridRender/cell/utils/Classes/Offset';
import { TEditingMode } from 'Controls/_gridRender/interface/IEditableGrid';
import { IDecorationStyleProps } from 'Controls/_gridRender/interface/CommonInterface';
import { TColumnWidth } from 'Controls/_gridRender/cell/interface/IColumnConfig';
import { TPadding } from '../utils/Props/Padding';

export interface IDataCellComponentCompatibleProps {
    /**
     * @deprecated Для совместимости, правильно использовать "backgroundColorStyle".
     */
    backgroundStyle?: TBackgroundStyle;
    // Подсветка элемента по наведению мыши
    highlightOnHover?: boolean;
    // Класс, используемый для установки минимальной высоты записи
    minHeightClassName?: string;
    // todo почему их два? см. minHeightClassName
    minHeight?: string;
    // todo удалить, временно для работы рендеров
    render?: React.ReactElement;
    // todo удалить, используем startColspanIndex/endColspanIndex
    colspan?: number;
    // todo удалить, зачем оно вообще и почему нельзя снаружи передать класс
    displayType?: TDisplayType;
    // todo вместо этого borderBottom
    cellUnderline?: boolean;
    // todo Для расчёта класса с z-index, можно передать z-index, передать конкретный класс, убрав эти две опции
    isHasStickyProperty?: boolean;
    isHiddenForLadder?: boolean;
    // todo Убрать, когда откажемся лт IE
    width?: TColumnWidth;
}

interface IDataCellDragNDropProps {
    // Признак, что запись в режиме dNd
    isDragged?: boolean;
    // Класс, используемый для "выцветания" записи при dNd
    fadedClass?: string;
}

export interface IDataCellEditInPlaceProps {
    // Признак, что ячейка в режиме редактирования по месту
    editing?: boolean;
    // Признак, что ячейка может находиться в режим редактирования по месту
    editable?: boolean;
    // Режим редактирования по месту - "по ячеечное" или "построчное"
    editingMode?: TEditingMode;
}

interface IDataCellMarkerProps {
    // Признак, что запись маркирована
    isMarked?: boolean;
}

interface IDataCellActiveProps {
    // Признак, что запись активна и по ней производятся действия.
    // Например, открыто меню или активирован свайп
    isActive?: boolean;
}

interface IDataCellHMarginProps {
    // Горизонтальные внешние отступы ячейки
    marginLeft?: THorizontalMarginsSize;
    marginRight?: THorizontalMarginsSize;
}

interface IDataCellLadderProps {
    // Признак, что это застиканная ячейка лесенки
    isStickyLadderCell?: boolean;
}

interface IDataCellActionsProps {
    // Видимость опций записи
    actionsVisibility?: TItemActionsVisibility;
}

interface IDataCellHoverModeProps {
    // Режим ховера - по ячейкам или по всей строке
    hoverMode?: 'cell' | 'row';
}

export interface IDataCellComponentProps
    extends IBaseCellComponentProps,
        IDataCellComponentCompatibleProps,
        IMarkerProps,
        IDataCellHMarginProps,
        IBorderRadiusProps,
        ICellComponentBorderProps,
        IActionsProps,
        ITagProps,
        IFontProps,
        IColspanProps,
        IRowspanProps,
        ICursorProps,
        IAlignProps,
        IColumnScrollColspanProps,
        ICellPositionProps,
        IDataCellDragNDropProps,
        IDataCellEditInPlaceProps,
        IDataCellMarkerProps,
        IDataCellHoverModeProps,
        IDecorationStyleProps,
        IDataCellLadderProps,
        IDataCellActionsProps,
        IVerticalSeparatorsConfig,
        IHorizontalSeparatorsConfig,
        IDataCellActiveProps,
        ICellTypeProps,
        IHorizontalSeparatorsConfig {
    padding: TPadding;
    // Рендер, располагаемый перед контентом ячейки
    beforeContentRender?: React.ReactElement;
    // Рендер, располагаемый после контента ячейки
    afterContentRender?: React.ReactElement;
    // Видимость кнопки действия (старое название showEditArrow)
    editArrowVisible?: boolean;
    // Стиль фона
    backgroundColorStyle?: TBackgroundStyle;
    // Стиль фона при наведении мыши
    hoverBackgroundStyle?: TBackgroundStyle;
    // Счётчик перемещаемых записей
    draggingItemsCount?: number;
}
