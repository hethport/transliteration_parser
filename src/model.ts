export interface LineNumber {
    number: number;
    isAbsolute: boolean;
}

export abstract class TransliterationLineContent {
    protected constructor(public type: string, public content: string) {
    }
}

export class Hittite extends TransliterationLineContent {
    constructor(content: string) {
        super('Hittite', content);
    }
}

export class Akadogramm extends TransliterationLineContent {
    constructor(content: string) {
        super('Akadogramm', content);
    }
}

export class Sumerogram extends TransliterationLineContent {
    constructor(content: string) {
        super('Sumerogramm', content);
    }
}

export interface TransliterationLine {
    lineNumber: LineNumber;
    content: TransliterationLineContent[];
}
