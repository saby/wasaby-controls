import * as React from 'react';
import { IBackgroundItemProps, BackgroundItem } from 'Controls-Templates/itemTemplates';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';
import 'css!DemoStand/Controls-demo';
import 'css!Controls/CommonClasses';
import 'css!Controls-Templates-demo/styles';

export default class Index extends React.Component {
    private readonly _commonItemsProps: Partial<IBackgroundItemProps> = {
        cursor: 'pointer',
    };

    render(): JSX.Element {
        return (
            <div
                ref={this.props.forwardedRef}
                className={'controlsDemo__wrapper controlsDemo__flexRow controlsDemo_widthFit'}
            >
                <div className={'controlsDemo__cell'}>
                    <h4>Меню</h4>
                    <div className={'controlsDemo__wrapper controlsDemo__flexRow'}>
                        <BackgroundItem
                            cursor={'pointer'}
                            className={
                                'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__rectangleImage_size'
                            }
                            imageProportion={'16:9'}
                            imageSrc={Images.RIVER}
                            overlayDirection={'to-bottom'}
                            caption={'Бургеры'}
                            captionVAlign={'top'}
                            captionHAlign={'left'}
                            captionFontSize={'4xl'}
                            captionFontWeight={'bold'}
                            captionFontColorStyle={'contrast'}
                            roundAngleBL={'s'}
                            roundAngleBR={'s'}
                            roundAngleTL={'s'}
                            roundAngleTR={'s'}
                            paddingTop={'m'}
                            paddingBottom={'m'}
                            paddingLeft={'m'}
                            paddingRight={'m'}
                        />
                        <BackgroundItem
                            cursor={'pointer'}
                            className={
                                'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__rectangleImage_size'
                            }
                            imageProportion={'16:9'}
                            imageSrc={Images.RIVER}
                            overlayDirection={'to-bottom'}
                            caption={'Супы'}
                            captionVAlign={'top'}
                            captionHAlign={'left'}
                            captionFontSize={'4xl'}
                            captionFontWeight={'bold'}
                            captionFontColorStyle={'contrast'}
                            roundAngleBL={'s'}
                            roundAngleBR={'s'}
                            roundAngleTL={'s'}
                            roundAngleTR={'s'}
                            paddingTop={'m'}
                            paddingBottom={'m'}
                            paddingLeft={'m'}
                            paddingRight={'m'}
                        />
                    </div>
                    <h4>Сертификаты/абонементы</h4>
                    <div
                        className={'Application-maison controlsDemo__wrapper controlsDemo__flexRow'}
                    >
                        <div className={'Controls-Templates-demo_certificate_group'}>
                            <BackgroundItem
                                cursor={'pointer'}
                                className={'Controls-Templates-demo_certificate first'}
                                imageSrc={Images.BLUE}
                                imageClass={'Controls-Templates-demo_certificate_image'}
                                overlayDirection={'to-top'}
                                caption={'Сертификат на 1000'}
                                captionClass={'Controls-Templates-demo_certificate_caption'}
                                captionVAlign={'bottom'}
                                captionHAlign={'left'}
                                captionFontSize={'4xl'}
                                captionFontColorStyle={'contrast'}
                                shadowVisibility={'visible'}
                                roundAngleBL={'m'}
                                roundAngleBR={'m'}
                                roundAngleTL={'m'}
                                roundAngleTR={'m'}
                                paddingTop={'s'}
                                paddingBottom={'s'}
                                paddingLeft={'m'}
                                paddingRight={'m'}
                                header={
                                    <div className="Controls-Templates-demo_certificate_price controls-fontsize-4xl controls-inlineheight-2xl">
                                        1000
                                    </div>
                                }
                            />
                            <BackgroundItem
                                cursor={'pointer'}
                                className={'Controls-Templates-demo_certificate second shifted'}
                                imageSrc={Images.RIVER}
                                imageClass={'Controls-Templates-demo_certificate_image'}
                                overlayDirection={'to-top'}
                                caption={'Сертификат на 2000'}
                                captionClass={'Controls-Templates-demo_certificate_caption'}
                                captionVAlign={'bottom'}
                                captionHAlign={'left'}
                                captionFontSize={'4xl'}
                                captionFontColorStyle={'contrast'}
                                shadowVisibility={'visible'}
                                roundAngleBL={'m'}
                                roundAngleBR={'m'}
                                roundAngleTL={'m'}
                                roundAngleTR={'m'}
                                paddingTop={'s'}
                                paddingBottom={'s'}
                                paddingLeft={'m'}
                                paddingRight={'m'}
                                header={
                                    <div className="Controls-Templates-demo_certificate_price controls-fontsize-4xl controls-inlineheight-2xl">
                                        2000
                                    </div>
                                }
                            />
                            <BackgroundItem
                                cursor={'pointer'}
                                className={'Controls-Templates-demo_certificate third shifted'}
                                imageSrc={Images.BLUE}
                                imageClass={'Controls-Templates-demo_certificate_image'}
                                overlayDirection={'to-top'}
                                caption={'Сертификат на 5000'}
                                captionClass={'Controls-Templates-demo_certificate_caption'}
                                captionVAlign={'bottom'}
                                captionHAlign={'left'}
                                captionFontSize={'4xl'}
                                captionFontColorStyle={'contrast'}
                                shadowVisibility={'visible'}
                                roundAngleBL={'m'}
                                roundAngleBR={'m'}
                                roundAngleTL={'m'}
                                roundAngleTR={'m'}
                                paddingTop={'s'}
                                paddingBottom={'s'}
                                paddingLeft={'m'}
                                paddingRight={'m'}
                                header={
                                    <div className="Controls-Templates-demo_certificate_price controls-fontsize-4xl controls-inlineheight-2xl">
                                        5000
                                    </div>
                                }
                            />
                        </div>
                        <BackgroundItem
                            cursor={'pointer'}
                            className={
                                'Controls-Templates-demo__itemsSpacing-left Controls-Templates-demo_certificate first'
                            }
                            imageSrc={Images.RIVER}
                            imageClass={'Controls-Templates-demo_certificate_image'}
                            overlayDirection={'to-top'}
                            caption={'Абонемент на 1000'}
                            captionVAlign={'bottom'}
                            captionHAlign={'left'}
                            captionFontSize={'4xl'}
                            captionFontColorStyle={'contrast'}
                            shadowVisibility={'visible'}
                            roundAngleBL={'m'}
                            roundAngleBR={'m'}
                            roundAngleTL={'m'}
                            roundAngleTR={'m'}
                            paddingTop={'s'}
                            paddingBottom={'s'}
                            paddingLeft={'m'}
                            paddingRight={'m'}
                            header={
                                <div className="Controls-Templates-demo_certificate_price controls-fontsize-4xl controls-inlineheight-2xl">
                                    1000
                                </div>
                            }
                        />
                    </div>
                    <h4>Интересные заведения</h4>
                    <div className={'controlsDemo__wrapper controlsDemo__flexRow'}>
                        <BackgroundItem
                            cursor={'pointer'}
                            className={
                                'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__placeImage_size'
                            }
                            imageSrc={Images.RIVER}
                            overlayDirection={'to-top'}
                            caption={
                                <div className={'ws-flexbox ws-flex-column ws-align-items-center'}>
                                    <div className="Controls-Templates-demo__place-logo"></div>
                                    Клюква. Ресторан для настоящих гурманов
                                </div>
                            }
                            captionVAlign={'bottom'}
                            captionHAlign={'middle'}
                            captionFontSize={'4xl'}
                            captionFontColorStyle={'contrast'}
                            description={'Максимова, 12'}
                            descriptionVAlign={'bottom'}
                            descriptionHAlign={'middle'}
                            descriptionFontSize={'m'}
                            descriptionFontColorStyle={'contrast'}
                            descriptionLines={1}
                            roundAngleBL={'s'}
                            roundAngleBR={'s'}
                            roundAngleTL={'s'}
                            roundAngleTR={'s'}
                            paddingTop={'s'}
                            paddingBottom={'s'}
                            paddingLeft={'s'}
                            paddingRight={'s'}
                            header={
                                <div>
                                    <div className="controls-icon_style-contrast Controls-Templates-demo__place_icon_row">
                                        <div
                                            className={
                                                'Controls-Templates-demo__icon-round-primary controls-icon_size-s icon-Percent'
                                            }
                                        ></div>
                                        <div
                                            className={
                                                'Controls-Templates-demo__icon-round-primary controls-icon_size-s icon-Calendar2'
                                            }
                                        ></div>
                                        <div
                                            className={
                                                'Controls-Templates-demo__icon-round-primary controls-icon_size-s icon-Truck'
                                            }
                                        ></div>
                                    </div>
                                </div>
                            }
                        />
                        <BackgroundItem
                            cursor={'pointer'}
                            className={
                                'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__placeImage_size'
                            }
                            imageSrc={null}
                            overlayDirection={'to-top'}
                            caption={
                                <div className={'ws-flexbox ws-flex-column ws-align-items-center'}>
                                    <img
                                        className="Controls-Templates-demo__place-logo"
                                        src={Images.RIVER}
                                    />
                                    Шаблон без картинки, но с фоном
                                </div>
                            }
                            captionVAlign={'bottom'}
                            captionHAlign={'middle'}
                            captionFontSize={'4xl'}
                            captionFontColorStyle={'contrast'}
                            description={'Максимова, 12'}
                            descriptionVAlign={'bottom'}
                            descriptionHAlign={'middle'}
                            descriptionFontSize={'m'}
                            descriptionFontColorStyle={'contrast'}
                            descriptionLines={1}
                            roundAngleBL={'s'}
                            roundAngleBR={'s'}
                            roundAngleTL={'s'}
                            roundAngleTR={'s'}
                            paddingTop={'s'}
                            paddingBottom={'s'}
                            paddingLeft={'s'}
                            paddingRight={'s'}
                            dominantColor={'#cc88dd'}
                            brightness={'light'}
                            header={
                                <div>
                                    <div className="controls-icon_style-contrast Controls-Templates-demo__place_icon_row">
                                        <div
                                            className={
                                                'Controls-Templates-demo__icon-round-primary controls-icon_size-s icon-Percent'
                                            }
                                        ></div>
                                        <div
                                            className={
                                                'Controls-Templates-demo__icon-round-primary controls-icon_size-s icon-Calendar2'
                                            }
                                        ></div>
                                        <div
                                            className={
                                                'Controls-Templates-demo__icon-round-primary controls-icon_size-s icon-Truck'
                                            }
                                        ></div>
                                    </div>
                                </div>
                            }
                        />
                    </div>
                </div>
                <div className={'controlsDemo__cell'}>
                    <h4>Новости</h4>
                    <div className={'controlsDemo__wrapper controlsDemo__flexRow'}>
                        <BackgroundItem
                            {...this._commonItemsProps}
                            className={
                                'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__newsImage_size'
                            }
                            imageSrc={Images.RIVER}
                            overlayDirection={'to-top-content'}
                            overlayStyle={'zen'}
                            dominantColor={'13,48,62'}
                            brightness={'dark'}
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
                        <BackgroundItem
                            {...this._commonItemsProps}
                            className={
                                'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__newsImage_size'
                            }
                            imageSrc={Images.RIVER}
                            roundAngleBL={'s'}
                            roundAngleBR={'s'}
                            roundAngleTL={'s'}
                            roundAngleTR={'s'}
                            paddingTop={'m'}
                            paddingBottom={'m'}
                            paddingLeft={'m'}
                            paddingRight={'m'}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
