/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
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
