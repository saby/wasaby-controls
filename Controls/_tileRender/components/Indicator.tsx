import { IndicatorComponent } from 'Controls/listsCommonLogic';

import { ITileViewProps, TPosition } from '../interface/ITileView';

interface IIndicatorComponentWrapperProps extends Pick<ITileViewProps, 'collection'> {
    position: TPosition;
}

export function IndicatorComponentWrapper(props: IIndicatorComponentWrapperProps) {
    const { position, collection } = props;
    const indicator =
        position === 'backward' ? collection.getTopIndicator() : collection.getBottomIndicator();
    return indicator && <IndicatorComponent item={indicator} v={indicator.getVersion()} />;
}
