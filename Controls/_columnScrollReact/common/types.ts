/**
 * @typedef {String} Controls/_columnScrollReact/common/types/EdgeState
 * @description Состояние видимости границы скроллируемой области.
 * @variant Visible Граница видна, скролл в сторону данной границы невозможен.
 * @variant Invisible Граница не видна, скролл в сторону данной границы возможен.
 * @variant AnimatedInvisible В данный момент происходит анимированное скроллирование,
 * при этом до и после анимации граница не видна.
 * @variant AnimatedFromVisibleToInvisible В данный момент происходит анимированное скроллирование от видимой границы.
 * До анимации граница была видна, после станет невидимой.
 * @variant AnimatedFromInvisibleToVisible В данный момент происходит анимированное скроллирование от невидимой границы.
 * До анимации граница была невидна, после станет видимой.
 */

export enum EdgeState {
    Visible = 'Visible',
    Invisible = 'Invisible',
    AnimatedInvisible = 'AnimatedInvisible',
    AnimatedFromVisibleToInvisible = 'AnimatedFromVisibleToInvisible',
    AnimatedFromInvisibleToVisible = 'AnimatedFromInvisibleToVisible',
}

export type TColumnScrollStartPosition = 'end' | number;
