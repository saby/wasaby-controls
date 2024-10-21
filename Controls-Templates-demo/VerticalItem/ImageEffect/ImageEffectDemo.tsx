import { VerticalItem } from 'Controls-Templates/itemTemplates';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';
import { COMMON_PROPS } from '../DataHelper';
import 'css!DemoStand/Controls-demo';
import 'css!Controls/CommonClasses';
import 'css!Controls-Templates-demo/styles';

interface ImageEffectDemoProps {
    showGoodImage: boolean;
}

function ImageEffectDemo(props: ImageEffectDemoProps) {
    const { showGoodImage } = props;
    return (
        <div className={'controlsDemo__wrapper controlsDemo__flexColumn controlsDemo_widthFit'}>
            <h4>imageEffect</h4>
            <div className={'controlsDemo__wrapper controlsDemo__flexRow'}>
                <VerticalItem
                    {...COMMON_PROPS}
                    className={
                        'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                    }
                    imageSrc={showGoodImage ? Images.BURGERS : Images.RIVER}
                    imageViewMode={'rectangle'}
                    imageEffect={'custom'}
                    dominantColor={'60,60,60'}
                    brightness={'dark'}
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
                    imageViewMode={'circle'}
                    imageEffect={'custom'}
                    dominantColor={'60,60,60'}
                    brightness={'dark'}
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
                    imageSrc={showGoodImage ? Images.MARMELADE : Images.BLUE}
                    imageViewMode={'circle'}
                    imageEffect={'border'}
                    caption={'Мармеладки'}
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
                    imageSrc={showGoodImage ? Images.MARMELADE : Images.BLUE}
                    imageViewMode={'rectangle'}
                    imageProportion={'4:3'}
                    imageEffect={'light'}
                    captionPosition={'on-image'}
                    captionFontColorStyle={'contrast'}
                    caption={'Мармеладки'}
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
                    imageProportion={'4:3'}
                    imageEffect={'custom'}
                    imagePosition={'bottom'}
                    dominantColor={'60,60,60'}
                    brightness={'dark'}
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
            </div>
        </div>
    );
}

export default ImageEffectDemo;
