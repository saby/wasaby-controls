import * as React from 'react';
import { VerticalItem } from 'Controls-Templates/itemTemplates';
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
    captionVAlign: 'top',
    captionHAlign: 'left',
    captionFontSize: 'xl',
    captionFontWeight: 'bold',
    descriptionVAlign: 'top',
    descriptionHAlign: 'left',
    descriptionFontSize: 'm',
    descriptionFontColorStyle: 'unaccented',
    shadowVisibility: 'visible',
    paddingTop: 's',
    paddingBottom: 's',
    paddingLeft: 's',
    paddingRight: 's',
};

export default class Index extends React.Component {
    render(): JSX.Element {
        return (
            <div className={'controlsDemo__wrapper controlsDemo__flexColumn'}>
                <h4>imagePosition, imageProportion, imageViewMode</h4>
                <div className={'controlsDemo__wrapper controlsDemo__flexRow'}>
                    <VerticalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                        }
                        imageSrc={Images.BURGER_300x190}
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
                        imageSrc={Images.BURGER_300x190}
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
                        imageSrc={Images.BURGER_300x190}
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
                        imageSrc={Images.BURGER_300x190}
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
                        imageSrc={Images.BURGER_300x190}
                        imageViewMode={'none'}
                        caption={'Бургер из сочной говядины'}
                        description={
                            'А это плитка без изображения, так что бургера вы здесь не увидите. Зато, тут есть дилнное описание, состав и пищевая ценность. Две булочки, салатик, котлетка из коровки и соус.'
                        }
                        footer={
                            <>
                                <div
                                    class={
                                        'controls-text-label controls-margin_top-s'
                                    }
                                >
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
                <h4>captionPosition</h4>
                <div className={'controlsDemo__wrapper controlsDemo__flexRow'}>
                    <VerticalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                        }
                        imageSrc={Images.BURGER_300x190}
                        imageViewMode={'rectangle'}
                        imageProportion={'4:3'}
                        captionPosition={'auto'}
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
                        imageSrc={Images.BURGER_300x190}
                        imageViewMode={'circle'}
                        captionPosition={'top'}
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
                        imageSrc={Images.BURGER_300x190}
                        imageViewMode={'rectangle'}
                        imageProportion={'4:3'}
                        captionPosition={'on-image'}
                        captionFontColorStyle={'contrast'}
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
                <h4>imageEffect</h4>
                <div className={'controlsDemo__wrapper controlsDemo__flexRow'}>
                    <VerticalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                        }
                        imageSrc={Images.BURGER_300x190}
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
                        imageSrc={Images.BURGER_300x190}
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
                        imageSrc={Images.SWEETS_250x200}
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
                        imageSrc={Images.SWEETS_250x200}
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
                        imageSrc={Images.BURGER_300x190}
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
                <h4>descriptionLines</h4>
                <div className={'controlsDemo__wrapper controlsDemo__flexRow'}>
                    <VerticalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                        }
                        imageSrc={Images.BURGER_300x190}
                        imageViewMode={'rectangle'}
                        imageProportion={'4:3'}
                        caption={'Бургер из сочной говядины'}
                        descriptionLines={3}
                        description={
                            'А это плитка, помимо изображения, содержит дилнное описание, состав и пищевая ценность. Две булочки, салатик, котлетка из коровки и соус.'
                        }
                        footer={
                            <>
                                <div
                                    class={
                                        'controls-text-label controls-margin_top-s'
                                    }
                                >
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
                    <VerticalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                        }
                        imageSrc={Images.BURGER_300x190}
                        imageViewMode={'circle'}
                        captionPosition={'top'}
                        caption={'Бургер из сочной говядины'}
                        descriptionLines={0}
                        description={
                            'А это плитка, помимо изображения, содержит дилнное описание, состав и пищевая ценность. Две булочки, салатик, котлетка из коровки и соус.'
                        }
                        footer={
                            <>
                                <div
                                    class={
                                        'controls-text-label controls-margin_top-s'
                                    }
                                >
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
}
