import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { ITileOptions } from '../TileView';

export function resolveViewControls(
    control: unknown,
    options: ITileOptions,
    wasabyView: object
): void {
    const canBeReact = options._isReactView;
    const isReactLoaded = canBeReact && isLoaded('Controls/tileRender');
    const reactLib = isReactLoaded && loadSync('Controls/tileRender');

    if (canBeReact && isReactLoaded) {
        control._viewName = reactLib.TileView;
        control._isReactView = true;
    } else {
        control._viewName = wasabyView;
        control._isReactView = false;
    }
}
