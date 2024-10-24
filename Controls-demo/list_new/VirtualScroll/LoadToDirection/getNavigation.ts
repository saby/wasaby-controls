import {
    INavigationOptionValue,
    INavigationPositionSourceConfig,
} from 'Controls/_interface/INavigation';

export function getNavigation(
    position: number
): INavigationOptionValue<INavigationPositionSourceConfig> {
    return {
        source: 'position',
        view: 'infinity',
        sourceConfig: {
            field: 'key',
            position,
            direction: 'bothways',
            limit: 20,
        },
    };
}
