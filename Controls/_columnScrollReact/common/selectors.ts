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
    OFFSET_FOR_START_FIXED_ELEMENT:
        `${prefix}_offsetForStartFixed` as `${typeof prefix}_offsetForStartFixed`,
    OFFSET_FOR_END_FIXED_ELEMENT:
        `${prefix}_offsetForEndFixed` as `${typeof prefix}_offsetForEndFixed`,
    FIXED_TO_RIGHT_EDGE_ELEMENT:
        `${prefix}_fixed-toRightEdge` as `${typeof prefix}_fixed-toRightEdge`,
    HIDE_ALL_FIXED_ELEMENTS: `${prefix}_hideFixedElements` as `${typeof prefix}_hideFixedElements`,
    STRETCHED_TO_VIEWPORT_ELEMENT:
        `${prefix}_stretchedToViewPortElement` as `${typeof prefix}_stretchedToViewPortElement`,
};

/**
 * CSS селекторы различных элементов внутри скроллируемой области.
 * К данным селекторам будут применен посфикс из опции GUID провайдера контекста, если она задана.
 * Помимо строго заданных имен, может содержать пользовательские селекторы, которые будут доступны в контексте.
 * К пользовательским селекторам НЕ будет применен постфикс.
 * При наличии заданного на провайдере GUID, пользовательские селекторы будут продублированы в аналогичном поле с
 * постфиксом '_uniq'(например { myElement: 'controls_MyElement' } и guid: 'qwe-123' -> { myElement: 'controls_MyElement', myElement_uniq: 'controls_MyElement_qwe-123' }).
 * @private
 */
export interface ISelectorsProps {
    /**
     * Корневой элемент области скроллирования.
     */
    ROOT_TRANSFORMED_ELEMENT?: string;

    /**
     * Селектор фиксированного элемента.
     * Дает элементу такое смещение, что при скроллировании контента он не скроллится, а остается на месте.
     * Не прижимает контент к какой-либо границе, где в вёрстке расположен элемент, там он и зафиксируется.
     */
    FIXED_ELEMENT?: string;

    /**
     * Селектор фиксированного элемента, который прижат к правой границе.
     * Дает элементу такое смещение, что при скроллировании контента он не скроллится, а остается на месте,
     * при этом элемент будет прижат к правой границе видимой области.
     */
    FIXED_TO_RIGHT_EDGE_ELEMENT?: string;

    /**
     * Селектор скроллируемого элемента.
     */
    SCROLLABLE_ELEMENT?: string;

    /**
     * Селектор элемента, над которым запрещено скролирование мышью.
     * При попытке потянуть за элемент с данным селектором скроллирования не произойдет.
     */
    NOT_DRAG_SCROLLABLE?: string;

    /**
     * Элемент со смещением на величину зафиксированной в начале области.
     * По данному селектору задается смещение через свойство left.
     */
    OFFSET_FOR_START_FIXED_ELEMENT?: string;

    /**
     * Элемент со смещением на величину зафиксированной в конце области.
     * По данному селектору задается смещение через свойство right.
     */
    OFFSET_FOR_END_FIXED_ELEMENT?: string;

    /**
     * Элемент имеющий ширину, равную вьюпорту.
     * По данному селектору задается ширина через свойство width.
     */
    STRETCHED_TO_VIEWPORT_ELEMENT?: string;

    /**
     * Пользовательские селекторы.
     * К пользовательским селекторам НЕ будет применен постфикс.
     * При наличии заданного на провайдере GUID, пользовательские селекторы будут продублированы в аналогичном поле с
     * постфиксом '_uniq'(например { myElement: 'controls_MyElement' } и guid: 'qwe-123' -> { myElement: 'controls_MyElement', myElement_uniq: 'controls_MyElement_qwe-123' }).
     */
    [key: string]: string;
}

export interface ISelectorsState extends Required<ISelectorsProps> {
    // Утилитарный класс, скрывает фиксированные элементы.
    HIDE_ALL_FIXED_ELEMENTS: `${typeof DEFAULT_SELECTORS.HIDE_ALL_FIXED_ELEMENTS}${_TSeparator}${string}`;
}

