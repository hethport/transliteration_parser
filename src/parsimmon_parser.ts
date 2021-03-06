import {
    Akadogramm,
    Determinativ,
    Hittite,
    LineNumber,
    PointedContent,
    StringTransliterationLineContent,
    Sumerogramm,
    SupplementContent,
    Supplemented,
    TransliterationLine,
    TransliterationLineContent,
    UnCertain
} from "./model";
import {
    alt,
    createLanguage,
    digits,
    optWhitespace,
    regexp,
    Result,
    seq,
    seqObj,
    string,
    TypedLanguage
} from "parsimmon";

const hittiteRegex = /[\p{Ll}\[\]()⸢⸣¬-]+/u;
const akadogrammRegex = /_(\p{Lu})+/u;
const sumerogrammRegex = /[.\p{Lu}]+/u;

type LanguageSpec = {
    // Helpers
    number: number,
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
    pointedContent: PointedContent,

    stringLineContent: StringTransliterationLineContent,

    // Other contents
    supplementContent: SupplementContent,
    supplemented: Supplemented,
    uncertain: UnCertain,

    singleContent: TransliterationLineContent;

    completeContent: TransliterationLineContent[];

    transliterationLine: TransliterationLine;
}

export const transliteration: TypedLanguage<LanguageSpec> = createLanguage<LanguageSpec>({
    // Helpers
    number: () => digits.map(parseInt),
    poundSign: () => string('#'),
    leftSquareBracket: () => string('['),
    rightSquareBracket: () => string(']'),
    questionMark: () => string('?'),

    // Line number
    lineNumberNotAbsolute: () => string('\''),
    lineNumber: r => seq(r.number, r.lineNumberNotAbsolute.times(0, 1))
        .map(([number, todo]) => {
            return {number, isAbsolute: todo.length === 0};
        }),

    // String content
    hittite: () => regexp(hittiteRegex)
        .map((result) => new Hittite(result)),

    akadogramm: () => regexp(akadogrammRegex)
        .map((result) => new Akadogramm(result.substring(1))),

    sumerogramm: () => regexp(sumerogrammRegex)
        .map((result) => new Sumerogramm(result)),

    determinativ: () => regexp(/°(\p{Lu}+)°/u, 1)
        .map((result) => new Determinativ(result)),

    pointedContent: () => regexp(/\.(\p{Lu}+)/u, 1)
        .map((result) => new PointedContent(result)),

    stringLineContent: r => alt(r.hittite, r.akadogramm, r.sumerogramm, r.determinativ, r.pointedContent),

    // Other contents
    uncertain: r => seq(r.stringLineContent, r.questionMark)
        .map(([content, _]) => new UnCertain(content)),

    supplementContent: r => alt(r.uncertain, r.stringLineContent),

    supplemented: r => r.supplementContent.wrap(r.leftSquareBracket, r.rightSquareBracket)
        .map((content) => new Supplemented(content)),


    singleContent: r => alt(r.supplemented, r.uncertain, r.stringLineContent),

    completeContent: r => r.singleContent.sepBy(optWhitespace),

    transliterationLine: r => seqObj(
        ["lineNumber", r.lineNumber],
        optWhitespace,
        r.poundSign,
        optWhitespace,
        ["content", r.completeContent]
    )

});

export function parseTransliterationLine(line: string): Result<TransliterationLine> {
    return transliteration.transliterationLine.parse(line);
}
