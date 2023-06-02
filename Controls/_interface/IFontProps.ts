import { TFontColorStyle } from './IFontColorStyle';
import { TFontSize } from './IFontSize';
import { TFontWeight } from './IFontWeight';

export interface IFontProps {
    /**
     * @cfg {Controls/_interface/IFontSize/TFontSize.typedef} Размер шрифта.
     * @default "l". Для контрола {@link Controls/treeGrid:View}: "m" (для листа), "xl" (для скрытого узла) и "2xl" (для узла).
     * @remark
     * Размер шрифта ячейки имеет больший приоритет, чем размер шрифта строки.
     */
    fontSize?: TFontSize;

    /**
     * @cfg {Controls/_interface/IFontWeight/TFontWeight.typedef} Насыщенность шрифта.
     * @default "default".
     * @remark
     * Насыщенность шрифта ячейки имеет больший приоритет, чем насыщенность шрифта строки.
     */
    fontWeight?: TFontWeight;

    /**
     * @cfg {Controls/interface/TFontColorStyle.typedef} Стиль цвета текста ячейки.
     * @remark
     * Стиль цвета текста ячейки имеет больший приоритет, чем стиль цвета текста строки.
     */
    fontColorStyle?: TFontColorStyle;
}
