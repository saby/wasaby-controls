/**
 * @kaizen_zone f0953b08-a8cc-4567-9a6e-484a988c8a25
 */
/**
 * Библиотека контролов, которые позволяют редактировать число или диапазон при помощи перетаскивания.
 * @library
 * @includes Base Controls/_slider/Base
 * @includes Range Controls/_slider/Range
 * @includes ISlider Controls/_slider/interface/ISlider
 * @public
 */

/*
 * A library of controls that allow you to edit a number or range by moving the slider.
 * @library
 * @includes ISlider Controls/_slider/interface/ISlider
 * @includes Base Controls/_slider/Base
 * @includes Range Controls/_slider/Range
 * @author Мочалов М.А.
 */

export { default as Base } from './_slider/Base';
export { default as Range } from './_slider/Range';
export { default as AbstractSlider } from './_slider/_SliderBase';
export { ISlider, ISliderOptions } from './_slider/interface/ISlider';
export { IInterval } from './_slider/interface/IInterval';
import { default as Utils, IPositionedInterval } from './_slider/Utils';
import * as IntervalTemplate from 'wml!Controls/_slider/BaseIntervalTemplate';

export { IntervalTemplate, Utils, IPositionedInterval };
