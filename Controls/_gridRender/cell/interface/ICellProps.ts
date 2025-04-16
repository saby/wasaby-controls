import {
    IBorderProps,
    ICursorProps,
    ITextOverflowProps,
    ITooltipProps,
    IAlignProps,
    ITagProps,
    IBackgroundProps,
    IFontProps,
} from 'Controls/interface';
import {
    IBorderRadiusProps,
    IHorizontalCellPadding,
} from 'Controls/_gridRender/cell/interface/ICell';

/**
 * Настройки ячейки данных, возвращаемые из коллбека {@link Controls/gridRender/IColumnConfig/Property/getCellProps}
 * @public
 */
export interface ICellProps
    extends IFontProps,
        IBackgroundProps,
        ICursorProps,
        IAlignProps,
        IBorderProps,
        ITextOverflowProps,
        ITooltipProps,
        ITagProps,
        IBorderRadiusProps {
    /**
     * Произвольный CSS класс ячейки
     * @cfg
     */
    className?: string;
    /**
     * Отступы внутри ячейки
     * @remark Используется для настройки левого и правого отступа.
     * Для настройки верхнего и нижнего отступа используйте {@link Controls/gridRender/IRowProps/Property/padding IRowProps} опции строки.
     * @cfg
     */
    padding?: IHorizontalCellPadding;

    /**
     * Текст подсказки при наведении на ячейку
     * @cfg
     */
    tooltip?: string;

    /**
     * Доступна ли ячейка для редактирования при режиме редактирования по ячейкам.
     * @cfg
     */
    editable?: boolean;

    fixedZIndex?: number;
}
