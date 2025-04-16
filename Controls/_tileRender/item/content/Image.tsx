import { IImageProps, IImageFitProps } from 'Controls/_tileRender/interface/IRenderAspects';

export function Image<T extends IImageProps & IImageFitProps>(props: T) {
    if (!props.imageSrc) {
        return null;
    }

    return <div>image</div>;
}
