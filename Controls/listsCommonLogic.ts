/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
/**
 * Приватная библиотека содержащая общие списочные компоненты и утилиты.
 * @library
 * @includes hooks Controls/listsCommonLogic:hooks
 * @embedded
 */

export * as helpers from './_listsCommonLogic/helpers';
export * as ScrollControllerLib from './_listsCommonLogic/scrollController';
export { UILogic } from './_listsCommonLogic/UILogic';
export * as hooks from './_listsCommonLogic/hooks';

export { CollectionItemContext } from './_listsCommonLogic/CollectionItemContext';
export {
    Provider as CollectionProvider,
    useCollection,
    // Только для реэкспорта из Controls/_baseList/CollectionContext.tsx.
    // В остальных местах использоваться не должен, это непубличная вещь. Есть хук.
    _ctx as _CollectionContext,
} from './_listsCommonLogic/CollectionContext';

export {
    default as ListContextProvider,
    useListContext,
    _ctx as _ListContext,
} from './_listsCommonLogic/ListContext';

export {
    default as EditArrowComponent,
    IProps as IEditArrowProps,
    EDIT_ARROW_SELECTOR,
} from 'Controls/_listsCommonLogic/EditArrowComponent';

export { default as IndicatorComponent } from 'Controls/_listsCommonLogic/IndicatorComponent';

export { default as LoadingIndicatorTemplate } from './_listsCommonLogic/indicators/LoadingIndicatorTemplate';
export { default as IterativeLoadingTemplate } from './_listsCommonLogic/indicators/IterativeLoadingTemplate';
export { default as ContinueSearchTemplate } from './_listsCommonLogic/indicators/ContinueSearchTemplate';
export {
    default as IndicatorTemplate,
    IWrapperIndicatorsTemplateProps as IIndicatorTemplateProps,
} from './_listsCommonLogic/indicators/WrapperIndicatorsTemplate';

export {
    default as TriggerComponent,
    CollectionTriggerComponent,
} from './_listsCommonLogic/TriggerComponent';

export {
    ItemActionsTemplateSelector,
    IItemActionsTemplateSelectorProps,
    SwipeActionsTemplate,
    ISwipeActionsTemplateProps,
    HoverActionsTemplate,
    IHoverActionsTemplateProps,
} from './_listsCommonLogic/ItemActions';

export {
    default as NavigationButton,
    ConnectedCustomNavigationButton,
    JS_SELECTOR as NAV_BUTTON_JS_SELECTOR,
} from './_listsCommonLogic/NavigationButton';
