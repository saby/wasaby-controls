import { ITileViewProps } from 'Controls/_tileRender/interface/ITileView';
import { IPadding } from 'Controls/interface';

const AVAILABLE_PADDINGS = ['null', 'default', '3xs', '2xs', 'xs', 's', 'm', 'l'];
const PREFIX = ' controls-TileView__itemsPaddingContainer_spacing';

export interface IGetWrapperClassesProps
    extends Pick<
        ITileViewProps,
        'orientation' | 'needShowEmptyTemplate' | 'itemPadding' | 'itemsContainerPadding'
    > {}

export interface IGetItemsContainerClasses
    extends Pick<ITileViewProps, 'orientation' | 'itemActionsVisibility' | 'itemsContainerClass'> {}

function getPadding(padding?: IPadding) {
    const result: IPadding = {
        left: padding?.left || 'default',
        right: padding?.right || 'default',
        top: padding?.top || 'default',
        bottom: padding?.bottom || 'default',
    };

    // validating the correctness of the value
    let key: keyof IPadding;
    for (key in result) {
        if (!AVAILABLE_PADDINGS.includes(result[key] as string)) {
            result[key] = 'default';
        }
    }

    return result;
}

function getWrapperPaddingClasses(props: IGetWrapperClassesProps): string {
    let classes = '';

    const itemPadding = getPadding(props.itemPadding);

    if (props.itemsContainerPadding) {
        const itemsContainerPadding = getPadding(props.itemsContainerPadding);

        if (props.orientation === 'horizontal') {
            classes += `${PREFIX}Left_${itemsContainerPadding.left}_horizontal`;
            classes += `${PREFIX}Right_${itemsContainerPadding.right}_horizontal`;
        } else {
            classes += `${PREFIX}Left_${itemsContainerPadding.left}_itemPadding_${itemPadding.left}`;
            classes += `${PREFIX}Right_${itemsContainerPadding.right}_itemPadding_${itemPadding.right}`;
        }

        classes += `${PREFIX}Top_${itemsContainerPadding.top}_itemPadding_${itemPadding.top}`;
        classes += `${PREFIX}Bottom_${itemsContainerPadding.bottom}_itemPadding_${itemPadding.bottom}`;
    } else {
        if (props.orientation === 'horizontal') {
            classes += `${PREFIX}Left_null_horizontal`;
            classes += `${PREFIX}Right_null_horizontal`;
        } else {
            classes += `${PREFIX}Left_${itemPadding.left}`;
            classes += `${PREFIX}Right_${itemPadding.right}`;
        }

        classes += `${PREFIX}Top_${itemPadding.top}`;
        classes += `${PREFIX}Bottom_${itemPadding.bottom}`;
    }

    return classes;
}

export function getWrapperClasses(props: IGetWrapperClassesProps) {
    let classes = 'controls-TileView_new';

    if (props.orientation === 'horizontal') {
        classes += ' tw-max-w-full';
    }

    // Если показывается emptyTemplate отступы между элементом и границей вьюхи не нужны.
    // Иначе будут прыжки при переключении viewMode.
    if (!props.needShowEmptyTemplate) {
        classes += getWrapperPaddingClasses(props);
    }

    return classes;
}

export function getItemsContainerClasses(props: IGetItemsContainerClasses) {
    let classes = 'controls-ListViewV controls-TileView controls-ListViewV__itemsContainer';

    classes += props.orientation === 'horizontal' ? ' tw-flex-nowrap' : ' tw-flex-wrap';

    // Если передан itemsContainerClass, значит ListView рендерится внутри BaseControl,
    // и тогда тут не надо вешать controls-BaseControl_showActions
    if (!props.itemsContainerClass) {
        classes += ` controls-BaseControl_showActions_${props.itemActionsVisibility || 'onhover'}`;
    } else {
        classes += ` ${props.itemsContainerClass}`;
    }

    return classes;
}
