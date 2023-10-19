/**
 * @kaizen_zone 4caa6c7f-c139-49cb-876d-d68aca67db9f
 */
export interface IRgbColor {
    r: number;
    g: number;
    b: number;
}

export interface IHSLColor {
    h: number;
    s: number;
    l: number;
}

export interface IColorDescriptor {
    name?: string;
    S?: number;
    L?: number;
    transparent?: boolean;
    isStrict?: boolean;
    callback?: (baseColor: IHSLColor, variableName: string) => IHSLColor;
}
