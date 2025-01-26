/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */

/**
 * @private
 */
export interface IDataLoadProvider<Config, Result> {
    load: (
        cfg: Config,
        loadTimeout?: number,
        listConfigStoreId?: string,
        dependencies?: unknown[]
    ) => Promise<Result>;
}

export interface IBaseLoadDataConfig {
    afterLoadCallback?: string;
}
