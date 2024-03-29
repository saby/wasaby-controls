import * as React from 'react';
import { HorizontalItem } from 'Controls-Templates/itemTemplates';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';
import 'css!DemoStand/Controls-demo';
import 'css!Controls/CommonClasses';
import 'css!Controls-Templates-demo/styles';

const COMMON_PROPS = {
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
    roundAngleBL: 's',
    roundAngleBR: 's',
    roundAngleTL: 's',
    roundAngleTR: 's',
};

export default class Index extends React.Component {
    render(): JSX.Element {
        return (
            <div className={'controlsDemo__wrapper controlsDemo__flexColumn'}>
                <h4>Меню</h4>
                <div className={'controlsDemo__wrapper controlsDemo__flexRow'}>
                    <HorizontalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                        }
                        imageSrc={Images.BURGER_300x190}
                        imageViewMode={'rectangle'}
                        imageSize={'4xl'}
                        caption={'Бургер из сочной говядины'}
                        description={
                            'А это плитка, помимо изображения, содержит дилнное описание, состав и пищевая ценность. Две булочки, салатик, котлетка из коровки и соус.'
                        }
                        footer={
                            <>
                                <div
                                    className={
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
                    <HorizontalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                        }
                        imageSrc={Images.BURGER_300x190}
                        imageViewMode={'rectangle'}
                        imagePosition={'left-fit'}
                        imageSize={'4xl'}
                        caption={'Бургер из сочной говядины'}
                        description={
                            'А это плитка, помимо изображения, содержит дилнное описание, состав и пищевая ценность. Две булочки, салатик, котлетка из коровки и соус.'
                        }
                        footer={
                            <>
                                <div
                                    className={
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
                    <HorizontalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                        }
                        imageSrc={Images.BURGER_300x190}
                        imageViewMode={'rectangle'}
                        imagePosition={'right-fit'}
                        imageSize={'4xl'}
                        caption={'Бургер из сочной говядины'}
                        description={
                            'А это плитка, помимо изображения, содержит дилнное описание, состав и пищевая ценность. Две булочки, салатик, котлетка из коровки и соус.'
                        }
                        footer={
                            <>
                                <div
                                    className={
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
                    <HorizontalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                        }
                        imageSrc={Images.BURGER_300x190}
                        imageViewMode={'rectangle'}
                        imagePosition={'right'}
                        imageSize={'4xl'}
                        caption={'Бургер из сочной говядины'}
                        description={
                            'А это плитка, помимо изображения, содержит дилнное описание, состав и пищевая ценность. Две булочки, салатик, котлетка из коровки и соус.'
                        }
                        footer={
                            <>
                                <div
                                    className={
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
                    <HorizontalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                        }
                        imageSrc={Images.BURGER_300x190}
                        imageViewMode={'circle'}
                        imagePosition={'right'}
                        imageSize={'4xl'}
                        caption={'Бургер из сочной говядины'}
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
                <div className={'controlsDemo__wrapper controlsDemo__flexRow'}>
                    <HorizontalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                        }
                        imageSrc={Images.BURGER_300x190}
                        imageViewMode={'rectangle'}
                        imageSize={'4xl'}
                        descriptionLines={1}
                        caption={'Бургер из сочной говядины'}
                        footer={
                            <div
                                className={
                                    'ws-flexbox ws-flex-grow-1 ws-flex-column'
                                }
                            >
                                <div
                                    className={
                                        'controls-text-label controls-margin_top-s ws-flex-grow-1'
                                    }
                                >
                                    <p>На 100г блюда:</p>
                                    <p>50г ..... белки</p>
                                    <p>25г ..... жиры</p>
                                </div>
                                <div
                                    className={
                                        'controls-demo_ItemTemplates__catalog_icon controls-icon_size-s icon-RoundPlus'
                                    }
                                ></div>
                            </div>
                        }
                    />
                    <HorizontalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                        }
                        imageSrc={Images.BURGER_300x190}
                        imageViewMode={'rectangle'}
                        imagePosition={'left-fit'}
                        imageSize={'4xl'}
                        description={'Описание'}
                        descriptionLines={1}
                        caption={'Бургер из сочной говядины'}
                        footer={
                            <div
                                className={
                                    'ws-flexbox ws-flex-grow-1 ws-flex-column'
                                }
                            >
                                <div
                                    className={
                                        'controls-text-label controls-margin_top-s ws-flex-grow-1'
                                    }
                                >
                                    <p>На 100г блюда:</p>
                                    <p>50г ..... белки</p>
                                    <p>25г ..... жиры</p>
                                </div>
                                <div
                                    className={
                                        'controls-demo_ItemTemplates__catalog_icon controls-icon_size-s icon-RoundPlus'
                                    }
                                ></div>
                            </div>
                        }
                    />
                    <HorizontalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                        }
                        imageSrc={Images.BURGER_300x190}
                        imageViewMode={'rectangle'}
                        imagePosition={'right-fit'}
                        imageSize={'4xl'}
                        caption={'Бургер из сочной говядины'}
                        footer={
                            <div
                                className={
                                    'ws-flexbox ws-flex-grow-1 ws-flex-column'
                                }
                            >
                                <div
                                    className={
                                        'controls-text-label controls-margin_top-s ws-flex-grow-1'
                                    }
                                >
                                    <p>На 100г блюда:</p>
                                    <p>50г ..... белки</p>
                                    <p>25г ..... жиры</p>
                                </div>
                                <div
                                    className={
                                        'controls-demo_ItemTemplates__catalog_icon controls-icon_size-s icon-RoundPlus'
                                    }
                                ></div>
                            </div>
                        }
                    />
                    <HorizontalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                        }
                        imageSrc={Images.BURGER_300x190}
                        imageViewMode={'rectangle'}
                        imagePosition={'right'}
                        imageSize={'4xl'}
                        caption={'Бургер из сочной говядины'}
                        footer={
                            <div
                                className={
                                    'Controls-Templates-demo__catalog_icon' +
                                    ' controls-icon_size-s icon-RoundPlus'
                                }
                            ></div>
                        }
                    />
                    <HorizontalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                        }
                        imageSrc={Images.BURGER_300x190}
                        imageViewMode={'circle'}
                        imagePosition={'right'}
                        imageSize={'4xl'}
                        caption={'Бургер из сочной говядины'}
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
                <h4>Курсы/Акции</h4>
                <div className={'controlsDemo__wrapper controlsDemo__flexRow'}>
                    <HorizontalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__course-item-size'
                        }
                        imageSrc={Images.BURGER_300x190}
                        imageClass={
                            'Controls-Templates-demo_course_image Controls-Templates-demo_course_image-shift'
                        }
                        imageViewMode={'circle'}
                        imagePosition={'right'}
                        imageSize={'4xl'}
                        caption={'Скидка на бургеры в день рождения!'}
                        description={'Скидка 5% на бургер из сочной говядины'}
                        footer={
                            <div
                                className={
                                    'controls-icon_style-contrast Controls-Templates-demo__course_icon' +
                                    ' Controls-Templates-demo__icon-round-primary controls-icon_size-s icon-Percent'
                                }
                            ></div>
                        }
                    />
                </div>
                <div className={'controlsDemo__wrapper controlsDemo__flexRow'}>
                    <HorizontalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__course-item-size'
                        }
                        imageSrc={Images.BURGER_300x190}
                        imageViewMode={'none'}
                        imagePosition={'right'}
                        imageSize={'4xl'}
                        caption={'Скидка на бургеры в день рождения!'}
                        description={'Скидка 5% на бургер из сочной говядины'}
                    />
                    <HorizontalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__course-item-size'
                        }
                        imageSrc={Images.BURGER_300x190}
                        imageViewMode={'none'}
                        imagePosition={'right'}
                        imageSize={'4xl'}
                        caption={'Скидка на бургеры в день рождения!'}
                    />
                </div>
            </div>
        );
    }
}
