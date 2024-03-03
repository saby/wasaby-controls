/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
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
