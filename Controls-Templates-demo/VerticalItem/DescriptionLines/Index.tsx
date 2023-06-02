import * as React from 'react';
import { VerticalItem } from 'Controls-Templates/itemTemplates';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';
import { COMMON_PROPS } from '../DataHelper';
import 'css!DemoStand/Controls-demo';
import 'css!Controls/CommonClasses';
import 'css!Controls-Templates-demo/styles';

export default class Index extends React.Component {
    render(): JSX.Element {
        return (
            <div ref={ this.props.forwardedRef } className={'controlsDemo__wrapper controlsDemo__flexColumn controlsDemo_widthFit'}>
                <h4>descriptionLines</h4>
                <div className={'controlsDemo__wrapper controlsDemo__flexRow'}>
                    <VerticalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                        }
                        imageSrc={Images.RIVER}
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
                    <VerticalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                        }
                        imageSrc={Images.RIVER}
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
                </div>
            </div>
        );
    };
};
