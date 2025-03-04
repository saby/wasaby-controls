import { TFontSize } from 'Controls/_interface/IFontSize';
import { TFontWeight } from 'Controls/_interface/IFontWeight';
import { TFontColorStyle } from 'Controls/_interface/IFontColorStyle';

/**
 * Интерфейс конфигурации параметров шрифта
 * @public
 */
export interface IFontProps {
    /**
     * Размер шрифта
     * @cfg
     * @default "l". Для контрола {@link Controls/treeGrid:View}: "m" (для листа), "xl" (для скрытого узла) и "2xl" (для узла).
     * @remark
     * Размер шрифта ячейки имеет больший приоритет, чем размер шрифта строки.
     */
    fontSize?: TFontSize;

    /**
     * Насыщенность шрифта
     * @cfg
     * @default "default".
     * @remark
     * Насыщенность шрифта ячейки имеет больший приоритет, чем насыщенность шрифта строки.
     */
    fontWeight?: TFontWeight;

    /**
     * Стиль цвета текста ячейки.
     * @cfg
     * @remark
     * Стиль цвета текста ячейки имеет больший приоритет, чем стиль цвета текста строки.
     */
    fontColorStyle?: TFontColorStyle;
}
