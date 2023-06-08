/**
 * @kaizen_zone 4f556a12-3d12-4c5d-bfd8-53e193344358
 */
import { descriptor } from 'Types/entity';
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls/_spoiler/CutButton/CutButton';
import { SyntheticEvent } from 'UI/Vdom';
import 'css!Controls/spoiler';

type TIconSize = 's' | 'm' | 'l';
type TButtonPosition = 'start' | 'center';

export interface ICutButton {
    iconSize: TIconSize;
    contrastBackground: boolean;
    readOnly: boolean;
    expanded: boolean;
    buttonPosition: TButtonPosition;
}

class CutButton extends Control<ICutButton, IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _onValueHandler(event: SyntheticEvent, value: boolean): void {
        if (!this._options.readOnly) {
            this._notify('expandedChanged', [value]);
        }
    }

    protected _clickHandler(event: SyntheticEvent): void {
        event.stopPropagation();
    }

    static getOptionTypes(): object {
        return {
            readOnly: descriptor(Boolean),
            buttonsPosition: descriptor(String),
            contrastBackground: descriptor(Boolean),
            iconSize: descriptor(String),
            expanded: descriptor(Boolean),
        };
    }

    static getDefaultOptions(): object {
        return {
            iconSize: 'm',
            buttonPosition: 'center',
            readOnly: false,
            contrastBackground: true,
        };
    }
}

export default CutButton;
