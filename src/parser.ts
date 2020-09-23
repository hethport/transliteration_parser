import {createToken, EmbeddedActionsParser, Lexer, TokenType} from 'chevrotain';
import {Akadogramm, Hittite, LineNumber, Sumerogram, TransliterationLine, TransliterationLineContent} from './model';

type RuleType<T> = (idxInCallingRule?: number, ...args: any[]) => T;

// Tokens

const whiteSpaceToken: TokenType = createToken({name: "WhiteSpace", pattern: /\s+/, group: Lexer.SKIPPED});

const numberToken: TokenType = createToken({name: 'NumberToken', pattern: /\d+/});

const lineNumberIsAbsoluteToken: TokenType = createToken({name: 'LineNumber', pattern: /'/});

const lineNumberAndTransliterationSeparator: TokenType = createToken({
    name: 'lineNumberAndTransliterationSeparator',
    pattern: /#/
});

const hittiteToken: TokenType = createToken({name: 'HittiteToken', pattern: /[a-z]+/});

const SumerogrammToken: TokenType = createToken({name: 'SumerogrammToken', pattern: /°[A-Z]+°/});

const AkadogrammToken: TokenType = createToken({name: 'AkadogrammToken', pattern: /[A-Z]+/});

const allTokens = [
    whiteSpaceToken, numberToken, lineNumberIsAbsoluteToken, lineNumberAndTransliterationSeparator, hittiteToken, SumerogrammToken, AkadogrammToken
]

const TransliterationLexer: Lexer = new Lexer(allTokens);

export class TransliterationParser extends EmbeddedActionsParser {
    constructor() {
        super(allTokens);
        this.performSelfAnalysis();
    }

    private hittite: RuleType<Hittite> = this.RULE("Hittite", () => {
        return new Hittite(this.CONSUME(hittiteToken).image);
    });

    private akadogramm: RuleType<Akadogramm> = this.RULE("Akadogram", () => {
        return new Akadogramm(this.CONSUME(AkadogrammToken).image);
    });

    private sumerogramm: RuleType<Sumerogram> = this.RULE("Sumerogram", () => {
        return new Sumerogram(this.CONSUME(SumerogrammToken).image);
    });

    private transliterationLineContent: RuleType<TransliterationLineContent> = this.RULE("transliterationLineContent", () => {
        return this.OR([
            {ALT: () => this.SUBRULE(this.hittite)},
            {ALT: () => this.SUBRULE(this.akadogramm)},
            {ALT: () => this.SUBRULE(this.sumerogramm)}
        ])
    });

    private lineNumber: RuleType<LineNumber> = this.RULE("lineNumber", () => {
        return {
            number: parseInt(this.CONSUME(numberToken).image, 10),
            isAbsolute: this.OPTION(() => this.CONSUME(lineNumberIsAbsoluteToken)) === undefined
        };
    });

    public transliterationLine: RuleType<TransliterationLine> = this.RULE("transliteraionLine", () => {
        const lineNumber: LineNumber = this.SUBRULE(this.lineNumber);

        this.OPTION(() => this.CONSUME(lineNumberAndTransliterationSeparator));

        const content: TransliterationLineContent[] = [];
        this.AT_LEAST_ONE({
            DEF: () => content.push(this.SUBRULE(this.transliterationLineContent))
        });

        return {lineNumber, content}
    });

}


export function parseTransliteration(transliterationInput: string) {
    const parser = new TransliterationParser();
    parser.input = TransliterationLexer.tokenize(transliterationInput).tokens;

    return parser.transliterationLine();
}
