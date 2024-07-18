import { default as AreaFactory } from './Factory';
import { default as AreaSlice } from './Slice';

/**
 * Совместимый слайс для старого описания данных переключаемых областей (с type = 'area')
 * @private
 */
class CompatibleAreaSLice extends AreaSlice {
    readonly '[ICompatibleSlice]': boolean = true;
}

export default {
    loadData: AreaFactory.loadData,
    slice: CompatibleAreaSLice,
};
