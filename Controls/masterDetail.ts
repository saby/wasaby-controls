/**
 * @kaizen_zone 98d4b42e-2c0e-4268-a9e8-1e54d6e8ef27
 */
/**
 * Библиотека контролов для организации двухколоночных списков, в которых выбор элемента из первой колонки влияет на содержимое второй колонки.
 * @library
 * @includes Base Controls/_masterDetail/Base
 * @public
 */

/*
 * masterDetail library
 * @library
 * @includes Base Controls/_masterDetail/Base
 * @public
 * @author Герасимов А.М.
 */

import Base = require('wml!Controls/_masterDetail/WrappedBase');
export { Base };
export { default as List } from 'Controls/_masterDetail/List';
export { TMasterVisibility, IMasterWidth } from 'Controls/_masterDetail/Base';
