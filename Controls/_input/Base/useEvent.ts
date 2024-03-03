export function useEvent(props) {
    return {
        onModelUpdate: props.onModelUpdate,
        onCut: props.onCut,
        onCopy: props.onCopy,
        onPaste: props.onPaste,
        onKeyUp: props.onKeyUp,
        onKeyDown: props.onKeyDown,
        onKeyPress: props.onKeyPress,
        onClick: props.onClick,
        onInput: props.onInput,
        onSelect: props.onSelect,
        onFocus: (event) => {
            props.onFocus?.(event);
            props.onFocusIn?.(event);
            props.onFocusin?.(event);
        },
        onBlur: (event) => {
            props.onBlur?.(event);
            props.onFocusOut?.(event);
            props.onFocusout?.(event);
        },
        onMouseDown: props.onMouseDown,
        onMouseMove: props.onMouseMove,
        onTouchStart: props.onTouchStart,
        onInputControl: props.onInputControl,
        onSelectionStartChanged: props.onSelectionStartChanged,
        onSelectionEndChanged: props.onSelectionEndChanged,
        onValueChanged: props.onValueChanged,
        onInputCompleted: props.onInputCompleted,
        onDOMAutoComplete: props.onDOMAutoComplete,
    };
}
