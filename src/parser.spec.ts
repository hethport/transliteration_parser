import {parseTransliteration, TransliterationParser} from './parser';
import {Hittite, TransliterationLine} from "./model";

const x: string = `
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
`;

function hit(content: string): Hittite {
    return new Hittite(content);
}

describe('TransliterationParser', () => {
    it('should parse something', () => {
        const parsed = parseTransliteration("3' # az-zi-ik-ki-it-[tén");

        const awaited: TransliterationLine = {
            lineNumber: {number: 3, isAbsolute: false},
            content: [
                hit('az'), hit('zi'), hit('ik'), hit('ki'), hit('it')
            ]
        }

        expect(parsed).toEqual(awaited);
    });
});
