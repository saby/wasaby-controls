/**
 * @kaizen_zone 10186a4a-7303-4e81-9d11-c395e91cec99
 */
import DICTIONARY from './Dictionary';

type TPhone = 'mobile' | 'landline';

const LENGTH_AREA_CODE = 1;
const LENGTH_REGION_CODE = 3;

const PLUS_SYMBOL = '+';

/**
 * Утилита для определения типа телефона.
 * @class Controls/_extendedDecorator/Phone/getPhoneNumberType
 * @public
 * @remark
 * В утилиту передается номер телефона. В зависимости от номера, она вернет либо 'mobile', либо 'landline'
 * @example
 * <pre>
 *     getPhoneNumberType('+79227562344') // 'mobile'
 *     getPhoneNumberType('+73013425355'); // 'landline'
 * </pre>
 * @demo Controls-demo/Input/Phone/GetPhoneNumberType/Index
 */

function isLandlinePhoneNumber(value: string): boolean {
    let phone = String(value);
    if (phone[0] === PLUS_SYMBOL) {
        phone = phone.substr(1);
    }
    const areaCode = phone[0];
    if (areaCode === '8' || areaCode === '7') {
        const regionCode = phone.substr(LENGTH_AREA_CODE, LENGTH_REGION_CODE);

        const codes = DICTIONARY.region[regionCode] || [];

        if (codes.length === 0) {
            return false;
        }
        // Если есть пустая строка, значит код города состоит из 3 чисел
        if (codes.includes('')) {
            return true;
        }
        for (let lengthCode = 1; lengthCode < 3; lengthCode++) {
            const code = phone.substr(LENGTH_AREA_CODE + LENGTH_REGION_CODE, lengthCode);
            if (codes.includes(code)) {
                return true;
            }
        }
    }
    return false;
}

const getPhoneNumberType = (value: string): TPhone => {
    if (isLandlinePhoneNumber(value)) {
        return 'landline';
    }
    return 'mobile';
};

export default getPhoneNumberType;
