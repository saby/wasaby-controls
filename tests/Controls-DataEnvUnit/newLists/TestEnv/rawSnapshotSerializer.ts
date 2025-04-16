const RAW = Symbol('raw-serializer');

export interface Wrapper {
    [RAW]: string;
}

export function wrap(value: string): Wrapper {
    return { [RAW]: value };
}

function test(value: any): boolean {
    return value && typeof value[RAW] === 'string';
}

function print(value: unknown): string {
    const wrapper = value as Wrapper;
    return wrapper[RAW];
}

export default { test, print };
