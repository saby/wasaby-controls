import Dialog from './Dialog';
import { Component, createRef, RefObject } from 'react';
import { Context } from 'Controls/popup';
import { checkWasabyEvent } from 'UI/Events';

const CUSTOM_EVENTS = ['onClose'];

// Есть много мест, где прикладники завязались на on:close и стопают его, чтобы совершить свою логику
// Если в пропсы не придет коллбек onClose, работаем через контекст
class DialogReact extends Component {
    constructor(props) {
        super(props);
        this._onClose = this._onClose.bind(this);
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

    private _onClose(): void {
        if (this.props.onClose) {
            if (checkWasabyEvent(this.props.onClose)) {
                this.props.onClose();
            }
        } else {
            this.context?.close();
        }
    }

    // Проксируем публичный метод, т.к. на него завязались
    close(): void {
        this._dialogRef.current.close();
    }

    render(): JSX.Element {
        return (
            <Dialog
                {...this.props}
                ref={this._setRef.bind(this)}
                onClose={this._onClose}
                customEvents={CUSTOM_EVENTS}
            />
        );
    }

    static contextType = Context;
}

export default DialogReact;
