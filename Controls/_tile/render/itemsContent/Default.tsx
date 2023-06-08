/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */
import { ITileItemProps } from '../../display/mixins/TileItem';
import Title from 'Controls/_tile/render/itemComponents/Title';
import * as React from 'react';

export default function DefaultContent(
    props: ITileItemProps & { attrStyle?: React.CSSProperties }
): JSX.Element {
    const ImageTemplate = props.item.getImageTemplate(props.itemType);
    return (
        <>
            <ImageTemplate {...props} />
            <Title {...props} />
        </>
    );
}
