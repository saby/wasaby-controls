class CssClasses {
    static include(
        superset: string | string[],
        subset: string | string[],
        message?: string
    ): void {
        const supersetArray = CssClasses.toStringArray(superset);
        const subsetArray = CssClasses.toStringArray(subset);
        try {
            expect(supersetArray).toEqual(expect.arrayContaining(subsetArray));
        } catch (error) {
            const missed = subsetArray.filter((e) => {
                return supersetArray.indexOf(e) === -1;
            });
            throw new Error(
                `${error.message}. ` +
                    (message ? `${message}. ` : '') +
                    `\nMissed classes: ${CssClasses.toString(missed)}.`
            );
        }
    }

    static notInclude(
        superset: string | string[],
        subset: string | string[],
        message?: string
    ): void {
        const supersetArray = CssClasses.toStringArray(superset);
        const subsetArray = CssClasses.toStringArray(subset);
        const contained = subsetArray.filter((e) => {
            return supersetArray.indexOf(e) !== -1;
        });

        if (contained.length) {
            throw new Error(
                `expected ${CssClasses.toString(
                    supersetArray
                )} to have not the same members as ${CssClasses.toString(
                    subsetArray
                )}. ` +
                    (message ? `${message}.` : '') +
                    `\nContained classes: ${CssClasses.toString(contained)}.`
            );
        }
    }

    static isSame(
        actual: string | string[],
        expected: string | string[],
        message?: string
    ): void {
        const actualArray = CssClasses.toStringArray(actual).sort();
        const expectedArray = CssClasses.toStringArray(expected).sort();
        try {
            expect(actualArray).toEqual(expectedArray);
        } catch (error) {
            const dA = CssClasses.toString(
                actualArray.filter((e) => {
                    return expectedArray.indexOf(e) === -1;
                })
            );
            const dB = CssClasses.toString(
                expectedArray.filter((e) => {
                    return actualArray.indexOf(e) === -1;
                })
            );
            throw new Error(
                `${error.message}. ` +
                    (message ? `${message}. ` : '') +
                    `\nDiff in sets: ${dA} <-> ${dB}.`
            );
        }
    }

    private static toString(array: unknown[]): string {
        return (
            '[ ' +
            array
                .map((e) => {
                    return `'${e}'`;
                })
                .join(', ') +
            ']'
        );
    }

    private static toStringArray(value: string | string[]): string[] {
        let array: string[];
        if (typeof value === 'string') {
            array = value.split(' ');
        } else if (value instanceof Array) {
            value.forEach((e) => {
                if (!(typeof e === 'string')) {
                    throw Error(
                        'Classes array must contains only string values.'
                    );
                }
            });
            array = value;
        } else {
            throw Error(
                'Argument must be must typeof string or Array of string.'
            );
        }
        return array.filter((e) => {
            return e.trim().length > 0;
        });
    }
}

export { CssClasses as CssClassesAssert };
