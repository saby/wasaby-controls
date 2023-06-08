import { TSize } from './ListInterfaces';

export type TGridVPaddingSize = 'null' | 'grid_s' | 'grid_l';
export type TGridHPaddingSize = TSize | 'grid_s' | 'grid_m';

/**
 * Интерфейс опций для отображения внутренних отступов
 * @public
 */
export interface IGridPaddingProps {
    /**
     * @cfg {Controls/interface:TGridVPaddingSize} Размер верхнего внутреннего отступа
     */
    paddingTop?: TGridVPaddingSize;

    /**
     * @cfg {Controls/interface:TGridVPaddingSize}  Размер нижнего внутреннего отступа
     */
    paddingBottom?: TGridVPaddingSize;

    /**
     * @cfg {Controls/interface:TGridHPaddingSize}  Размер левого внутреннего отступа
     */
    paddingLeft?: TGridHPaddingSize;

    /**
     * @cfg {Controls/interface:TGridHPaddingSize}  Размер правого внутреннего отступа
     */
    paddingRight?: TGridHPaddingSize;
}
