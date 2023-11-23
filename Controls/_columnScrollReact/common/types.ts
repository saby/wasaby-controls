/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */

/**
 * Состояние видимости границы скроллируемой области.
 */
export enum EdgeState {
    /**
     * Граница видна, скролл в сторону данной границы невозможен.
     */
    Visible = 'Visible',
    /**
     * Граница не видна, скролл в сторону данной границы возможен.
     */
    Invisible = 'Invisible',
    /**
     * В данный момент происходит анимированное скроллирование,
     * при этом до и после анимации граница не видна.
     */
    AnimatedInvisible = 'AnimatedInvisible',
    /**
     * В данный момент происходит анимированное скроллирование от видимой границы.
     * До анимации граница была видна, после станет невидимой.
     */
    AnimatedFromVisibleToInvisible = 'AnimatedFromVisibleToInvisible',
    /**
     * В данный момент происходит анимированное скроллирование от невидимой границы.
     * До анимации граница была невидна, после станет видимой.
     */
    AnimatedFromInvisibleToVisible = 'AnimatedFromInvisibleToVisible',
}

/**
 * Начальная позиция скролла.
 */
export type TColumnScrollStartPosition = 'end' | number;


/**
 * Режим автоподскрола при завершении скроллирования.
 * @typedef {String} Controls/_columnScrollReact/common/types/TAutoScrollMode.typedef
 * @variant none Автоподскролл при завершении скроллирования выключен.
 * @variant all Включен моментальный автоподскролл при завершении скроллирования. При этом скроллирование колесиком мыши будет производиться только к границам целей автоподскрола.
 * @variant smooth Включен плавный автоподскролл при завершении скроллирования. При этом скроллирование колесиком мыши будет производиться только к границам целей автоподскрола ез плавной анимации.
 */
export type TAutoScrollMode = 'none' | 'all' | 'smooth';

/**
 * Положение, к которому необходимо проскроллить при вызове метода подскрола к элементу.
 * @typedef {String} Controls/_columnScrollReact/common/types/TScrollIntoViewAlign.typedef
 * @variant auto Скроллирование происходит только если элемент не полностью или совсем не виден в области скроллирования.
 * Положение, в котором элемент будет после скроллирования, определяется направлением, в котором необходимо скроллить, чтобы увидеть элемент.
 * Если элемент находится справа за областью видимости, то после подскрола элемент будет прижат своей правой границей к правой границе вьюпорта, что эквивалентно значению 'end', если элемент не виден.
 * Если элемент находится слева за областью видимости, то после подскрола элемент будет прижат своей левой границей к левой границе вьюпорта, что эквивалентно значению 'start', если элемент не виден.
 * @variant start Элемент будет прижат своей левой границей к левой границе вьюпорта независимо от того, виден ли он.
 * @variant center Элемент будет расположен по центру вьюпорта независимо от того, виден ли он.
 * @variant end Элемент будет прижат своей правой границей к правой границе вьюпорта независимо от того, виден ли он.
 * @variant autoStart Скроллирование происходит только если элемент не полностью или совсем не виден в области скроллирования. Элемент будет прижат своей левой границей к левой границе вьюпорта.
 * @variant autoCenter Скроллирование происходит только если элемент не полностью или совсем не виден в области скроллирования. Элемент будет расположен по центру вьюпорта.
 * @variant autoEnd Скроллирование происходит только если элемент не полностью или совсем не виден в области скроллирования. Элемент будет прижат своей правой границей к правой границе вьюпорта.
 */
export type TScrollIntoViewAlign =
    | 'auto'
    | 'start'
    | 'center'
    | 'end'
    | 'autoStart'
    | 'autoCenter'
    | 'autoEnd';
