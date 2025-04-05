import {
    TImageUrlResolver,
    TTileMode,
    TTileScalingMode,
    TTileSize,
    TTileOrientation,
} from 'Controls-DataEnv/listTypes';

/**
 * Интерфейс состояния для работы плитками с любым типом интерактора(web/mobile).
 * @public
 */
export interface ITileState {
    /**
     * Режим отображения плитки с динамической/фиксированной шириной
     * @variant static Отображается плитка с фиксированной шириной.
     * @variant dynamic Отображается плитка с динамической шириной.
     * @see imageHeightProperty
     * @see imageWidthProperty
     * @remark Для автоматического расчета ширины элемента нужно указать оригинальные размеры изображения.
     *
     * Полезные ссылки:
     * * {@link /doc/platform/developmentapl/interface-development/controls/list/tile/view/width/ руководство разработчика}
     */
    tileMode: TTileMode;

    /**
     * Минимальный размер плитки с статическим видом отображения
     * @variant s
     * @variant m
     * @variant l
     * @default s
     *
     * @see tileMode
     */
    tileSize?: TTileSize;

    /**
     * Ширина элементов, отображаемых в виде плитки
     * @default 250
     * @remark Эта опция необходима для расчета размеров элементов при отрисовке на сервере.
     * Если установить ширину с помощью css, компонент не будет отображен корректно.
     * Влияние опции на отрисовку шаблона плитки зависит от опции tileMode:
     * * При tileMode === 'dynamic' опция задаёт максимальную ширину, а минимальная рассчитывается с учётом коэффициента сжатия плитки (0,7).
     * * При tileMode === 'static' опция задаёт минимальную ширину.
     * @see tileMode
     */
    tileWidth: number;

    /**
     * Ширина папки. Значение задаётся в px
     */
    folderWidth: number;

    /**
     * Высота элементов, отображаемых в виде плитки
     * @default 200
     */
    tileHeight: number;

    /**
     * Название свойства на элементе, которое содержит числовое значение минимальной ширины плитки
     * @remark Эта опция необходима для расчета размеров элементов при отрисовке на сервере.
     * Если установить ширину с помощью css, компонент не будет отображен корректно.
     * Если БЛ в свойстве вернёт что-либо вместо числа, при расчётах это вызовет ошибку в консоль.
     * @see tileWidth
     * @see tileHeight
     */
    tileWidthProperty?: string;

    /**
     * Режим отображения плитки при наведении курсора
     * @default none
     * @remark Увеличенный элемент расположен в центре относительно исходного положения.
     * Если увеличенный элемент не помещается в указанный контейнер, увеличение не происходит.
     */
    tileScalingMode: TTileScalingMode;

    /**
     *
     */
    tileFitProperty?: string;

    /**
     * Имя свойства, содержащего ссылку на изображение для плитки
     * @default image
     * @remark
     * Полезные ссылки:
     * * {@link /doc/platform/developmentapl/interface-development/controls/list/tile/basic/ Руководство разработчика}
     */
    imageProperty: string;

    /**
     * Имя свойства, содержащего ширину оригинального изображения
     */
    imageWidthProperty?: string;

    /**
     * Имя свойства, содержащего высоту оригинального изображения
     */
    imageHeightProperty?: string;

    /**
     * Функция обратного вызова для получения url изображения для плитки.
     * Используется, если по каким-то причинам сервис previewer не подходит.
     * @see imageProperty
     */
    imageUrlResolver?: TImageUrlResolver;

    /**
     * Ориентация плитки
     * @default vertical
     * @variant vertical
     * @variant horizontal
     */
    orientation?: TTileOrientation;
}
