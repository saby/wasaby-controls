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
                <h4>imageEffect</h4>
                <div className={'controlsDemo__wrapper controlsDemo__flexRow'}>
                    <VerticalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__catalog-item-size'
                        }
                        imageSrc={Images.RIVER}
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
                        imageSrc={Images.RIVER}
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
                        imageSrc={Images.BLUE}
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
                        imageSrc={Images.BLUE}
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
                        imageSrc={Images.RIVER}
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
    };
};
