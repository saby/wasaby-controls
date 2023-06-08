import { TBackgroundStyle } from './IBackgroundStyle';

export interface IBackgroundProps {
    /**
     * Цвет фона колонки
     */
    backgroundColorStyle?: TBackgroundStyle;

    /**
     * Цвет фона колонки при наведении курсора мыши
     */
    hoverBackgroundStyle?: TBackgroundStyle;
}
