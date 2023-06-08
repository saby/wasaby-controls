/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */
import * as React from 'react';
import MonthViewModel from './MonthViewModel';
import { date as formatDate } from 'Types/formatter';

interface IMonthViewProps {
    monthViewModel: MonthViewModel;
    theme: string;
    dayTemplate: React.Component;
    newMode: boolean;
    mode: string;
    value: object;

    dayClickHandler: React.MouseEventHandler;
    keyDownHandler: React.KeyboardEventHandler;
    mouseEnterHandler: React.MouseEventHandler;
    mouseLeaveHandler: React.MouseEventHandler;
}

class DayTemplate extends React.Component<IMonthViewProps> {
    constructor(props: IMonthViewProps) {
        super(props);
        this._handler = this._handler.bind(this);
    }

    protected _handler(e: React.BaseSyntheticEvent): void {
        switch (e.type) {
            case 'mouseenter':
                this.props.mouseEnterHandler(
                    e,
                    this.props.value.date,
                    this.props.value.isCurrentMonth
                );
                break;
            case 'mouseleave':
                this.props.mouseLeaveHandler(
                    e,
                    this.props.value.date,
                    this.props.value.isCurrentMonth
                );
                break;
            case 'click':
                this.props.dayClickHandler(
                    e,
                    this.props.value.date,
                    this.props.value.isCurrentMonth,
                    this.props.value.extData
                );
                break;
            case 'keydown':
                this.props.keyDownHandler(
                    e,
                    this.props.value.date,
                    this.props.value.isCurrentMonth
                );
                break;
        }
    }

    private _oldDayTemplate(): React.ReactElement {
        const preparedClass = this.props.monthViewModel._prepareClass(
            this.props.value,
            this.props.fontColorStyle,
            this.props.backgroundStyle,
            this.props.sizeStyle
        );

        return (
            <div
                data-qa={
                    this.props.value.selected
                        ? 'controls-MonthViewVDOM__item-selected'
                        : ''
                }
                data-date={this.props.value.id}
                className={`controls-MonthViewVDOM__item controls-MonthViewVDOM__item-old ${preparedClass}`}
                onClick={this._handler}
                onMouseEnter={this._handler}
                onMouseLeave={this._handler}
            >
                <this.props.dayTemplate
                    value={this.props.value}
                    newMode={this.props.newMode}
                    mode={this.props.mode}
                />
            </div>
        );
    }

    private _newDayTemplate(): React.ReactElement {
        return (
            <this.props.dayTemplate
                monthViewModel={this.props.monthViewModel}
                newMode={this.props.newMode}
                value={this.props.value}
                mode={this.props.mode}
                onClick={this._handler}
                onKeyDown={this._handler}
                onMouseEnter={this._handler}
                onMouseLeave={this._handler}
            />
        );
    }

    render(): React.ReactElement {
        if (this.props.newMode) {
            return this._newDayTemplate();
        } else {
            return this._oldDayTemplate();
        }
    }
}

export default function MonthViewTableBody(
    props: IMonthViewProps
): React.ReactElement[] {
    const monthArr = props.monthViewModel.getMonthArray() as Object[];

    return monthArr.map((week, index) => {
        return (
            <div
                key={formatDate(props.month, `YYYY-MM-week№${index}`)}
                className={
                    `controls-MonthViewVDOM__tableRow controls_calendar_theme-${props.theme}` +
                    (props.newMode !== true
                        ? ' controls-MonthViewVDOM__tableRow-old'
                        : '')
                }
            >
                {week.map((weekValue) => {
                    return (
                        <DayTemplate
                            {...props}
                            key={weekValue.id}
                            value={weekValue}
                        />
                    );
                })}
            </div>
        );
    });
}
