import { TBackgroundStyle } from './IBackgroundStyle';

export interface IBackgroundProps {
    /**
     * Стиль фона элемента
     */
    backgroundStyle?: TBackgroundStyle;

    /**
     * Стиль фона элемента при наведении курсора мыши
     */
    hoverBackgroundStyle?: TBackgroundStyle;
}
