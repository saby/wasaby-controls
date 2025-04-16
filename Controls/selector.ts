/**
 * Библиотека c фабрикой окон выбора.
 * @library
 * @includes Factory Controls/selector:Factory
 * @public
 */
export { default as Factory } from 'Controls/_selector/SelectFactory';
export { default as SelectSlice } from 'Controls/_selector/SelectFactory/Slice';
export {
    default as loadData,
    ISelectFactoryLoadResults,
} from 'Controls/_selector/SelectFactory/loadData';
export { LISTS_CONTEXT_NODE_NAME } from 'Controls/_selector/SelectFactory/getContextConfig';
export { default as ISelectFactoryArguments } from 'Controls/_selector/interfaces/ISelectFactoryArguments';
export {
    ISelectorTabConfig,
    TSelectorTabsConfigs,
    IFilterConfig,
    IUserAreaConfig,
    IToolbarConfig,
    IHistoryConfig,
    ISelectorConfig,
} from 'Controls/_selector/interfaces/ISelector';
export { SELECT_SLICE_STORE_ID } from 'Controls/_selector/SelectFactory/Constants';
export { default as useSelectSlice } from 'Controls/_selector/useSelectSlice';
