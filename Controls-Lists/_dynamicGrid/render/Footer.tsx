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
