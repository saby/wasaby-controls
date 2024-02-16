import Stack from './Stack';
import { Component, createRef, RefObject } from 'react';
import { Context } from 'Controls/popup';
import { checkWasabyEvent } from 'UI/Events';

const CUSTOM_EVENTS = ['onClose'];

// Есть много мест, где прикладники завязались на on:close и стопают его, чтобы совершить свою логику
// Если в пропсы не придет коллбек onClose, работаем через контекст
class StackReact extends Component {
    constructor(props) {
        super(props);
        this._onClose = this._onClose.bind(this);
    }
    private _stackRef: React.RefObject<Stack> = createRef();

    // Костыль для compatible, там обращаются к шаблону окна через children
    _startDragNDrop(...args): void {
        this._stackRef.current?._startDragNDrop(...args);
    }

    private _setRef(ref: RefObject<HTMLElement>): void {
        if (ref) {
            this._stackRef.current = ref;
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
        this._stackRef.current.close();
    }
    toggleMaximizeState(maximized?: boolean): void {
        this._stackRef.current.toggleMaximizeState(maximized);
    }

    render(): JSX.Element {
        return (
            <Stack
                {...this.props}
                ref={this._setRef.bind(this)}
                onClose={this._onClose}
                customEvents={CUSTOM_EVENTS}
            />
        );
    }

    static contextType = Context;
}

export default StackReact;
