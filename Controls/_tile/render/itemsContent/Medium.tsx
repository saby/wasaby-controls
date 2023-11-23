/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
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
