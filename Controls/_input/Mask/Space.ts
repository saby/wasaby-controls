/**
 * @kaizen_zone 588eec47-c30b-4013-974a-ed4ff7969134
 */
export const Spaces = {
    usual: ' ',
    longSpace: '\u2002',
};

export function spaceToLongSpace(value: string): string {
    return value === Spaces.usual ? Spaces.longSpace : value;
}
