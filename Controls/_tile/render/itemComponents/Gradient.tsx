/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */
import { ITileItemProps } from 'Controls/_tile/display/mixins/TileItem';

interface IGradientProps extends ITileItemProps {
    position: 'image' | 'title';
}

export default function Gradient(props: IGradientProps): JSX.Element {
    const shouldDisplayGradient = props.item.shouldDisplayGradient(
        props.itemType,
        props.imageEffect,
        props.imageViewMode,
        props.imagePosition,
        props.position
    );

    if (!shouldDisplayGradient) {
        return null;
    }

    return (
        <div
            className={props.item.getGradientClasses(props.itemType, props.gradientType)}
            style={props.item.getGradientStyles(
                props.itemType,
                props.gradientColor,
                props.gradientType
            )}
        />
    );
}
