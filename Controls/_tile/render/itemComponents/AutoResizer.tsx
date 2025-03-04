/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import { ITileItemProps } from 'Controls/_tile/display/mixins/TileItem';

export interface IAutoResizerProps extends ITileItemProps {
    position: 'item' | 'image';
}

export function AutoResizer(props: IAutoResizerProps): JSX.Element {
    const shouldDisplay = props.item.shouldDisplayAutoResizer(props);
    if (!shouldDisplay) {
        return null;
    }

    return (
        <div
            className={props.item.getAutoResizerClasses(props)}
            style={props.item.getAutoResizerStyles(props)}
        />
    );
}
