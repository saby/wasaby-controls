/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import cDeferred = require('Core/Deferred');
import { Logger } from 'UI/Utils';
import { USER } from 'ParametersWebAPI/Scope';

const PREFIX_STORE_KEY_COLLAPSED_GROUP = 'LIST_COLLAPSED_GROUP_';
const GroupUtil = {
    /**
     * Store collapsed groups to UserConfig
     * @param groups List of the collapsed groups
     * @param storeKey Key to store list of collapsed groups
     */
    storeCollapsedGroups(
        groups: (string | number)[],
        storeKey: string
    ): Promise<boolean> {
        const preparedGroups = JSON.stringify(groups);
        return USER.set(
            PREFIX_STORE_KEY_COLLAPSED_GROUP + storeKey,
            preparedGroups
        );
    },

    /**
     * Restore collapsed groups from UserConfig
     * @param storeKey Key to store list of collapsed groups
     */
    restoreCollapsedGroups(storeKey: string): Promise<unknown> {
        const result = new cDeferred();
        const preparedStoreKey = PREFIX_STORE_KEY_COLLAPSED_GROUP + storeKey;
        USER.load([preparedStoreKey])
            .then((config) => {
                try {
                    const storedGroups = config.get(preparedStoreKey);
                    if (storedGroups !== undefined) {
                        result.callback(JSON.parse(storedGroups));
                    } else {
                        result.callback();
                    }
                } catch (e) {
                    Logger.error(
                        'GroupUtil: In the store by key "' +
                            preparedStoreKey +
                            '" value in invalid format.'
                    );
                    result.callback();
                }
            })
            .catch((e) => {
                Logger.warn(
                    `GroupUtil: An error occurred while getting data.\nError: ${e.message}`
                );
                result.callback();
            });
        return result;
    },
};
export default GroupUtil;
