import { default as AreaFactory } from './Factory';
import { default as AreaSlice } from './Slice';

/**
 * Совместимый слайс для старого описания данных переключаемых областей (с type = 'area')
 * @private
 */
class CompatibleAreaSLice extends AreaSlice {
    readonly '[ICompatibleSlice]': boolean = true;
}

/**
 * @private
 */
export default class CompatibleArea extends AreaFactory {
    static slice = CompatibleAreaSLice;
}
