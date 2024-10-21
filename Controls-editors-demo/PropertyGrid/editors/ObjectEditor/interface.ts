export interface IJob {
    jobName: string;
    salary: string;
}

export interface IPerson {
    name: string;
    surname: string;
    job: IJob;
}
