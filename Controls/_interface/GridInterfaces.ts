import { TSize } from './ListInterfaces';

export type TGridVPaddingSize = TSize | 'grid_s' | 'grid_l' | 'master' | 'default';
export type TGridHPaddingSize =
    | TSize
    | 'default'
    | 'grid_null'
    | 'grid_s'
    | 'grid_m'
    | 'grid_l'
    | 'grid_xl'
    | 'grid_default'
    | 'list_default'
    | 'list_null'
    | 'list_xs'
    | 'list_s'
    | 'list_m'
    | 'list_l'
    | 'list_xl'
    | 'list_2xl'
    | 'list_3xl';

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
