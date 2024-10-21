import { USER } from 'ParametersWebAPI/Scope';
import { CrudEntityKey } from 'Types/source';

export const RootHistoryUtils = {
    getCached(key: string) {
        const config = USER.getConfig();
        const root = config.get(key);
        if (root === undefined) {
            return undefined;
        }
        return JSON.parse(root);
    },
    store(key: string, root: CrudEntityKey) {
        if (!key) {
            return Promise.resolve();
        }
        return USER.set(key, JSON.stringify(root));
    },
    restore(key: string) {
        if (!key) {
            return Promise.resolve();
        }
        return USER.load([key]).then((config) => JSON.parse(config.get(key)));
    },
    clearStoreAfterRemove(removedItems: CrudEntityKey[], key: string) {
        const root = this.getCached(key);
        if (root === undefined) {
            return Promise.resolve();
        }

        if (removedItems.find((it) => it === root)) {
            this.store(key, undefined);
        }
    },
};
