/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import {
    IBorderRadiusProps,
    ICellComponentBorderProps,
} from 'Controls/_gridRender/cell/interface/ICell';
import { ICellPositionProps } from 'Controls/interface';

const LBR_PFX = 'controls-ListView__item_roundBorder';
const GB_PFX = 'controls-GridReact__cell-border';

/**
 * Утилита, предоставляющая CSS классы для скругления углов ячейки
 * @private
 */
export function getBorderRadiusClasses(props: IBorderRadiusProps) {
    let borderRadiusClasses = '';

    if (props.topLeftBorderRadius) {
        borderRadiusClasses += ` ${LBR_PFX}_topLeft_${props.topLeftBorderRadius}`;
    }

    if (props.topRightBorderRadius) {
        borderRadiusClasses += ` ${LBR_PFX}_topRight_${props.topRightBorderRadius}`;
    }

    if (props.bottomRightBorderRadius) {
        borderRadiusClasses += ` ${LBR_PFX}_bottomRight_${props.bottomRightBorderRadius}`;
    }

    if (props.bottomLeftBorderRadius) {
        borderRadiusClasses += ` ${LBR_PFX}_bottomLeft_${props.bottomLeftBorderRadius}`;
    }

    return borderRadiusClasses;
}

/**
 * Утилита, предоставляющая CSS классы границ ячейки
 * @private
 */
export function getBorderClasses(props: ICellComponentBorderProps & ICellPositionProps) {
    if (!props.borderVisibility || props.borderVisibility === 'hidden') {
        return '';
    }

    let borderClasses =
        ` ${GB_PFX}_${props.borderMode}_${props.borderVisibility}` +
        ` ${GB_PFX}Style_${props.borderStyle}`;

    if (props.borderMode === 'row') {
        if (props.isFirstCell) {
            borderClasses += ` ${GB_PFX}_row_first`;
        }
        if (props.isLastCell) {
            borderClasses += ` ${GB_PFX}_row_last`;
        }
    }

    return borderClasses;
}
