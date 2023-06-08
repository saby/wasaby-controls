/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import { DataSet, CrudEntityKey } from 'Types/source';
import { USER } from 'ParametersWebAPI/Scope';
import { Logger } from 'UI/Utils';

export const nodeHistoryUtil = {
    /**
     * Store state of expandable items to UserConfig
     * @param items Array of expandable items
     * @param key Key to store list of expandable items
     */
    store(items: CrudEntityKey[], key: string): Promise<DataSet | boolean> {
        const value = JSON.stringify(items);
        return USER.set(key, value);
    },

    /**
     * Restore state of expandable items from cache without service call
     * @param key Key to store array of expandable items
     */
    getCached(key: string): CrudEntityKey[] {
        const config = USER.getConfig();
        const result = config.get(key);
        return result !== undefined ? JSON.parse(result) : undefined;
    },

    /**
     * Restore state of expandable items from UserConfig
     * @param key Key to store array of expandable items
     */
    restore(key: string): Promise<CrudEntityKey[]> {
        return new Promise<CrudEntityKey[]>((resolve, reject) => {
            USER.load([key])
                .then((config) => {
                    try {
                        const result = config.get(key);
                        if (result !== undefined) {
                            resolve(JSON.parse(result));
                        } else {
                            resolve();
                        }
                    } catch (e) {
                        const msg = 'nodeHistoryUtil: Invalid value format for key "' + key + '"';
                        Logger.error(msg, this);
                        reject(msg);
                    }
                })
                .catch((e) => {
                    const msg = `nodeHistoryUtil: An error occurred while getting data.\nError: ${e.message}`;
                    Logger.warn(msg);
                    reject(msg);
                });
        });
    },
};
