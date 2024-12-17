import { IImageItemProps, ImageItem } from 'Controls-Templates/itemTemplates';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';
import 'css!DemoStand/Controls-demo';
import 'css!Controls-Templates-demo/styles';

interface ImageItemDemoProps {
    showGoodImage: boolean;
}

function ImageItemDemo(props: ImageItemDemoProps) {
    const { showGoodImage } = props;
    const commonItemsProps: Partial<IImageItemProps> = {
        className:
            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__squareImage_size',
        cursor: 'pointer',
        roundAngleBL: 'm',
        roundAngleBR: 'm',
        roundAngleTL: 'm',
        roundAngleTR: 'm',
        paddingTop: 'null',
        paddingBottom: 'null',
        paddingLeft: 'null',
        paddingRight: 'null',
    };

    return (
        <div className={'controlsDemo__wrapper controlsDemo__flexRow controlsDemo_widthFit'}>
            <ImageItem
                {...commonItemsProps}
                imageSrc={showGoodImage ? Images.SOUPS : Images.GREEN}
            />
            <ImageItem
                {...commonItemsProps}
                imageSrc={showGoodImage ? Images.GOOD_RIVER : Images.RIVER}
            />
            <ImageItem
                {...commonItemsProps}
                imageSrc={showGoodImage ? Images.BURGERS : Images.BLUE}
            />
            <ImageItem
                {...commonItemsProps}
                imageSrc={showGoodImage ? Images.GOOD_MOUNTAINS : Images.GREEN}
            />
            <ImageItem
                {...commonItemsProps}
                imageSrc={showGoodImage ? Images.BURGERS : Images.RIVER}
            />
        </div>
    );
}

export default ImageItemDemo;
