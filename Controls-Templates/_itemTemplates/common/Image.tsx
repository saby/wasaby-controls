import * as React from 'react';

interface IImageProps {
    className: string;
    imageSrc: string | string[];
    fallbackImage: string;
    title: string;
    imageAlt: string;
}

function getImageSrc(imageSrc: string | string[]): string {
    if (imageSrc instanceof Array) {
        const [src] = imageSrc;
        return src;
    }
    return imageSrc;
}

function getImageSrcSet(imageSrc: string | string[]): string | void {
    if (imageSrc instanceof Array) {
        return imageSrc
            .map((img, index) => {
                return `${img} ${index + 1}x`;
            })
            .join(', ');
    }
    return;
}

export default function Image(props: IImageProps): React.ReactElement<IImageProps> {
    const [image, setImage] = React.useState(props.imageSrc);
    const [prevImage, setPrevImage] = React.useState(props.imageSrc);
    const ImageTag: keyof JSX.IntrinsicElements = !!image ? 'img' : 'div';

    // Если сменилось изображение в пропсах, нужно грузить новое.
    if (prevImage !== props.imageSrc) {
        setImage(props.imageSrc);
        setPrevImage(props.imageSrc);
    }

    // Для тега img loading="lazy" приводит к утечкам. Нативная проблема хрома, он держит в памяти такие объекты:
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1213045
    // По ссылке выше разбирается примитивный пример, где на чистом html+js собран пример с утечкой.
    // Поэтому удалили этот attr по ошибке об утечках:
    // https://online.sbis.ru/opendoc.html?guid=7bb01e85-2ebc-4c89-a8c3-96597eaf5b7f&client=3
    return (
        <ImageTag
            className={props.className}
            onError={() => {
                // Если изображение не загрузилось, пробуем загрузить заглушку.
                if (props.fallbackImage && image !== props.fallbackImage) {
                    setImage(props.fallbackImage);
                }
            }}
            data-qa="controls-ItemTemplate__image"
            title={props.title}
            src={getImageSrc(image)}
            srcSet={getImageSrcSet(image)}
            alt={props.imageAlt}
        />
    );
}
