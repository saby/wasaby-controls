import {
    BackgroundItem,
    HorizontalItem,
    IImageItemProps,
    ImageItem,
    VerticalItem,
} from 'Controls-Templates/itemTemplates';
import 'css!DemoStand/Controls-demo';
import 'css!Controls/CommonClasses';
import 'css!Controls-Templates-demo/styles';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';

const COMMON_PROPS = {
    cursor: 'pointer',
    captionVAlign: 'top',
    captionHAlign: 'left',
    captionFontWeight: 'bold',
    descriptionVAlign: 'top',
    descriptionHAlign: 'left',
    descriptionFontSize: 'm',
    descriptionFontColorStyle: 'unaccented',
    shadowVisibility: 'visible',
    roundAngleBL: 's',
    roundAngleBR: 's',
    roundAngleTL: 's',
    roundAngleTR: 's',
};
const imageItemProps: Partial<IImageItemProps> = {
    className: 'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__squareImage_size',
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
function ImageRenderDemo() {
    return (
        <div className={'controlsDemo__wrapper controlsDemo__flexColumn controlsDemo_widthFit'}>
            <div
                className={'controlsDemo__wrapper controlsDemo__flexRow ws-align-items-start'}
                style={{ gap: 10 }}
            >
                <HorizontalItem
                    {...COMMON_PROPS}
                    className={
                        'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                    }
                    imageRender={
                        <img
                            src={Images.BURGER_300x190}
                            className={`
                                        Controls-Templates-HorizontalItem__image 
                                        Controls-Templates-TileItem__image 
                                        Controls-Templates-TileItem__image_centered 
                                        Controls-Templates-TileItem__image_object-fit_cover 
                                        Controls-Templates-BaseItem__borderRadius-tr_s 
                                        Controls-Templates-BaseItem__borderRadius-tl_s 
                                        Controls-Templates-BaseItem__borderRadius-br_s 
                                        Controls-Templates-BaseItem__borderRadius-bl_s
                                      `}
                        />
                    }
                    imageSrc={Images.BURGER_300x190}
                    imageViewMode={'rectangle'}
                    imageSize={'4xl'}
                    caption={'Бургер из сочной говядины'}
                    description={
                        'А эта плитка, помимо изображения, содержит длинное описание, состав и пищевая ценность. Две булочки, салатик, котлетка из коровки и соус.'
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
                <BackgroundItem
                    className={
                        'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__newsImage_size'
                    }
                    imageSrc={Images.RIVER}
                    imageViewMode={'circle'}
                    imageRender={
                        <div className="tw-flex tw-absolute">
                            <img
                                className="Controls-Templates-demo__imgSize"
                                src={Images.GOOD_MOUNTAINS}
                            />
                            <img
                                className="Controls-Templates-demo__imgSize"
                                src={Images.GOOD_RIVER}
                            />
                        </div>
                    }
                    overlayDirection={'to-top-content'}
                    dominantColor={'13,48,62'}
                    caption={'Правила посещения на карантин'}
                    captionVAlign={'bottom'}
                    captionHAlign={'left'}
                    captionFontSize={'3xl'}
                    captionFontWeight={'bold'}
                    description={
                        'Для посетителей нашего фитнес клуба вводятся новые правила на период карантина. Они направлены на усиление санитарных мер по предотвращению распространения короновирусной инфекции.'
                    }
                    descriptionLines={4}
                    descriptionVAlign={'bottom'}
                    descriptionHAlign={'left'}
                    descriptionFontSize={'L'}
                    roundAngleBL={'s'}
                    roundAngleBR={'s'}
                    roundAngleTL={'s'}
                    roundAngleTR={'s'}
                    paddingTop={'m'}
                    paddingBottom={'m'}
                    paddingLeft={'m'}
                    paddingRight={'m'}
                />
                <ImageItem
                    {...imageItemProps}
                    imageSrc={Images.RIVER}
                    imageRender={
                        <img
                            className={
                                ' Controls-Templates-ImageItem__image Controls-Templates-TileItem__image Controls-Templates-TileItem__image_centered Controls-Templates-TileItem__image_object-fit_cover'
                            }
                            src={Images.GOOD_MOUNTAINS}
                        />
                    }
                />
                <VerticalItem
                    {...COMMON_PROPS}
                    className={
                        'Controls-Templates-demo__itemsSpacing ' +
                        'Controls-Templates-demo__catalog-item-size'
                    }
                    imageRender={
                        <div className="tw-flex tw-absolute tw-top-0 tw-gap-0">
                            <div className="tw-flex tw-flex-col">
                                <img
                                    className="Controls-Templates-demo__imgSize"
                                    src={Images.GOOD_RIVER}
                                    alt="Good River"
                                />
                                <img
                                    className="Controls-Templates-demo__imgSize"
                                    src={Images.CHEETAH}
                                    alt="Cheetah"
                                />
                            </div>
                            <div className="tw-flex tw-flex-col">
                                <img
                                    className="Controls-Templates-demo__imgSize"
                                    src={Images.CAR}
                                    alt="Car"
                                />
                                <img
                                    className="Controls-Templates-demo__imgSize"
                                    src={Images.KLUKVA}
                                    alt="Klukva"
                                />
                            </div>
                        </div>
                    }
                    imageViewMode={'rectangle'}
                    caption={'Коллаж'}
                    descriptionLines={3}
                    description={
                        'Этот коллаж представляет собой сочетание различных изображений, которые вместе создают уникальную композицию. Он идеально подходит для визуального представления разнообразных тем и идей.'
                    }
                    footer={
                        <>
                            <div className={'controls-text-label controls-margin_top-s'}></div>
                            <div
                                className={
                                    'Controls-Templates-demo__catalog_icon ' +
                                    'controls-icon_size-s icon-RoundPlus'
                                }
                            ></div>
                        </>
                    }
                />
            </div>
        </div>
    );
}

export default ImageRenderDemo;
