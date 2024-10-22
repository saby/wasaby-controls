import { forwardRef } from 'react';
import { Label, Text } from 'Controls/input';
import { useDemoData } from '../resources/data';

export default forwardRef(function Align(_, ref) {
    const { address, addressHandler, mail, mailHandler, tel, telHandler } = useDemoData();
    return (
        <div
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
            ref={ref}
        >
            <div className="tw-flex">
                <div className="tw-flex tw-flex-col controls-margin_right-2xl">
                    <div className="controls-text-label controls-fontsize-xs controls-text-unaccented controls-margin_bottom-m">
                        Выравнивание метки по левому краю
                    </div>
                    <div className="tw-flex">
                        <div className="tw-flex tw-flex-col">
                            <div className="controlsDemo__cell">
                                <Label caption="Адрес" />
                            </div>
                            <div className="controlsDemo__cell">
                                <Label caption="Телефон" />
                            </div>
                            <div className="controlsDemo__cell">
                                <Label caption="Email" />
                            </div>
                        </div>
                        <div className="tw-flex tw-flex-col">
                            <div className="controlsDemo__cell tw-flex controlsDemo_fixedWidth200">
                                <Text value={address} onValueChanged={addressHandler} />
                            </div>
                            <div className="controlsDemo__cell tw-flex controlsDemo_fixedWidth200">
                                <Text value={tel} onValueChanged={telHandler} />
                            </div>
                            <div className="controlsDemo__cell tw-flex controlsDemo_fixedWidth200">
                                <Text value={mail} onValueChanged={mailHandler} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className=" tw-flex tw-flex-col controls-margin_left-2xl">
                    <div className="controls-text-label controls-fontsize-xs controls-text-unaccented controls-margin_bottom-m">
                        Выравнивание метки по правому краю
                    </div>
                    <div className="tw-flex">
                        <div className="tw-flex tw-flex-col">
                            <div className="controlsDemo__cell tw-self-end">
                                <Label caption="Адрес" />
                            </div>
                            <div className="controlsDemo__cell tw-self-end">
                                <Label caption="Телефон" />
                            </div>
                            <div className="controlsDemo__cell tw-self-end">
                                <Label caption="Email" />
                            </div>
                        </div>
                        <div className="tw-flex tw-flex-col">
                            <div className="controlsDemo__cell tw-flex controlsDemo_fixedWidth200">
                                <Text value={address} onValueChanged={addressHandler} />
                            </div>
                            <div className="controlsDemo__cell tw-flex controlsDemo_fixedWidth200">
                                <Text value={tel} onValueChanged={telHandler} />
                            </div>
                            <div className="controlsDemo__cell tw-flex controlsDemo_fixedWidth200">
                                <Text value={mail} onValueChanged={mailHandler} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
