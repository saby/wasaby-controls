/**
 * @kaizen_zone 588eec47-c30b-4013-974a-ed4ff7969134
 */
export const Spaces = {
    usual: ' ',
    longSpace: '\u2002',
};
/**
 * Возвращает пустые символы, которые будут отображены в fakeElement. Необходимо для того, чтобы ширина поля не изменялась по мере ввода 
 * @param value 
 * @private
 */
export function spaceToLongSpace(value: string): string {
    return value === Spaces.usual ? Spaces.longSpace : value;
}
