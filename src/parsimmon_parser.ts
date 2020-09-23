import {
    Akadogramm,
    Determinativ,
    Hittite,
    LineNumber,
    StringTransliterationLineContent,
    Sumerogramm,
    Supplemented,
    TransliterationLine,
    TransliterationLineContent,
    UnCertain
} from "./model";
import {alt, createLanguage, digits, regexp, seq, string, TypedLanguage, whitespace} from "parsimmon";

type LanguageSpec = {
    // Helpers
    leftSquareBracket: string,
    rightSquareBracket: string,
    poundSign: string;
    questionMark: string,

    // Line number
    lineNumberNotAbsolute: string,
    lineNumber: LineNumber,

    // String contents
    hittite: Hittite;
    akadogramm: Akadogramm;
    sumerogramm: Sumerogramm;
    determinativ: Determinativ,

    stringLineContent: StringTransliterationLineContent,

    // Other contents
    supplemented: Supplemented,
    uncertain: UnCertain,

    content: TransliterationLineContent;

    transliterationLine: TransliterationLine;
}

export const translation: TypedLanguage<LanguageSpec> = createLanguage<LanguageSpec>({
    // Helpers
    poundSign: () => string('#').skip(whitespace),
    leftSquareBracket: () => string('['),
    rightSquareBracket: () => string(']'),
    questionMark: () => string('?'),

    // Line number
    lineNumberNotAbsolute: () => string('\''),
    lineNumber: r => seq(digits, r.lineNumberNotAbsolute.times(0, 1))
        .skip(whitespace)
        .map(([numberStr, todo]) => {
            return {number: parseInt(numberStr), isAbsolute: todo.length === 0};
        }),

    // String content
    hittite: () => regexp(/[\p{Ll}-]+/u)
        .map((result) => new Hittite(result)),

    akadogramm: () => regexp(/_(\p{Lu})+/u, 1)
        .map((result) => new Akadogramm(result)),

    sumerogramm: () => regexp(/\p{Lu}+/u)
        .map((result) => new Sumerogramm(result)),

    determinativ: () => regexp(/°(\p{Lu}+)°/u, 1)
        .map((result) => new Determinativ(result)),

    stringLineContent: r => alt(r.hittite, r.akadogramm, r.sumerogramm, r.determinativ),

    // Other contents
    uncertain: r => seq(r.stringLineContent, r.questionMark)
        .map(([content, _]) => new UnCertain(content)),

    supplemented: r => r.leftSquareBracket.then(r.stringLineContent).skip(r.rightSquareBracket)
        .map((content) => new Supplemented(content)),


    content: r => alt(r.stringLineContent, r.supplemented, r.uncertain),

    transliterationLine: r =>
        seq(r.lineNumber, r.poundSign, r.content.sepBy(whitespace))
            .map(([lineNumber, _, content]) => {
                const x: TransliterationLine = {lineNumber, content};
                return x;
            })

});
