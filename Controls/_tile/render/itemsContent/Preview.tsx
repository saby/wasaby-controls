/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */
import * as React from 'react';
import { createElement } from 'UICore/Jsx';

import { ITileItemProps } from 'Controls/_tile/display/mixins/TileItem';
import Title from 'Controls/_tile/render/itemComponents/Title';
import FooterTemplate from 'Controls/_tile/render/itemComponents/FooterTemplate';

function TopTemplate(props: ITileItemProps): JSX.Element {
    return props.topTemplate
        ? createElement(
              props.topTemplate,
              { item: props.item, itemData: props.item },
              { class: 'controls-TileView__previewTemplate_topTemplate' }
          )
        : null;
}

export default function PreviewContent(
    props: ITileItemProps & { attrStyle?: React.CSSProperties }
): JSX.Element {
    const ImageTemplate = props.item.getImageTemplate(props.itemType);
    return (
        <div
            className={props.item.getContentClasses(props)}
            style={props.attrStyle}
        >
            <ImageTemplate {...props} attrStyle={undefined} />
            <TopTemplate {...props} />
            <Title {...props} attrStyle={undefined} />
            <FooterTemplate {...props} place={'content'} />
        </div>
    );
}
