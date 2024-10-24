/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import * as React from 'react';
import { ITileItemProps } from '../../display/mixins/TileItem';
import Title from 'Controls/_tile/render/itemComponents/Title';

export default function MediumContent(
    props: ITileItemProps & { attrStyle?: React.CSSProperties }
): JSX.Element {
    const ImageTemplate = props.item.getImageTemplate(props.itemType);
    return (
        <div className={props.item.getContentClasses(props)} style={props.attrStyle}>
            <ImageTemplate {...props} attrStyle={undefined} />
            <Title {...props} attrStyle={undefined} />
        </div>
    );
}
