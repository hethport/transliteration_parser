export interface LineNumber {
    number: number;
    isAbsolute: boolean;
}

export abstract class TransliterationLineContent {}


export abstract class StringTransliterationLineContent extends TransliterationLineContent {
    constructor(public content: string) {
        super();
    }
}

export class Hittite extends StringTransliterationLineContent {}

export class Akadogramm extends StringTransliterationLineContent {}

export class Sumerogramm extends StringTransliterationLineContent {}

export class Determinativ extends StringTransliterationLineContent {}


export class Supplemented extends TransliterationLineContent {
    constructor(public content: StringTransliterationLineContent) {
        super();
    }
}

export class UnCertain extends TransliterationLineContent {
    constructor(public content: StringTransliterationLineContent) {
        super();
    }
}

export interface TransliterationLine {
    lineNumber: LineNumber;
    content: TransliterationLineContent[];
}
