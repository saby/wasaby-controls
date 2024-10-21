import { TBackgroundStyle } from './IBackgroundStyle';

/**
 * Интерфейс свойств для настройки фона компонента
 * @interface Controls/_interface/IBackgroundProps
 * @public
 */
export interface IBackgroundProps {
    /**
     * Стиль фона элемента
     */
    backgroundStyle?: TBackgroundStyle;

    /**
     * Стиль фона элемента при наведении курсора мыши
     */
    hoverBackgroundStyle?: TBackgroundStyle;

    /**
     * Флаг, позволяющий отключить белый фон у редактируемой ячейки
     */
    cellInputBackgroundVisible?: boolean;
}
