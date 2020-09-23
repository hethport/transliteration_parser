export interface LineNumber {
    number: number;
    isAbsolute: boolean;
}

export abstract class TransliterationLineContent {}


export class SupplementContent extends TransliterationLineContent {}

export class UnCertain extends SupplementContent {
    constructor(public content: StringTransliterationLineContent) {
        super();
    }
}


export abstract class StringTransliterationLineContent extends SupplementContent {
    constructor(public content: string) {
        super();
    }
}

export class Hittite extends StringTransliterationLineContent {}

export class Akadogramm extends StringTransliterationLineContent {}

export class Sumerogramm extends StringTransliterationLineContent {}

export class Determinativ extends StringTransliterationLineContent {}

export class PointedContent extends StringTransliterationLineContent {}


export class Supplemented extends TransliterationLineContent {
    constructor(public content: SupplementContent) {
        super();
    }
}


export interface TransliterationLine {
    lineNumber: LineNumber;
    content: TransliterationLineContent[];
}
