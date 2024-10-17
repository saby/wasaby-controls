import { INavigationOptionValue, INavigationPositionSourceConfig } from 'Controls/interface';

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
            limit: 35,
        },
    };
}
