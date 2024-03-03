/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
/* eslint-disable */
// TODO: Удалить файл после https://online.sbis.ru/opendoc.html?guid=2ba7e673-ca77-40aa-b642-364614eb7555&client=3
import { default as toString } from '../inputUtils/toString';
import { IFormatMaskChars } from '../interfaces/IMask';
import DICTIONARY from './Dictionary';
import * as rk from 'i18n!Controls';

export const REPLACER: string = '';

export const FORMAT_MASK_CHARS: IFormatMaskChars = {
    d: '[0-9]',
    '+': '[+]',
};

const LENGTH_AREA_CODE = 1;
const LENGTH_REGION_CODE = 3;
const NUMBER: RegExp = /\d/;
const CONTROL_CHARS: RegExp = /[+\d]/g;
const UNFORMED_MASK: string = '+\\?d\\*';

function detectCityCode(phone: string, regionCode: string): string {
    const codes = DICTIONARY.region[regionCode] || [];

    if (codes.length === 0) {
        return '';
    }
    for (let lengthCode = 1; lengthCode < 3; lengthCode++) {
        const code = phone.substr(LENGTH_AREA_CODE + LENGTH_REGION_CODE, lengthCode);
        if (codes.includes(code)) {
            return code;
        }
    }

    return '';
}

function detectLengthForeignCode(phone: string, areaCode: string): number {
    const codes: string[] = DICTIONARY.foreignCodes[areaCode];

    if (codes.length === 0) {
        return 1;
    }
    if (codes.includes(phone.substring(1, 2))) {
        return 2;
    }
    if (codes.indexOf(phone.substring(1, 3))) {
        return 3;
    }

    return 0;
}

function getExtensionMask(lengthPhone: number): string {
    if (lengthPhone <= 4) {
        return 'dddd';
    }
    if (lengthPhone === 5) {
        return 'd-dd-dd';
    }
    if (lengthPhone === 6) {
        return 'dd-dd-dd';
    }
    if (lengthPhone === 7) {
        return 'ddd-dd-dd';
    }
    if (lengthPhone <= 10) {
        return '(ddd)-ddd-dd-dd';
    }
    return UNFORMED_MASK;
}

export function getAreaCode(phone: string, self: object): string {
    const controlChars: RegExpMatchArray = toString(phone, self).match(CONTROL_CHARS);

    if (!controlChars) {
        return '';
    }

    const numPhone: string = controlChars
        .filter((value) => {
            return NUMBER.test(value);
        })
        .join('');
    const areaCode = numPhone.charAt(0);
    if (areaCode === '7') {
        return areaCode;
    }

    if (Boolean(DICTIONARY.foreignCodes[areaCode])) {
        const lengthForeignCode: number = detectLengthForeignCode(numPhone, areaCode);
        return phone.substring(0, lengthForeignCode ? lengthForeignCode : LENGTH_AREA_CODE);
    }
    return areaCode;
}

function mobilePhoneMask(phone: string, self?: object): string {
    const controlChars: RegExpMatchArray = toString(phone, self).match(CONTROL_CHARS);

    if (!controlChars) {
        return UNFORMED_MASK;
    }

    const numPhone: string = controlChars
        .filter((value) => {
            return NUMBER.test(value);
        })
        .join('');
    const areaCode: string = numPhone.charAt(0);

    // Определяем маску для российских мобильных номеров.
    if (areaCode === '7') {
        const regionCode = numPhone.substr(LENGTH_AREA_CODE, LENGTH_REGION_CODE);
        const cityCode = detectCityCode(numPhone, regionCode);

        switch (cityCode.length) {
            case 0:
                return '+\\?d (ddd) ddd-dd-dd';
                break;
            case 1:
                return '+\\?d (dddd) dd-dd-dd';
                break;
            case 2:
                return '+\\?d (ddddd) d-dd-dd';
                break;
        }
    }

    if (Boolean(DICTIONARY.foreignCodes[areaCode])) {
        const lengthForeignCode: number = detectLengthForeignCode(numPhone, areaCode);
        const code: string = lengthForeignCode
            ? 'd'.repeat(lengthForeignCode)
            : 'd'.repeat(LENGTH_AREA_CODE);
        return `+${code} (ddd) ddd dd dd`;
    }
    return UNFORMED_MASK;
}

export function phoneMask(phone: string | null, self?: object): string {
    if (self?._options?.onlyMobile) {
        return mobilePhoneMask(phone, self);
    }
    const controlChars: RegExpMatchArray = toString(phone, self).match(CONTROL_CHARS);

    if (!controlChars) {
        return UNFORMED_MASK;
    }

    const internationalFormat: boolean = controlChars[0] === '+';
    const numPhone: string = controlChars
        .filter((value) => {
            return NUMBER.test(value);
        })
        .join('');
    const areaCode: string = numPhone.charAt(0);
    let lengthPhone: number = numPhone.length;

    // Определяем маску для внутренних номеров.
    if (!internationalFormat && areaCode !== '8') {
        return getExtensionMask(lengthPhone);
    }

    lengthPhone -= areaCode.length;

    // Определяем маску для российских мобильных номеров.
    if ((!internationalFormat && areaCode === '8') || (internationalFormat && areaCode === '7')) {
        if (lengthPhone === 11) {
            return '+\\?d ddddddddddd';
        }

        const regionCode = numPhone.substr(LENGTH_AREA_CODE, LENGTH_REGION_CODE);
        const cityCode = detectCityCode(numPhone, regionCode);
        const hasTail: boolean = lengthPhone > 11;
        let body: string;

        switch (cityCode.length) {
            case 0:
                body = '+\\?d (ddd) ddd-dd-dd';
                break;
            case 1:
                body = '+\\?d (dddd) dd-dd-dd';
                break;
            case 2:
                body = '+\\?d (ddddd) d-dd-dd';
                break;
        }

        if (body) {
            return `${body}${hasTail ? ' ' + rk('доб.') + ' d\\*' : ''}`;
        }
    }

    if (internationalFormat && Boolean(DICTIONARY.foreignCodes[areaCode])) {
        const lengthForeignCode: number = detectLengthForeignCode(numPhone, areaCode);
        const code: string = lengthForeignCode
            ? 'd'.repeat(lengthForeignCode)
            : 'd'.repeat(LENGTH_AREA_CODE);
        if (lengthPhone - code.length < 10) {
            return `+${code} ddd ddd dd dd`;
        } else {
            return `+${code} d\\*`;
        }
    }

    return UNFORMED_MASK;
}
