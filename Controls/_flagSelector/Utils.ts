import rk = require('i18n!Controls');

export interface IAreaCodeData {
    id: string;
    caption?: string;
    title?: string;
    code: string;
    additional?: string[];
}

const AREA_PHONE_CODES: IAreaCodeData[] = [
    {
        id: 'az-AZ',
        caption: rk('Азербайджан') + ' (+994)',
        title: 'Азербайджан (+994)',
        code: '994',
    },
    {
        id: 'hy-AM',
        caption: rk('Армения') + ' (+374)',
        title: 'Армения (+374)',
        code: '374',
    },
    {
        id: 'be-BY',
        caption: rk('Беларусь') + ' (+375)',
        title: 'Беларусь (+375)',
        code: '375',
    },
    {
        id: 'bg-BG',
        caption: rk('Болгария') + ' (+359)',
        title: 'Болгария (+359)',
        code: '359',
    },
    {
        id: 'en-GB',
        caption: rk('Великобритания') + ' (+44)',
        title: 'Великобритания (+44)',
        code: '44',
    },
    {
        id: 'hu-HU',
        caption: rk('Венгрия') + ' (+36)',
        title: 'Венгрия (+36)',
        code: '36',
    },
    {
        id: 'de-DE',
        caption: rk('Германия') + ' (+49)',
        title: 'Германия (+49)',
        code: '49',
    },
    {
        id: 'el-GR',
        caption: rk('Греция') + ' (+30)',
        title: 'Греция (+30)',
        code: '30',
    },
    {
        id: 'ka-GE',
        caption: rk('Грузия') + ' (+995)',
        title: 'Грузия (+995)',
        code: '995',
    },
    {
        id: 'da-DK',
        caption: rk('Дания') + ' (+45)',
        title: 'Дания (+45)',
        code: '45',
    },
    {
        id: 'ar-EG',
        caption: rk('Египет') + ' (+20)',
        title: 'Египет (+20)',
        code: '20',
    },
    {
        id: 'he-IL',
        caption: rk('Израиль') + ' (+972)',
        title: 'Израиль (+972)',
        code: '972',
    },
    {
        id: 'hi-IN',
        caption: rk('Индия') + ' (+91)',
        title: 'Индия (+91)',
        code: '91',
    },
    {
        id: 'ar-IQ',
        caption: rk('Ирак') + ' (+964)',
        title: 'Ирак (+964)',
        code: '964',
    },
    {
        id: 'fa-IR',
        caption: rk('Иран') + ' (+98)',
        title: 'Иран (+98)',
        code: '98',
    },
    {
        id: 'es-ES',
        caption: rk('Испания') + ' (+34)',
        title: 'Испания (+34)',
        code: '34',
    },
    {
        id: 'it-IT',
        caption: rk('Италия') + ' (+39)',
        title: 'Италия (+39)',
        code: '39',
    },
    {
        id: 'kk-KZ',
        caption: rk('Казахстан') + ' (+7)',
        title: 'Казахстан (+7)',
        code: '7',
        additional: ['6', '7'],
    },
    {
        id: 'el-CY',
        caption: rk('Кипр') + ' (+357)',
        title: 'Кипр (+357)',
        code: '357',
    },
    {
        id: 'zh-CN',
        caption: rk('Китай') + ' (+86)',
        title: 'Китай (+86)',
        code: '86',
    },
    {
        id: 'ar-AE',
        caption: rk('ОАЭ') + ' (+971)',
        title: 'Объединенные Арабские Эмираты (+971)',
        code: '971',
    },
    {
        id: 'pt-PT',
        caption: rk('Португалия') + ' (+351)',
        title: 'Португалия (+351)',
        code: '351',
    },
    {
        id: 'ru-RU',
        caption: rk('Россия') + ' (+7)',
        title: 'Россия (+7)',
        code: '7',
    },
    {
        id: 'ro-RO',
        caption: rk('Румыния') + ' (+40)',
        title: 'Румыния (+40)',
        code: '40',
    },
    {
        id: 'ko-KP',
        caption: rk('Северная Корея') + ' (+850)',
        title: 'Северная Корея (+850)',
        code: '850',
    },
    {
        id: 'sr-SP',
        caption: rk('Сербия') + ' (+381)',
        title: 'Сербия (+381)',
        code: '381',
    },
    {
        id: 'sk-SK',
        caption: rk('Словакия') + ' (+421)',
        title: 'Словакия (+421)',
        code: '421',
    },
    {
        id: 'sl-SI',
        caption: rk('Словения') + ' (+386)',
        title: 'Словения (+386)',
        code: '386',
    },
    {
        id: 'en-US',
        caption: rk('США') + ' (+1)',
        title: 'Соединенные Штаты Америки (+1)',
        code: '1',
    },
    {
        id: 'tg-TJ',
        caption: rk('Таджикистан') + ' (+992)',
        title: 'Таджикистан (+992)',
        code: '992',
    },
    {
        id: 'tk-TM',
        caption: rk('Туркмения') + ' (+993)',
        title: 'Туркмения (+993)',
        code: '993',
    },
    {
        id: 'tr-TR',
        caption: rk('Турция') + ' (+90)',
        title: 'Турция (+90)',
        code: '90',
    },
    {
        id: 'uz-UZ',
        caption: rk('Узбекистан') + ' (+998)',
        title: 'Узбекистан (+998)',
        code: '998',
    },
    {
        id: 'uk-UA',
        caption: rk('Украина') + ' (+380)',
        title: 'Украина (+380)',
        code: '380',
    },
    {
        id: 'fi-FI',
        caption: rk('Финляндия') + ' (+358)',
        title: 'Финляндия (+358)',
        code: '358',
    },
    {
        id: 'fr-FR',
        caption: rk('Франция') + ' (+33)',
        title: 'Франция (+33)',
        code: '33',
    },
    {
        id: 'cs-CZ',
        caption: rk('Чехия') + ' (+420)',
        title: 'Чехия (+420)',
        code: '420',
    },
    {
        id: 'sv-SE',
        caption: rk('Швеция') + ' (+46)',
        title: 'Швеция (+46)',
        code: '46',
    },
    {
        id: 'ko-KO',
        caption: rk('Южная Корея') + ' (+82)',
        title: 'Южная Корея (+82)',
        code: '82',
    },
    {
        id: 'ja-JP',
        caption: rk('Япония') + ' (+81)',
        title: 'Япония (+81)',
        code: '81',
    },
];

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
