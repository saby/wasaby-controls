import { CollectionTriggerComponent, TriggerComponent } from 'Controls/listsCommonLogic';

import { ITileViewProps, TPosition } from '../interface/ITileView';

interface ITriggerComponentWrapperProps
    extends Pick<
        ITileViewProps,
        'collection' | 'onViewTriggerVisibilityChanged' | 'viewTriggerProps'
    > {
    position: TPosition;
}

export function TriggerComponentWrapper(props: ITriggerComponentWrapperProps) {
    const { position, collection, onViewTriggerVisibilityChanged, viewTriggerProps } = props;

    if (onViewTriggerVisibilityChanged) {
        const compatiblePosition = position === 'backward' ? 'top' : 'bottom';

        return (
            <TriggerComponent
                instId="gridReact"
                orientation="horizontal"
                position={compatiblePosition}
                callback={onViewTriggerVisibilityChanged}
                {...viewTriggerProps}
            />
        );
    } else {
        const trigger =
            position === 'backward' ? collection.getTopTrigger() : collection.getBottomTrigger();

        return <CollectionTriggerComponent trigger={trigger} />;
    }
}
