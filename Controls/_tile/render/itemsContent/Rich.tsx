/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import { createElement, delimitProps } from 'UICore/Jsx';
import { ITileItemProps } from '../../display/mixins/TileItem';
import * as React from 'react';
import Title from 'Controls/_tile/render/itemComponents/Title';

function AfterImageTemplate(props: ITileItemProps): JSX.Element {
    return props.afterImageTemplate
        ? createElement(props.afterImageTemplate, {
              item: props.item,
              itemData: props.item,
          })
        : null;
}

function AdditionalPanelTemplate(props: ITileItemProps): JSX.Element {
    if (!props.additionalPaneltemplate) {
        return null;
    }

    return (
        <div
            className={props.item.getAdditionalPanelClasses(
                props.additionalPanelPosition,
                props.imageViewMode
            )}
        >
            {createElement(props.additionalPaneltemplate)}
        </div>
    );
}

export default function RichContent(
    props: ITileItemProps & { attrStyle?: React.CSSProperties }
): JSX.Element {
    const { clearProps } = delimitProps(props);
    if (!clearProps.imagePosition) {
        clearProps.imagePosition = 'top';
    }
    if (!clearProps.imageViewMode) {
        clearProps.imageViewMode = 'rectangle';
    }
    if (!clearProps.imageSize) {
        clearProps.imageSize = 's';
    }
    if (!clearProps.imageFit) {
        clearProps.imageFit = 'cover';
    }

    const ImageTemplate = props.item.getImageTemplate(clearProps.itemType);
    return (
        <div className={props.item.getContentClasses(clearProps)} style={props.attrStyle}>
            <ImageTemplate
                {...clearProps}
                imageProportion={props.item.getImageProportion(clearProps.imageProportion)}
                attrStyle={undefined}
            />
            <AfterImageTemplate {...clearProps} />
            <AdditionalPanelTemplate {...clearProps} />
            <Title {...clearProps} attrStyle={undefined} />
        </div>
    );
}
