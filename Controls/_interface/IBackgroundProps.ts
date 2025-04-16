import { TBackgroundStyle } from './IBackgroundStyle';

/**
 * Интерфейс свойств для настройки фона компонента
 * @public
 */
export interface IBackgroundProps {
    /**
     * Стиль фона элемента
     * @cfg
     */
    backgroundColorStyle?: TBackgroundStyle;

    /**
     * Стиль фона элемента при наведении курсора мыши
     * @cfg
     */
    hoverBackgroundStyle?: TBackgroundStyle;

    // @todo это тут должно быть или в editing?
    /**
     * Флаг, позволяющий отключить белый фон у редактируемой ячейки
     * @cfg
     */
    cellInputBackgroundVisible?: boolean;

    /*
     * Используем backgroundColorStyle
     */
    backgroundStyle?: TBackgroundStyle;
}
