/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
export interface IGroupingOptions {
    groupProperty?: string;
    groupingKeyCallback?: Function;
    groupHistoryId?: string;
    historyIdCollapsedGroups?: string;
}

/**
 * Интерфейс для контролов, которые поддерживают группировку записей.
 *
 * @public
 */
export default interface IGrouping {
    readonly '[Controls/_interface/IHeight]': boolean;
}
