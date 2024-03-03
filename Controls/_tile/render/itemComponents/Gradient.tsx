/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
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
