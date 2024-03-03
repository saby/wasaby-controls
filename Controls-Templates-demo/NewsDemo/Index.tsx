import * as React from 'react';
import { HorizontalItem, VerticalItem, BackgroundItem } from 'Controls-Templates/itemTemplates';
import Images from 'Controls-demo/tileNew/DataHelpers/Images';
import 'css!DemoStand/Controls-demo';
import 'css!Controls/CommonClasses';
import 'css!Controls-Templates-demo/styles';

const COMMON_PROPS = {
    cursor: 'pointer',
    captionVAlign: 'top',
    captionHAlign: 'left',
    descriptionVAlign: 'top',
    descriptionHAlign: 'left',
    descriptionFontSize: 'm',
    shadowVisibility: 'visible',
    roundAngleBL: 's',
    roundAngleBR: 's',
    roundAngleTL: 's',
    roundAngleTR: 's',
    paddingTop: 's',
    paddingBottom: 's',
    paddingLeft: 's',
    paddingRight: 's',
};

const NEWS_FOOTER = (
    <div
        className={
            'controls-margin_top-xs controlsDemo__width100 ws-flexbox ws-align-items-center ws-justify-content-end'
        }
    >
        <div className="controls-icon controls-icon_size-s controls-icon_style-unaccented icon-Show"></div>
        <span
            className={
                'controls-margin_right-s controls-margin_left-3xs controls-fontsize-s controls-text-unaccented'
            }
        >
            438
        </span>
        <div className="controls-icon controls-icon_size-s controls-icon_style-secondary icon-ThumbUp2"></div>
        <span
            className={
                'controls-fontsize-s controls-margin_left-3xs controls-fontsize-s controls-text-unaccented'
            }
        >
            19
        </span>
    </div>
);

