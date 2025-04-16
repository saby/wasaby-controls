import {
    IAlignProps,
    IColspanProps,
    ICursorProps,
    IGridPaddingProps,
    IPadding,
    TBackgroundStyle,
} from 'Controls/interface';
import { IBaseCellComponentProps } from 'Controls/_gridRender/cell/Base';
import { IBorderRadiusProps, ICellTypeProps } from 'Controls/_gridRender/cell/interface/ICell';
import { IColumnSeparatorProps } from 'Controls/_gridRender/cell/utils/Classes/ColumnSeparator';
import {
    IDataCellDecorationStyleProps,
    IDataCellEditInPlaceProps,
    IDataCellComponentCompatibleProps,
} from 'Controls/_gridRender/cell/interface/IDataCellComponent';
import { IColumnScrollProps } from 'Controls/_gridRender/cell/utils/Props/ColumnScroll';

export interface IContentRenderProps extends IGridPaddingProps, Pick<IAlignProps, 'halign'> {}

interface IEmptyCellComponentCompatibleProps {
    colspan: IDataCellComponentCompatibleProps['colspan'];
    /**
     * Флаг позволяющий отключить платформенные классы
     * при использовании прикладного шаблона, т.к. обёртка делается на уровне самого прикладного шаблона.
     */
    wrapContentRender?: boolean;
    /**
     * Контент пустого представления имеет собственную независимую настройку padding
     */
    contentRenderProps?: IContentRenderProps;
}

export interface IEmptyCellComponentProps
    extends IBaseCellComponentProps,
        IColspanProps,
        IGridPaddingProps,
        ICellTypeProps,
        IBorderRadiusProps,
        IAlignProps,
        ICursorProps,
        IDataCellDecorationStyleProps,
        IDataCellEditInPlaceProps,
        IColumnSeparatorProps,
        IEmptyCellComponentCompatibleProps,
        IColumnScrollProps {
    /**
     * отступы ячейки пустого представления
     */
    padding: IPadding;
    /**
     * Позволяет включить гибкое выравнивание контента при растягивании EmptyTemplate
     */
    flexAlignment: boolean;
    /**
     * Стиль фона
     */
    backgroundColorStyle?: TBackgroundStyle;

    // Возвращает true, если ячейка растянута на всю строку
    isSingleCell?: boolean;
}
