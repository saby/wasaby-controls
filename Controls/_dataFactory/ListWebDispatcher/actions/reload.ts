import { TAbstractAction } from 'Controls/_dataFactory/AbstractDispatcher/types/TAbstractAction';
import { INavigationSourceConfig } from 'Controls/_interface/INavigation';

export type TReloadAction = TAbstractAction<
    'reload',
    {
        sourceConfig?: INavigationSourceConfig;
        keepNavigation?: boolean;
        onResolve?: Function;
        onReject?: Function;
    }
>;

export const reload = (
    sourceConfig?: INavigationSourceConfig,
    keepNavigation?: boolean,
    onResolve?: Function,
    onReject?: Function
): TReloadAction => ({
    type: 'reload',
    payload: {
        sourceConfig,
        keepNavigation,
        onResolve,
        onReject,
    },
});

export type TReloadActions = TReloadAction;
