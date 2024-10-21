import { VerticalItem, interfaces } from 'Controls-Templates/itemTemplates';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';
import 'css!DemoStand/Controls-demo';
import 'css!Controls/CommonClasses';
import 'css!Controls-Templates-demo/styles';

const COMMON_PROPS = {
    roundAngleBL: 's',
    roundAngleBR: 's',
    roundAngleTL: 's',
    roundAngleTR: 's',
    cursor: 'pointer',
    captionFontSize: 'xl',
    imageSize: '4xl',
    captionFontWeight: 'bold',
    descriptionFontSize: 'm',
    descriptionFontColorStyle: 'unaccented',
    shadowVisibility: 'visible',
};

const IMAGE_POSITIONS_BASIC: interfaces.TVerticalPosition[] = ['top', 'bottom'];
const IMAGE_POSITIONS_COMPLEX: interfaces.TVerticalPosition[] = [
    'top-left',
    'top-right',
    'top-middle',
    'bottom-left',
    'bottom-right',
    'bottom-middle',
];
interface ImagePositionDemoProps {
    showGoodImage: boolean;
}

function ImagePositionDemo(props: ImagePositionDemoProps) {
    const { showGoodImage } = props;
    return (
        <div className={'controlsDemo__wrapper controlsDemo__flexColumn controlsDemo_widthFit'}>
            <h4>imagePosition</h4>
            <div className={'controlsDemo__wrapper controlsDemo__flexRow'}>
                {IMAGE_POSITIONS_BASIC.map((position) => {
                    return (
                        <VerticalItem
                            {...COMMON_PROPS}
                            key={position}
                            className={
                                'Controls-Templates-demo__itemsSpacing controlsDemo_fixedWidth200'
                            }
                            imageSrc={showGoodImage ? Images.BURGERS : Images.RIVER}
                            imageViewMode={'rectangle'}
                            imagePosition={position}
                            caption={'Бургер из сочной говядины'}
                            description={
                                <div>
                                    <p>Состав:</p>
                                    <p>Две мясных котлеты гриль,</p>
                                    <p>специальный соус, cыр</p>
                                    <p>огурцы, салат и лук</p>
                                </div>
                            }
                        />
                    );
                })}
            </div>
            <div className={'controlsDemo__wrapper controlsDemo__flexRow'}>
                {IMAGE_POSITIONS_COMPLEX.map((position) => {
                    return (
                        <VerticalItem
                            {...COMMON_PROPS}
                            key={position}
                            className={
                                'Controls-Templates-demo__itemsSpacing controlsDemo_fixedWidth200'
                            }
                            imageSrc={showGoodImage ? Images.BURGERS : Images.RIVER}
                            imageViewMode={'rectangle'}
                            imagePosition={position}
                            caption={'Бургер из сочной говядины'}
                            description={
                                <div>
                                    <p>Состав:</p>
                                    <p>Две мясных котлеты гриль,</p>
                                    <p>специальный соус, cыр</p>
                                    <p>огурцы, салат и лук</p>
                                </div>
                            }
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default ImagePositionDemo;
