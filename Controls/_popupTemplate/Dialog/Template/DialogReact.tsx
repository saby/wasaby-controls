import DialogTemplate, { IDialogTemplateOptions } from './Dialog';
import { Component, createRef, RefObject } from 'react';
import { Context } from 'Controls/popup';
import { withWasabyEventObject } from 'UICore/Events';
import { SyntheticEvent } from 'Vdom/Vdom';
import { checkWasabyEvent } from 'UI/Events';
import { Logger } from 'UI/Utils';

const CUSTOM_EVENTS = ['onClose'];

// Есть много мест, где прикладники завязались на on:close и стопают его, чтобы совершить свою логику
// Если в пропсы не придет коллбек onClose, работаем через контекст

/**
 * Базовый шаблон {@link /doc/platform/developmentapl/interface-development/controls/openers/dialog/#template диалогового окна}.
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/openers/dialog/#template руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}
 *
 * @class Controls/_popupTemplate/Dialog
 *
 * @public
 * @implements Controls/interface:IBorderRadius
 * @implements Controls/popupTemplate:IPopupTemplate
 * @implements Controls/popupTemplate:IPopupTemplateBase
 * @implements Controls/popupTemplate:IResize
 * @implements Controls/popup:IAdaptivePopup
 * @demo Controls-demo/PopupTemplate/Dialog/Index
 */
class Dialog extends Component<IDialogTemplateOptions> {
    private _customEvents: string[];
    constructor(props: IDialogTemplateOptions) {
        super(props);
        this._onClose = this._onClose.bind(this);
        this._customEvents = CUSTOM_EVENTS;
        if (props.customEvents) {
            this._customEvents = this._customEvents.concat(props.customEvents);
        }
    }
    private _dialogRef: React.RefObject<HTMLDivElement> = createRef();

    // TODO: Удалить после https://online.sbis.ru/opendoc.html?guid=b20f1aa9-acc7-4219-b2c9-d5004939ca40&client=3
    protected _container: HTMLDivElement;

    // Костыль для compatible, там обращаются к шаблону окна через children
    _startDragNDrop(...args): void {
        this._dialogRef.current?._startDragNDrop(...args);
    }

    private _setRef(ref: RefObject<HTMLElement>): void {
        if (ref) {
            this._dialogRef.current = ref;
            this._container = ref._container;
        }
    }

    private _onClose(event: SyntheticEvent): void {
        if (this.props.onClose) {
            if (checkWasabyEvent(this.props.onClose)) {
                const result = this.props.onClose();
                if (result === false) {
                    event?.stopPropagation();
                }
            }
        } else {
            this.context?.close();
        }
    }

    // Проксируем публичный метод, т.к. на него завязались
    close(): void {
        Logger.error(
            'Controls/popupTempalte:Dialog: Используется устаревший метод close.' +
                'Для корректной работы компонента перейдите на контексты: ' +
                'https://online.sbis.ru/news/04ee3fac-ec84-4824-ab4b-95c27a01a321,' +
                'либо воспользуйтесь _notfy("close"), если вставляете шаблон в wasaby-компонент'
        );
        this._dialogRef.current.close();
    }

    render(): JSX.Element {
        return (
            <DialogTemplate
                {...this.props}
                ref={this._setRef.bind(this)}
                onClose={withWasabyEventObject(this._onClose)}
                customEvents={this._customEvents}
            />
        );
    }

    static contextType = Context;
}

export default Dialog;
