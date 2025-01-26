/* eslint-disable */

declare class Big<T> {
    constructor(number: T);

    add(number: T): T;
    sub(number: T): T;
    div(number: T): T;
    mul(number: T): T;

    toExponential(decimalPlaces: number): T;
}
