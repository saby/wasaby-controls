import rk = require('i18n!Controls');

// eslint-disable-next-line
export function LengthChecker(args) {
    if (!args.value) {
        return true;
    }
    // eslint-disable-next-line
    return args.value.length > 3 || rk('Введите больше 3 символов');
}

// eslint-disable-next-line
export function ChangedChecker(args) {
    return args.changed === 'Changed' || rk('Данные не изменились');
}
