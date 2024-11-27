/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import * as React from 'react';
import { delimitProps } from 'UICore/Jsx';

import { AutoResizer } from 'Controls/_tile/render/itemComponents/AutoResizer';
import { ITileItemProps } from 'Controls/_tile/display/mixins/TileItem';
import Gradient from 'Controls/_tile/render/itemComponents/Gradient';

interface IImageProps extends ITileItemProps {
    imageAlign: string;
    attrStyle?: React.CSSProperties;
}

export type ImageComponent = React.FunctionComponent<IImageProps>;

function ImageGradient(props: IImageProps): JSX.Element {
    const shouldDisplayTopGradient =
        props.titlePosition === 'onImage' || props.contentPosition === 'onImageTop';
    const shouldDisplayBottomGradient = props.contentPosition === 'onImageBottom';
    const verticalGradient = (position: 'top' | 'bottom') => {
        const gradient = props.item.getBigGradientStyles(
            props.itemType,
            position === 'top' ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0)',
            position === 'top' ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.35)'
        );
        return (
            <div
                className={'controls-TileView__richTemplate_image_topGradient'}
                style={{ backgroundImage: gradient }}
            />
        );
    };

    return (
        <>
            {shouldDisplayTopGradient && verticalGradient('top')}
            {shouldDisplayBottomGradient && verticalGradient('bottom')}
            <Gradient {...props} position={'image'} />
        </>
    );
}

function Image(props: IImageProps): JSX.Element {
    const imageUrl = props.item.getImageUrl(
        props.width,
        props.imagePosition,
        props.imageViewMode,
        props.fallbackImage
    );
    const ImageTag: keyof JSX.IntrinsicElements = !!imageUrl ? 'img' : 'div';
    const [image, setImage] = React.useState(imageUrl);
    const [prevImageUrl, setPrevImageUrl] = React.useState(imageUrl);
    if (prevImageUrl !== imageUrl) {
        setImage(imageUrl);
        setPrevImageUrl(imageUrl);
    }
    const className = props.item.getImageClasses(
        props.itemType,
        props.width,
        props.imageAlign,
        props.imageViewMode,
        props.imageProportion,
        props.imagePosition,
        props.imageSize,
        props.imageFit,
        props.imageProportionOnItem,
        props.contentPadding
    );
    const gradient =
        props.itemType === 'rich'
            ? props.item.getBigGradientStyles(
                  props.itemType,
                  props.gradientStartColor || props.gradientColor,
                  props.gradientStopColor || props.gradientColor,
                  props.gradientDirection
              )
            : '';
    const style = {
        backgroundImage: gradient,
    };
    return (
        <div className={props.item.getImageAlignClasses(props.imageAlign)}>
            <ImageTag
                className={className}
                onError={() => {
                    if (image !== props.fallbackImage) {
                        setImage(props.fallbackImage);
                    }
                }}
                loading={'lazy'}
                style={style}
                src={image}
                data-qa={'controls-ItemTemplate__image'}
            />
        </div>
    );
}

export default function ImageWrapper(props: IImageProps): JSX.Element {
    if (props.imageViewMode === 'none') {
        return null;
    }

    const { clearProps } = delimitProps(props);

    const dataQa =
        props.item.isAnimated() && props.item.getTileMode() === 'dynamic'
            ? 'controls-TileView__item_animated'
            : 'controls-TileView__item_not_animated';

    const wrapperClasses = props.item.getImageWrapperClasses(props);
    const wrapperStyleObject = {
        ...props.item.getImageWrapperStyles(props),
        ...props.attrStyle,
    };

    return (
        <div className={wrapperClasses} style={wrapperStyleObject} data-qa={dataQa}>
            <AutoResizer {...clearProps} position={'image'} />
            <Image {...clearProps} />
            <ImageGradient {...clearProps} />
        </div>
    );
}
