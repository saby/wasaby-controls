export const isRangeLessThanYear = (value): true | string => {
    const startValue = value[0];
    const endValue = value[1];
    const msInYear = 31622400000;
    const rangeInMs = endValue.getTime() - startValue.getTime();

    return rangeInMs < msInYear ? true : 'Период не может быть больше года';
};
