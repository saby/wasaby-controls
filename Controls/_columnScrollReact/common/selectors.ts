const prefix = 'js-controls-ColumnScrollReact';
type _TSeparator = '_' | '';

export const ENABLE_GRAPHIC_ACCELERATION_CSS_CLASS_NAME =
    'controls-ColumnScrollReact__acceleration';

export const DEFAULT_SELECTORS = {
    ROOT_TRANSFORMED_ELEMENT:
        `${prefix}_root-scroll-transform` as `${typeof prefix}_root-scroll-transform`,
    FIXED_ELEMENT: `${prefix}_fixed` as `${typeof prefix}_fixed`,
    SCROLLABLE_ELEMENT: `${prefix}_scrollable` as `${typeof prefix}_scrollable`,
    NOT_DRAG_SCROLLABLE: `${prefix}_notDragScrollable` as `${typeof prefix}_notDragScrollable`,
    FIXED_TO_LEFT_EDGE_ELEMENT: `${prefix}_offsetForFixed` as `${typeof prefix}_offsetForFixed`,
    HIDE_ALL_FIXED_ELEMENTS: `${prefix}_hideFixedElements` as `${typeof prefix}_hideFixedElements`,
};

export interface ISelectorsProps {
    FIXED_ELEMENT?: string;
    SCROLLABLE_ELEMENT?: string;
    NOT_DRAG_SCROLLABLE?: string;
    ROOT_TRANSFORMED_ELEMENT?: string;
}

export interface ISelectorsState extends Required<ISelectorsProps> {
    FIXED_ELEMENT_STATIC: string;
    HIDE_ALL_FIXED_ELEMENTS: `${typeof DEFAULT_SELECTORS.HIDE_ALL_FIXED_ELEMENTS}${_TSeparator}${string}`;
    FIXED_TO_LEFT_EDGE_ELEMENT: `${typeof DEFAULT_SELECTORS.FIXED_TO_LEFT_EDGE_ELEMENT}${_TSeparator}${string}`;
}

export function getSelectorsState(
    propsSelectors: ISelectorsProps = {},
    guid: string = ''
): ISelectorsState {
    const requiredSelectors = _getPropsSelectors(propsSelectors);
    const separator: _TSeparator = guid ? '_' : '';

    return {
        FIXED_ELEMENT: `${requiredSelectors.FIXED_ELEMENT}${separator}${guid}`,
        SCROLLABLE_ELEMENT: `${requiredSelectors.SCROLLABLE_ELEMENT}${separator}${guid}`,
        NOT_DRAG_SCROLLABLE: `${requiredSelectors.NOT_DRAG_SCROLLABLE}${separator}${guid}`,
        ROOT_TRANSFORMED_ELEMENT: `${requiredSelectors.ROOT_TRANSFORMED_ELEMENT}${separator}${guid}`,

        FIXED_ELEMENT_STATIC: `${guid ? requiredSelectors.FIXED_ELEMENT : ''}`,
        HIDE_ALL_FIXED_ELEMENTS: `${DEFAULT_SELECTORS.HIDE_ALL_FIXED_ELEMENTS}${separator}${guid}`,
        FIXED_TO_LEFT_EDGE_ELEMENT: `${DEFAULT_SELECTORS.FIXED_TO_LEFT_EDGE_ELEMENT}${separator}${guid}`,
    };
}

function _getPropsSelectors(propsSelectors: ISelectorsProps): Required<ISelectorsProps> {
    return {
        FIXED_ELEMENT: propsSelectors.FIXED_ELEMENT || DEFAULT_SELECTORS.FIXED_ELEMENT,
        SCROLLABLE_ELEMENT:
            propsSelectors.SCROLLABLE_ELEMENT || DEFAULT_SELECTORS.SCROLLABLE_ELEMENT,
        NOT_DRAG_SCROLLABLE:
            propsSelectors.NOT_DRAG_SCROLLABLE || DEFAULT_SELECTORS.NOT_DRAG_SCROLLABLE,
        ROOT_TRANSFORMED_ELEMENT:
            propsSelectors.ROOT_TRANSFORMED_ELEMENT || DEFAULT_SELECTORS.ROOT_TRANSFORMED_ELEMENT,
    };
}
