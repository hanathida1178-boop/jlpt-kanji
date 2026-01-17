// Romaji to Hiragana conversion utility
export const romajiToHiragana = (romaji: string): string => {
    const map: { [key: string]: string } = {
        // Vowels
        'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
        // K-row
        'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
        'kya': 'きゃ', 'kyu': 'きゅ', 'kyo': 'きょ',
        // G-row
        'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
        'gya': 'ぎゃ', 'gyu': 'ぎゅ', 'gyo': 'ぎょ',
        // S-row
        'sa': 'さ', 'shi': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
        'sha': 'しゃ', 'shu': 'しゅ', 'sho': 'しょ',
        // Z-row
        'za': 'ざ', 'ji': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
        'ja': 'じゃ', 'ju': 'じゅ', 'jo': 'じょ',
        // T-row
        'ta': 'た', 'chi': 'ち', 'tsu': 'つ', 'te': 'て', 'to': 'と',
        'cha': 'ちゃ', 'chu': 'ちゅ', 'cho': 'ちょ',
        // D-row
        'da': 'だ', 'di': 'ぢ', 'du': 'づ', 'de': 'で', 'do': 'ど',
        // N-row
        'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
        'nya': 'にゃ', 'nyu': 'にゅ', 'nyo': 'にょ',
        // H-row
        'ha': 'は', 'hi': 'ひ', 'fu': 'ふ', 'he': 'へ', 'ho': 'ほ',
        'hya': 'ひゃ', 'hyu': 'ひゅ', 'hyo': 'ひょ',
        // B-row
        'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
        'bya': 'びゃ', 'byu': 'びゅ', 'byo': 'びょ',
        // P-row
        'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ',
        'pya': 'ぴゃ', 'pyu': 'ぴゅ', 'pyo': 'ぴょ',
        // M-row
        'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
        'mya': 'みゃ', 'myu': 'みゅ', 'myo': 'みょ',
        // Y-row
        'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
        // R-row
        'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
        'rya': 'りゃ', 'ryu': 'りゅ', 'ryo': 'りょ',
        // W-row
        'wa': 'わ', 'wo': 'を', 'n': 'ん',
        // Special
        'nn': 'ん', 'n\'': 'ん'
    };

    let result = '';
    let i = 0;
    const input = romaji.toLowerCase();

    while (i < input.length) {
        // Try 3-character match first
        if (i + 3 <= input.length) {
            const three = input.substring(i, i + 3);
            if (map[three]) {
                result += map[three];
                i += 3;
                continue;
            }
        }

        // Try 2-character match
        if (i + 2 <= input.length) {
            const two = input.substring(i, i + 2);
            if (map[two]) {
                result += map[two];
                i += 2;
                continue;
            }
        }

        // Try 1-character match
        const one = input[i];
        if (map[one]) {
            result += map[one];
            i += 1;
            continue;
        }

        // If no match, keep the character as-is
        result += one;
        i += 1;
    }

    return result;
};
