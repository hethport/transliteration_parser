import {Akadogramm, Determinativ, Hittite, Sumerogramm, Supplemented, TransliterationLine, UnCertain} from "./model";
import {transliteration} from './parsimmon_parser';

const x = `
$ Bo 2019/1 # KBo 71.91 • Datierung jh. • CTH 470 • Duplikate – • Fundort Büyükkale, westliche Befestigungsmauer, Schutt der Altgrabungen Planquadrat 338/348; 8,99-2,85; –-–; Niveau 1104,71 • Fund-Nr. 19-5000-5004 • Maße 62 x 45 x 22 mm
1' # [(x)] x ⸢zi⸣ x [
2' # [DUMU?].MUNUS?-ma e-ša-⸢a⸣-[ri
3' # az-zi-ik-ki-it-[tén
4' # nu ḫu-u-ma-an az-[zi-ik-ki- ¬¬¬
5' # [k]u-it-ma-an-aš-ma x [
6' # [n]a-aš-kán GIŠ.NÁ [
7' # [nu-u]š-ši ša-aš-t[a-
8' # [da?]-⸢a?⸣ nu-uš-ši x [
9' # [nu-u]š-ši im-ma(-)[
10' # [x-x]-TE°MEŠ° ⸢e⸣-[
11' # [x (x)]-ri-⸢ia⸣-[ ¬¬¬
12' # [x x] x [
`

function hit(content: string): Hittite {
    return new Hittite(content)
}

describe('test', () => {
    it('should parse hittite', () => {
        expect(transliteration.hittite.tryParse('het'))
            .toEqual(hit('het'));
        expect(transliteration.hittite.tryParse('tén'))
            .toEqual(hit('tén'));
    });

    it('should parse akadogramms', () => {
        expect(transliteration.akadogramm.tryParse('_ABC'))
            .toEqual(new Akadogramm('ABC'));
    });

    it('should parse sumerogramms', () => {
        expect(transliteration.sumerogramm.tryParse('ABC'))
            .toEqual(new Sumerogramm('ABC'));
    });

    it('should parse determinatives', () => {
        expect(transliteration.determinativ.tryParse('°ABC°'))
            .toEqual(new Determinativ('ABC'));
    });

    it('should parse lines', () => {
        const parser = transliteration.transliterationLine;

        expect(parser.tryParse("1' # [(x)] x ⸢zi⸣ x ["))
            .toEqual<TransliterationLine>({
                lineNumber: {number: 1, isAbsolute: false},
                content: [
                    hit('[(x)]'),
                    hit('x'),
                    hit('⸢zi⸣'),
                    hit('x'),
                    hit('[')
                ]
            });

        expect(parser.tryParse("2' # [DUMU?].MUNUS?-ma e-ša-⸢a⸣-[ri"))
            .toEqual<TransliterationLine>({
                lineNumber: {number: 2, isAbsolute: false},
                content: [
                    new Supplemented(new UnCertain(new Sumerogramm('DUMU'))),
                    new UnCertain(new Sumerogramm('.MUNUS')),
                    hit('-ma'), hit('e-ša-⸢a⸣-[ri')
                ]
            });

        expect(parser.tryParse("3' # az-zi-ik-ki-it-[tén"))
            .toEqual<TransliterationLine>({
                lineNumber: {number: 3, isAbsolute: false},
                content: [hit('az-zi-ik-ki-it-[tén')]
            });

        expect(parser.tryParse("4' # nu ḫu-u-ma-an az-[zi-ik-ki- ¬¬¬"))
            .toEqual<TransliterationLine>({
                lineNumber: {number: 4, isAbsolute: false},
                content: [
                    hit('nu'), hit('ḫu-u-ma-an'), hit('az-[zi-ik-ki-'), hit('¬¬¬')]
            });
    });
});
