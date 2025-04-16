interface IIgnoreHotKeys {
    [key: number]: {
        altKey?: boolean;
        ctrlKey: boolean;
        shiftKey?: boolean;
    }
}

const IGNORE_HOTKEYS: IIgnoreHotKeys = {
    ['T'.charCodeAt(0)]: {
        altKey: true,
        ctrlKey: true,
    },
    ['C'.charCodeAt(0)]: {
        ctrlKey: true,
    },
    ['V'.charCodeAt(0)]: {
        ctrlKey: true,
    },
    ['Z'.charCodeAt(0)]: {
        ctrlKey: true,
    },
    ['A'.charCodeAt(0)]: {
        ctrlKey: true,
    },
    ['S'.charCodeAt(0)]: {
        ctrlKey: true,
    },
    ['D'.charCodeAt(0)]: {
        ctrlKey: true,
    },
    ['P'.charCodeAt(0)]: {
        ctrlKey: true,
    },
    ['R'.charCodeAt(0)]: {
        ctrlKey: true,
    },
};

interface IArgs {
    value: KeyboardEvent;
    doNotValidate?: boolean;
}

export default function validateHotKey(args: IArgs) {
    if (!args.value) {
        return true;
    }
    const ignore = IGNORE_HOTKEYS[args.value.keyCode];
    if (ignore) {
        if (
            args.value.altKey === (ignore.altKey || false) &&
            args.value.ctrlKey === ignore.ctrlKey &&
            args.value.shiftKey === (ignore.shiftKey || false)
        ) {
            return 'Это сочетание уже используется';
        }
    }
    return true;
}
