import { VerticalItem } from 'Controls-Templates/itemTemplates';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';
import { COMMON_PROPS } from '../DataHelper';
import 'css!DemoStand/Controls-demo';
import 'css!Controls/CommonClasses';
import 'css!Controls-Templates-demo/styles';

interface ImageViewModeDemoProps {
    showGoodImage: boolean;
}

function ImageViewModeDemo(props: ImageViewModeDemoProps) {
    const { showGoodImage } = props;
    return (
        <div className={'controlsDemo__wrapper controlsDemo__flexColumn controlsDemo_widthFit'}>
            <h4>imagePosition, imageProportion, imageViewMode</h4>
            <div className={'controlsDemo__wrapper controlsDemo__flexRow'}>
                <VerticalItem
                    {...COMMON_PROPS}
                    className={
                        'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                    }
                    imageSrc={showGoodImage ? Images.BURGERS : Images.RIVER}
                    imageViewMode={'rectangle'}
                    caption={'Бургер из сочной говядины'}
                    description={'300г'}
                    footer={
                        <div
                            className={
                                'Controls-Templates-demo__catalog_icon' +
                                ' controls-icon_size-s icon-RoundPlus'
                            }
                        ></div>
                    }
                />
                <VerticalItem
                    {...COMMON_PROPS}
                    className={
                        'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                    }
                    imageSrc={showGoodImage ? Images.BURGERS : Images.RIVER}
                    imageViewMode={'rectangle'}
                    imageProportion={'4:3'}
                    caption={'Бургер из сочной говядины'}
                    description={'Описание товара'}
                    footer={
                        <div
                            className={
                                'Controls-Templates-demo__catalog_icon' +
                                ' controls-icon_size-s icon-RoundPlus'
                            }
                        ></div>
                    }
                />
                <VerticalItem
                    {...COMMON_PROPS}
                    className={
                        'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                    }
                    imageSrc={showGoodImage ? Images.BURGERS : Images.RIVER}
                    imageViewMode={'rectangle'}
                    imagePosition={'bottom'}
                    caption={'Бургер из сочной говядины'}
                    description={'300г'}
                    footer={
                        <div
                            className={
                                'Controls-Templates-demo__catalog_icon' +
                                ' controls-icon_size-s icon-RoundPlus'
                            }
                        ></div>
                    }
                />
                <VerticalItem
                    {...COMMON_PROPS}
                    className={
                        'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                    }
                    imageSrc={showGoodImage ? Images.BURGERS : Images.RIVER}
                    imageViewMode={'circle'}
                    caption={'Бургер из сочной говядины'}
                    description={'300г'}
                    footer={
                        <div
                            className={
                                'Controls-Templates-demo__catalog_icon' +
                                ' controls-icon_size-s icon-RoundPlus'
                            }
                        ></div>
                    }
                />
                <VerticalItem
                    {...COMMON_PROPS}
                    className={
                        'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                    }
                    imageSrc={showGoodImage ? Images.BURGERS : Images.RIVER}
                    imageViewMode={'none'}
                    caption={'Бургер из сочной говядины'}
                    description={
                        'А это плитка без изображения, так что бургера вы здесь не увидите. Зато, тут есть длинное описание, состав и пищевая ценность. Две булочки, салатик, котлетка из коровки и соус.'
                    }
                    footer={
                        <>
                            <div className={'controls-text-label controls-margin_top-s'}>
                                <p>На 100г блюда:</p>
                                <p>50г ..... белки</p>
                                <p>25г ..... жиры</p>
                                <p>25г ..... углеводы</p>
                                <p>400ккал калорийность</p>
                            </div>
                            <div
                                className={
                                    'Controls-Templates-demo__catalog_icon' +
                                    ' controls-icon_size-s icon-RoundPlus'
                                }
                            ></div>
                        </>
                    }
                />
            </div>
        </div>
    );
}

export default ImageViewModeDemo;
