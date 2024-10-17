export interface IHobby {
    value: number;
    caption: string;
}

export type Gender = 'Male' | 'Female';

export interface IPerson {
    name: string;
    gender: 'Male' | 'Female';
    hobbies: IHobby[];
}
