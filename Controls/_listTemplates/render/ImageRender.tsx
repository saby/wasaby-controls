import * as React from 'react';
import type { CollectionItem } from 'Controls/display';

interface ImageRenderProps {
    className?: string;
    src?: string;
    fallbackImage?: string;
    viewMode?: string;
    imageFit?: string;
    effect?: string;
    item?: CollectionItem;
    afterImageTemplate?: React.FunctionComponent<{ item }>;
}

const ImageRender = React.memo(function ListTemplatesImageRender({
    src,
    item,
    fallbackImage,
    viewMode,
    imageFit,
    effect,
    afterImageTemplate,
    className,
}: ImageRenderProps): React.ReactElement {
    const AfterImageTemplate = afterImageTemplate;
    return (
        <div className={className + ' controls-listTemplates__imageTemplate'}>
            <div
                className={`controls-listTemplates__imageTemplate_image
               controls-listTemplates__imageTemplate_image_${imageFit || 'cover'}
               controls-listTemplates__imageTemplate_image_viewMode-${viewMode}`}
                style={{ backgroundImage: 'url(' + (src || fallbackImage) + ')' }}
            ></div>
            {afterImageTemplate && <AfterImageTemplate item={item} />}
            {effect !== 'none' && (
                <div
                    className={`controls-listTemplates__imageTemplate_image_effect-${effect}`}
                ></div>
            )}
        </div>
    );
});

export default ImageRender;