export function getSelectorsState(
    propsSelectors: ISelectorsProps = {},
    guid: string = ''
): ISelectorsState {
    const requiredSelectors = _getPropsSelectors(propsSelectors);
    const separator: _TSeparator = guid ? '_' : '';

    const result: ISelectorsState = {
        FIXED_ELEMENT: `${requiredSelectors.FIXED_ELEMENT}${separator}${guid}`,
        SCROLLABLE_ELEMENT: `${requiredSelectors.SCROLLABLE_ELEMENT}${separator}${guid}`,
        NOT_DRAG_SCROLLABLE: `${requiredSelectors.NOT_DRAG_SCROLLABLE}${separator}${guid}`,
        ROOT_TRANSFORMED_ELEMENT: `${requiredSelectors.ROOT_TRANSFORMED_ELEMENT}${separator}${guid}`,

        OFFSET_FOR_START_FIXED_ELEMENT: `${requiredSelectors.OFFSET_FOR_START_FIXED_ELEMENT}${separator}${guid}`,
        OFFSET_FOR_END_FIXED_ELEMENT: `${requiredSelectors.OFFSET_FOR_END_FIXED_ELEMENT}${separator}${guid}`,
        FIXED_TO_RIGHT_EDGE_ELEMENT: `${requiredSelectors.FIXED_TO_RIGHT_EDGE_ELEMENT}${separator}${guid}`,
        STRETCHED_TO_VIEWPORT_ELEMENT: `${requiredSelectors.STRETCHED_TO_VIEWPORT_ELEMENT}${separator}${guid}`,

        HIDE_ALL_FIXED_ELEMENTS: `${DEFAULT_SELECTORS.HIDE_ALL_FIXED_ELEMENTS}${separator}${guid}`,
    };

    Object.keys(propsSelectors).forEach((key) => {
        if (!result[key]) {
            result[key] = propsSelectors[key];
            if (guid) {
                result[`${key}_uniq`] = `${propsSelectors[key]}${separator}${guid}`;
            }
        }
    });

    return result;
}

function _getPropsSelectors(propsSelectors: ISelectorsProps): Required<ISelectorsProps> {
    return {
        FIXED_ELEMENT: propsSelectors.FIXED_ELEMENT || DEFAULT_SELECTORS.FIXED_ELEMENT,
        FIXED_TO_RIGHT_EDGE_ELEMENT:
            propsSelectors.FIXED_TO_RIGHT_EDGE_ELEMENT ||
            DEFAULT_SELECTORS.FIXED_TO_RIGHT_EDGE_ELEMENT,
        SCROLLABLE_ELEMENT:
            propsSelectors.SCROLLABLE_ELEMENT || DEFAULT_SELECTORS.SCROLLABLE_ELEMENT,
        NOT_DRAG_SCROLLABLE:
            propsSelectors.NOT_DRAG_SCROLLABLE || DEFAULT_SELECTORS.NOT_DRAG_SCROLLABLE,
        ROOT_TRANSFORMED_ELEMENT:
            propsSelectors.ROOT_TRANSFORMED_ELEMENT || DEFAULT_SELECTORS.ROOT_TRANSFORMED_ELEMENT,
        OFFSET_FOR_START_FIXED_ELEMENT:
            propsSelectors.OFFSET_FOR_START_FIXED_ELEMENT ||
            DEFAULT_SELECTORS.OFFSET_FOR_START_FIXED_ELEMENT,
        OFFSET_FOR_END_FIXED_ELEMENT:
            propsSelectors.OFFSET_FOR_END_FIXED_ELEMENT ||
            DEFAULT_SELECTORS.OFFSET_FOR_END_FIXED_ELEMENT,
        STRETCHED_TO_VIEWPORT_ELEMENT:
            propsSelectors.STRETCHED_TO_VIEWPORT_ELEMENT ||
            DEFAULT_SELECTORS.STRETCHED_TO_VIEWPORT_ELEMENT,
    };
}
