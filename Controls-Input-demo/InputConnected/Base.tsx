import { forwardRef } from 'react';
import { Mask, Money, Number, Text } from 'Controls-Input/inputConnected';
import { getBinding, getLoadConfig } from '../resources/_dataContextMock';
import { Input } from 'Controls-Input/dateRangeConnected';
import { Date as DateControl, Time } from 'Controls-Input/dateConnected';

const MULTILINE = {
    minLines: 2,
};

const Base = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__cell ws-flex-column controlsDemo_fixedWidth250">
                    <div className="controls-text-label controls-margin_top-m controls-margin_bottom-xs">
                        Поле ввода текста
                    </div>
                    <Text name={getBinding('String')} />
                    <div className="controls-text-label controls-margin_top-m controls-margin_bottom-xs">
                        Поле ввода числа
                    </div>
                    <Number name={getBinding('Number')} />
                </div>
                <div className="controlsDemo__cell ws-flex-column controlsDemo_fixedWidth250 controls-padding_left-m">
                    <div className="controls-text-label controls-margin_top-m controls-margin_bottom-xs">
                        Поле ввода числа
                    </div>
                    <Money name={getBinding('Money')} />
                    <div className="controls-text-label controls-margin_top-m controls-margin_bottom-xs">
                        Поле ввода с маской
                    </div>
                    <Mask name={getBinding('Mask')} mask="LL ddd" />
                </div>
            </div>
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__cell ws-flex-column controlsDemo_fixedWidth250">
                    <div className="controls-text-label controls-margin_top-m controls-margin_bottom-xs">
                        Поле ввода даты
                    </div>
                    <DateControl name={getBinding('Date')} mask="DD.MM.YYYY" />
                    <div className="controls-text-label controls-margin_top-m controls-margin_bottom-xs">
                        Поле ввода периода
                    </div>
                    <Input name={getBinding('DateRange')} mask="DD.MM.YYYY" />
                </div>

                <div className="controlsDemo__cell ws-flex-column controlsDemo_fixedWidth250">
                    <div className="controls-text-label controls-margin_top-m controls-margin_bottom-xs">
                        Поле ввода времени
                    </div>
                    <Time name={getBinding('Time')} label={null} mask="HH:mm" />
                    <div className="controls-text-label controls-margin_top-m controls-margin_bottom-xs">
                        Многострочное поле ввода
                    </div>
                    <Text name={getBinding('String')} multiline={MULTILINE} />
                </div>
            </div>
        </div>
    );
});

Base.getLoadConfig = getLoadConfig;

export default Base;
