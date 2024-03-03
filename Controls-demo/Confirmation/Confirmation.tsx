import {forwardRef, Fragment, useState, MouseEvent} from 'react';
import {Confirmation} from 'Controls/popup';
import 'css!Controls-demo/Confirmation/Style';

export default forwardRef(function Demo(_, ref) {
    const [result, setResult] = useState<unknown>();
    const MESSAGE = 'Message';
    const DETAILS = 'Details';

    const getBackgroundColor = (status: 'default' | 'danger' | 'success'): string => {
        if (status === 'default') {
            return 'confirmation-block__bg-default'
        } else if (status === 'danger') {
            return 'confirmation-block__bg-error'
        } else {
            return 'confirmation-block__bg-success'
        }
    }

    const Buttons = [
        {
            caption: 'Type',
            items: [
                {
                    caption: 'OK',
                    test_name: 'ok',
                    cfg: {
                        message: MESSAGE,
                        details: 'Controls-demo/Confirmation/resources/detailsComponent',
                        markerStyle: 'default',
                        buttons: [
                            {
                                caption: 'ОК',
                                value: true,
                                buttonStyle: 'primary'
                            }
                        ]
                    }
                },
                {
                    caption: 'YESNO',
                    test_name: 'yesno',
                    cfg: {
                        message: MESSAGE,
                        details: DETAILS,
                        markerStyle: 'default',
                        buttons: [
                            {
                                caption: 'Да',
                                value: true,
                                buttonStyle: 'primary'
                            },
                            {
                                caption: 'Нет',
                                value: false,
                            }
                        ]
                    }
                },
                {
                    caption: 'YESNOCANCEL',
                    test_name: 'yesnocancel',
                    cfg: {
                        message: MESSAGE,
                        details: DETAILS,
                        markerStyle: 'default',
                        primaryAction: 'no',
                        buttons: [
                            {
                                caption: 'Да',
                                value: true
                            },
                            {
                                caption: 'Нет',
                                value: false,
                                buttonStyle: 'primary'
                            },
                            {
                                caption: 'Отмена',
                                value: undefined
                            }
                        ]
                    }
                }
            ]
        },
        {
            caption: 'Style',
            items: [
                {
                    caption: 'DEFAULT',
                    test_name: 'default',
                    cfg: {
                        message: MESSAGE,
                        details: DETAILS,
                        markerStyle: 'default'
                    }
                },
                {
                    caption: 'SUCCESS',
                    test_name: 'success',
                    cfg: {
                        message: MESSAGE,
                        details: DETAILS,
                        markerStyle: 'success'
                    }
                },
                {
                    caption: 'ERROR',
                    test_name: 'error',
                    cfg: {
                        message: MESSAGE,
                        details: DETAILS,
                        markerStyle: 'danger'
                    }
                }
            ]
        },
        {
            caption: 'Button caption',
            items: [
                {
                    caption: 'ONE BUTTON',
                    test_name: 'one_button',
                    cfg: {
                        message: MESSAGE,
                        details: DETAILS,
                        markerStyle: 'default',
                        buttons: [
                            {
                                caption: 'Custom ok',
                                value: true,
                                buttonStyle: 'primary'
                            }
                        ]
                    }
                },
                {
                    caption: 'THREE BUTTON',
                    test_name: 'three_button',
                    cfg: {
                        message: MESSAGE,
                        details: DETAILS,
                        markerStyle: 'default',
                        buttons: [
                            {
                                value: true,
                                caption: 'My yes',
                                buttonStyle: 'primary'
                            },
                            {
                                value: false,
                                caption: 'My no',
                            },
                            {
                                value: undefined,
                                caption: 'My cancel',
                            }
                        ]
                    }
                }
            ]
        },
        {
            caption: 'Size 350px',
            items: [
                {
                    caption: 'Heading < 100, Comment < 160',
                    cfg: {
                        message:
                            'Advertisers study how people learn so that they can ‘teach’ them to respond to their advertising',
                        details:
                            'If advertisements are to he learned, there is a need for lots of repetition.',
                        buttons: [
                            {
                                value: true,
                                caption: 'My yes',
                                buttonStyle: 'primary'
                            },
                            {
                                value: false,
                                caption: 'My no',
                            },
                            {
                                value: undefined,
                                caption: 'My cancel',
                            }
                        ],
                        markerStyle: 'default'
                    }
                },
                {
                    caption: 'Heading < 100, No Comment',
                    cfg: {
                        message:
                            'Advertisers study how people learn so that they can ‘teach’ them to respond to their advertising',
                        markerStyle: 'default',
                        buttons: [
                            {
                                caption: 'Да',
                                value: true,
                                buttonStyle: 'primary'
                            },
                            {
                                caption: 'Нет',
                                value: false,
                            }
                        ]
                    }
                }
            ]
        },
        {
            caption: 'Size 400px',
            items: [
                {
                    caption: 'Heading > 100, No Comment',
                    cfg: {
                        message:
                            'Advertisers study how people learn so that they can ‘teach’ them to respond to' +
                            ' their advertising. They want us to be interested, to try something, and then to do it again.',
                        markerStyle: 'default',
                        buttons: [
                            {
                                caption: 'ОК',
                                value: true,
                                buttonStyle: 'primary'
                            }
                        ]
                    }
                },
                {
                    caption: 'Heading < 100, Comment > 160',
                    cfg: {
                        message:
                            'Advertisers study how people learn so that they can ' +
                            '‘teach’ them to respond to their advertising',
                        markerStyle: 'default',
                        details:
                            ' For example, the highly successful ‘Weston Tea ' +
                            'Country’ advertising for different tea has led to' +
                            ' ‘DAEWOO Country’ for automobile dealers and ‘Cadbury Country’ for chocolate bars.',
                        buttons: [
                            {
                                caption: 'Да',
                                value: true,
                                buttonStyle: 'primary'
                            },
                            {
                                caption: 'Нет',
                                value: false,
                            }
                        ]
                    }
                }
            ]
        }
    ];

    const handleBlockClick = (e: MouseEvent<HTMLDivElement>, cfg: object) => {
        Confirmation.openPopup(cfg).then(res => {
            setResult(res)
        });
    };

    return (
        <div ref={ref} className="controls-margin-l controls-margin_left-3xl controls-margin_right-3xl">
            {
                Buttons.map((block) => (
                    <Fragment key={block.caption}>
                        <div
                            className="controls-fontsize-4xl controls-margin_left-s controls-margin_top-l">{block.caption}</div>
                        <div className="tw-flex">
                            {
                                block.items.map((item) => (
                                    <div key={item.caption}
                                         className={`controls-padding-s controls-margin-2xs tw-cursor-pointer ${getBackgroundColor(item.cfg.markerStyle)}`}
                                         onClick={(e) => handleBlockClick(e, item.cfg)}
                                         test_name={item.test_name}>
                                        {item.caption}
                                    </div>
                                ))
                            }
                        </div>
                    </Fragment>
                ))
            }
            <div test_name="result"
                 className="controls-fontsize-4xl controls-margin_left-s controls-margin_right-l">Result: {result !== undefined ? result.toString() : ''}</div>
        </div>
    );
});
