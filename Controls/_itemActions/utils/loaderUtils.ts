import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { Logger } from 'UI/Utils';

export function getCollectionItemContext() {
    if (!isLoaded('Controls/listsCommonLogic')) {
        Logger.error(
            'Controls/listsCommonLogic library should be loaded first to use ItemActionsComponent'
        );
    }
    const { CollectionItemContext } = loadSync<typeof import('Controls/listsCommonLogic')>(
        'Controls/listsCommonLogic'
    );
    return CollectionItemContext;
}

export function getActionsLib() {
    if (!isLoaded('Controls/actions')) {
        return { MenuSource: null, ActionsCollection: null, executeAction: null };
    }
    const { MenuSource, ActionsCollection, executeAction } =
        loadSync<typeof import('Controls/actions')>('Controls/actions');
    return { MenuSource, ActionsCollection, executeAction };
}
