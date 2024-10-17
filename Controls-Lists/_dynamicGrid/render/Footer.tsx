/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import { DYNAMIC_FOOTER_PREFIX } from '../shared/constants';
import {
    getExtraRowDynamicCellClassName,
    getPreparedExtraRowDynamicColumnProps,
    IGetExtraRowDynamicCellClassNameBaseProps,
    IGetPreparedExtraRowDynamicColumnBaseProps,
} from './ExtraRow';

export function getPreparedDynamicFooter(props: IGetPreparedExtraRowDynamicColumnBaseProps) {
    return getPreparedExtraRowDynamicColumnProps({
        ...props,
        keyPrefix: DYNAMIC_FOOTER_PREFIX,
        extraRowDynamicCellsClassNameCallback: getFooterRowDynamicCellClass,
    });
}

export function getFooterRowDynamicCellClass(
    props: IGetExtraRowDynamicCellClassNameBaseProps
): string {
    return getExtraRowDynamicCellClassName({ ...props, classPrefix: DYNAMIC_FOOTER_PREFIX });
}
