export interface EventSchema {
    readonly name: string;
    exec(...args: any): any;
}