export default class Index extends React.Component {
    render(): JSX.Element {
        return (
            <div
                className={
                    'controlsDemo__wrapper controlsDemo__flexColumn controlsDemo_fixedWidth800'
                }
            >
                <h4>Новости</h4>
                <div className={'controlsDemo__wrapper controlsDemo__flexRow '}>
                    <HorizontalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__news-width Controls-Templates-demo__news_green'
                        }
                        imageSrc={Images.BURGER_300x190}
                        imageViewMode={'circle'}
                        imagePosition={'right'}
                        imageSize={'3xl'}
                        backgroundColorStyle={'success'}
                        caption={
                            <div>
                                <span className={'controls-fontsize-3xl controls-fontweight-bold'}>
                                    Хорошее отношение к работе, старание и упорство
                                </span>
                                <span
                                    className={
                                        'controls-margin_left-s controls-fontsize-m controls-text-unaccented'
                                    }
                                >
                                    Благодарность
                                </span>
                            </div>
                        }
                        description={<div>*Фото сотрудников*</div>}
                        headerPosition={'static'}
                        header={
                            <div
                                className={
                                    'controlsDemo__width100 ws-flexbox ws-align-items-center ws-justify-content-between'
                                }
                            >
                                <span className={'controls-fontsize-xs controls-text-unaccented'}>
                                    Уваров С. Правление
                                </span>
                                <span className={'controls-fontsize-xs controls-text-unaccented'}>
                                    1 окт 07:19
                                </span>
                            </div>
                        }
                        footerPosition={'static'}
                        footer={NEWS_FOOTER}
                    />
                    <HorizontalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__news-width'
                        }
                        imageSrc={Images.BURGER_300x190}
                        imageViewMode={'rectangle'}
                        imagePosition={'right'}
                        imageSize={'3xl'}
                        captionFontWeight={'bold'}
                        captionFontSize={'3xl'}
                        caption={'Онлйан турнир по шахматам Фишера 6 ноября!'}
                        description={
                            'В честь недавно завершившегося чемпионата мира по фишеровским шахматам...'
                        }
                        headerPosition={'static'}
                        header={
                            <div
                                className={
                                    'controlsDemo__width100 ws-flexbox ws-align-items-center ws-justify-content-between'
                                }
                            >
                                <span className={'controls-fontsize-xs controls-text-unaccented'}>
                                    Шахматы Антонова С.
                                </span>
                                <span className={'controls-fontsize-xs controls-text-unaccented'}>
                                    сегодня 14:26
                                </span>
                            </div>
                        }
                        footerPosition={'static'}
                        footer={NEWS_FOOTER}
                    />
                    <VerticalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__news-width'
                        }
                        imageSrc={Images.BURGER_300x190}
                        imageViewMode={'none'}
                        captionFontWeight={'bold'}
                        captionFontSize={'3xl'}
                        caption={'Новость с коллажом'}
                        description={
                            <div>
                                <span>
                                    Текст новости с коллажом, размещенном в области описания
                                </span>
                                <div
                                    className={
                                        'Controls-Templates-demo__news_collage ws-flexbox ws-flex-wrap ws-align-items-stretch ws-justify-content-between'
                                    }
                                >
                                    <img
                                        className={'Controls-Templates-demo__news_collage-photo'}
                                        src={Images.BURGER_300x190}
                                    />
                                    <img
                                        className={'Controls-Templates-demo__news_collage-photo'}
                                        src={Images.BURGER_300x190}
                                    />
                                </div>
                            </div>
                        }
                        headerPosition={'static'}
                        header={
                            <div
                                className={
                                    'controlsDemo__width100 ws-flexbox ws-align-items-center ws-justify-content-between'
                                }
                            >
                                <span className={'controls-fontsize-xs controls-text-unaccented'}>
                                    Шахматы Антонова С.
                                </span>
                                <span className={'controls-fontsize-xs controls-text-unaccented'}>
                                    сегодня 14:26
                                </span>
                            </div>
                        }
                        footerPosition={'static'}
                        footer={NEWS_FOOTER}
                    />
                    <BackgroundItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__news-width'
                        }
                        imageSrc={Images.GIFT_CARD}
                        imageProportion={'16:9'}
                        headerPosition={'static'}
                        header={
                            <>
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: '30px',
                                        left: '10px',
                                    }}
                                    className={'controls-fontsize-3xl controls-fontweight-bold'}
                                >
                                    Поздравительная открытка
                                </span>
                                <img
                                    src={Images.BURGER_300x190}
                                    style={{
                                        position: 'absolute',
                                        height: '100px',
                                        width: '100px',
                                        borderRadius: '50%',
                                        top: '30px',
                                        right: '30px',
                                    }}
                                />
                                <span
                                    style={{
                                        position: 'absolute',
                                        bottom: '30px',
                                        right: '10px',
                                    }}
                                    className={
                                        'controls-fontsize-xl controls-text-primary controls-fontweight-bold'
                                    }
                                >
                                    Поздравительный текст с теплыми пожеланиями
                                </span>
                                <div
                                    className={
                                        'controlsDemo__width100 ws-flexbox ws-align-items-center ws-justify-content-between'
                                    }
                                >
                                    <span
                                        className={'controls-fontsize-xs controls-text-unaccented'}
                                    >
                                        Шахматы Антонова С.
                                    </span>
                                    <span
                                        className={'controls-fontsize-xs controls-text-unaccented'}
                                    >
                                        сегодня 14:26
                                    </span>
                                </div>
                            </>
                        }
                        footerPosition={'static'}
                        footer={NEWS_FOOTER}
                    />
                    <VerticalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__news-width'
                        }
                        imageSrc={Images.BURGER_300x190}
                        imageViewMode={'rectangle'}
                        imageProportion={'16:9'}
                        imageEffect={'custom'}
                        imagePosition={'top'}
                        captionFontWeight={'bold'}
                        captionFontSize={'3xl'}
                        dominantColor={'60,60,60'}
                        brightness={'dark'}
                        caption={'Новость с картинкой сверху'}
                        description={
                            'Новость с заголовком, описанием и картинкой в верхней части шаблона'
                        }
                        headerPosition={'absolute'}
                        header={
                            <div
                                className={
                                    'controlsDemo__width100 ws-flexbox ws-align-items-center ws-justify-content-between'
                                }
                            >
                                <span className={'controls-fontsize-xs controls-text-unaccented'}>
                                    Организация разработки
                                </span>
                                <span className={'controls-fontsize-xs controls-text-unaccented'}>
                                    сегодня 11:28
                                </span>
                            </div>
                        }
                        footerPosition={'static'}
                        footer={NEWS_FOOTER}
                    />
                    <HorizontalItem
                        {...COMMON_PROPS}
                        className={
                            'Controls-Templates-demo__itemsSpacing Controls-Templates-demo__news-width'
                        }
                        imageSrc={Images.BURGER_300x190}
                        imageViewMode={'rectangle'}
                        imageSize={'half'}
                        imagePosition={'right-fit'}
                        imageEffect={'custom'}
                        dominantColor={'60,60,60'}
                        brightness={'dark'}
                        captionFontWeight={'bold'}
                        captionFontSize={'3xl'}
                        caption={'Новость с картинкой на полшаблона справа'}
                        description={
                            'Картинка занимает половину ширины шаблона. Остальная часть отводится под текстовый контент (заголовок, описание).'
                        }
                        headerPosition={'content'}
                        header={
                            <div
                                className={
                                    'controlsDemo__width100 ws-flexbox ws-align-items-center ws-justify-content-between'
                                }
                            >
                                <span
                                    className={
                                        'controls-fontsize-xs controls-text-unaccented ws-ellipsis'
                                    }
                                >
                                    Длинное название группы, опубликовавшей эту новость
                                </span>
                                <span
                                    className={
                                        'Controls-Templates-demo__news-absolute-time controls-fontsize-xs controls-text-unaccented'
                                    }
                                >
                                    1 окт 07:19
                                </span>
                            </div>
                        }
                        footerPosition={'content'}
                        footer={NEWS_FOOTER}
                    />
                </div>
            </div>
        );
    }
}
