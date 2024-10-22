import * as React from 'react';
import { Paging } from 'Controls/paging';

const DEMO_CELL_CLASS =
    'tw-flex tw-flex-col tw-justify-center controls-padding_top-m controls-padding_bottom-m controls-padding_left-m controls-padding_right-m';
export default React.forwardRef((_, ref: React.LegacyRef<HTMLDivElement>): React.ReactElement => {
    const [selectedPage, setSelectedPage] = React.useState(1);
    const [selectedPageLong, setSelectedPageLong] = React.useState(1);
    return (
        <div
            className="tw-flex tw-flex-col tw-justify-center controls-padding_top-m controls-padding_bottom-m"
            ref={ref}
        >
            <div className="tw-flex controls-padding_top-m controls-padding_bottom-m controls-padding_left-m controls-padding_right-m ">
                <div className={DEMO_CELL_CLASS}>
                    <div className={'controls-text-label controls-padding_bottom-m'}>
                        Пейджинг с четырьмя кнопками прокрутки
                    </div>
                    <Paging
                        contrastBackground
                        arrowState={React.useMemo(
                            () => ({
                                begin: 'visible',
                                prev: 'visible',
                                next: 'visible',
                                end: 'visible',
                            }),
                            []
                        )}
                    />
                </div>
                <div className={DEMO_CELL_CLASS}>
                    <div className={'controls-text-label controls-padding_bottom-m'}>
                        Заблокированные кнопки прокрутки
                    </div>
                    <Paging
                        contrastBackground
                        arrowState={React.useMemo(
                            () => ({
                                begin: 'readonly',
                                prev: 'readonly',
                                next: 'visible',
                                end: 'visible',
                            }),
                            []
                        )}
                    />
                </div>
                <div className={DEMO_CELL_CLASS}>
                    <div className={'controls-text-label controls-padding_bottom-m'}>
                        Скрытые кнопки прокрутки
                    </div>
                    <Paging
                        contrastBackground
                        arrowState={React.useMemo(
                            () => ({
                                begin: 'hidden',
                                prev: 'visible',
                                next: 'visible',
                                end: 'hidden',
                            }),
                            []
                        )}
                    />
                </div>
            </div>

            <div className="tw-flex controls-padding_top-m controls-padding_bottom-m controls-padding_left-m controls-padding_right-m ">
                <div className={DEMO_CELL_CLASS}>
                    <div className={'controls-text-label controls-padding_bottom-m'}>
                        Пейджинг с цифрами и стрелками вперед/назад
                    </div>
                    <Paging
                        pagesCount={7}
                        showDigits
                        selectedPage={selectedPage}
                        onSelectedPageChanged={React.useCallback(
                            (page) => setSelectedPage(page),
                            []
                        )}
                        arrowState={React.useMemo(
                            () => ({
                                begin: 'hidden',
                                prev: 'visible',
                                next: 'visible',
                                end: 'hidden',
                            }),
                            []
                        )}
                    />
                </div>
                <div className={DEMO_CELL_CLASS}>
                    <div className={'controls-text-label controls-padding_bottom-m'}>
                        Пейджинг с цифрами без стрелок
                    </div>
                    <Paging
                        pagesCount={7}
                        showDigits
                        selectedPage={selectedPage}
                        onSelectedPageChanged={React.useCallback(
                            (page) => setSelectedPage(page),
                            []
                        )}
                        arrowState={React.useMemo(
                            () => ({
                                begin: 'hidden',
                                prev: 'hidden',
                                next: 'hidden',
                                end: 'hidden',
                            }),
                            []
                        )}
                    />
                </div>
            </div>

            <div className="tw-flex controls-padding_top-m controls-padding_bottom-m controls-padding_left-m controls-padding_right-m ">
                <div className={DEMO_CELL_CLASS}>
                    <div className={'controls-text-label controls-padding_bottom-m'}>
                        Пейджинг с цифрами и большим количеством страниц
                    </div>
                    <Paging
                        pagesCount={20}
                        showDigits
                        selectedPage={selectedPageLong}
                        onSelectedPageChanged={React.useCallback(
                            (page) => setSelectedPageLong(page),
                            []
                        )}
                        arrowState={React.useMemo(
                            () => ({
                                begin: 'hidden',
                                prev: 'visible',
                                next: 'visible',
                                end: 'hidden',
                            }),
                            []
                        )}
                    />
                </div>
            </div>
        </div>
    );
});
