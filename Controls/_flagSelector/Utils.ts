import { AREA_PHONE_CODES, IAreaCodeData } from 'Controls/Utils/PhoneUtils';

const EMPTY_AREA_CODE: IAreaCodeData = {
    id: 'www',
    code: '',
};

/**
 * Возвращает информацию о стране, в зависимости от веденного номера телефона.
 * @param value номер телефона
 * @param oldAreaPhoneCode ранее вычисленное значение.
 */
function getAreaPhoneCode(
    value: string | undefined,
    oldAreaPhoneCode?: IAreaCodeData
): IAreaCodeData {
    if (value) {
        for (let i = 0; i < AREA_PHONE_CODES.length; i++) {
            const pos = value.indexOf(AREA_PHONE_CODES[i].code);
            if (pos === 0 || pos === 1) {
                if (oldAreaPhoneCode?.code === AREA_PHONE_CODES[i].code) {
                    return oldAreaPhoneCode;
                } else if (AREA_PHONE_CODES[i].additional) {
                    if (
                        (AREA_PHONE_CODES[i].additional as string[]).includes(value.charAt(pos + 1))
                    ) {
                        return AREA_PHONE_CODES[i];
                    }
                } else {
                    return AREA_PHONE_CODES[i];
                }
            }
        }
    }

    return EMPTY_AREA_CODE;
}

export { AREA_PHONE_CODES, EMPTY_AREA_CODE, getAreaPhoneCode };
