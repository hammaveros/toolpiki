import type { ComponentType } from 'react';

// 도구 컴포넌트 레지스트리
// 새 도구 추가 시 이 파일에 등록

// 텍스트 도구
import { CharacterCounter } from './text/CharacterCounter';
import { CaseConverter } from './text/CaseConverter';
import { LineBreakRemover } from './text/LineBreakRemover';
import { DuplicateLineRemover } from './text/DuplicateLineRemover';
import { TextSorter } from './text/TextSorter';
import { RandomStringGenerator } from './text/RandomStringGenerator';
import { KoreanEnglishConverter } from './text/KoreanEnglishConverter';
import { LoremIpsum } from './text/LoremIpsum';
import { TextDiff } from './text/TextDiff';
import { WordFrequency } from './text/WordFrequency';
import { MessageLengthChecker } from './text/MessageLengthChecker';
import { ReadingTimeCalculator } from './text/ReadingTimeCalculator';
import { CharacterCounterEn } from './text/CharacterCounterEn';
import { CaseConverterEn } from './text/CaseConverterEn';
import { LineBreakRemoverEn } from './text/LineBreakRemoverEn';
import { DuplicateLineRemoverEn } from './text/DuplicateLineRemoverEn';
import { TextSorterEn } from './text/TextSorterEn';
import { RandomStringGeneratorEn } from './text/RandomStringGeneratorEn';
import { LoremIpsumEn } from './text/LoremIpsumEn';
import { TextDiffEn } from './text/TextDiffEn';
import { WordFrequencyEn } from './text/WordFrequencyEn';
import { MessageLengthCheckerEn } from './text/MessageLengthCheckerEn';
import { ReadingTimeCalculatorEn } from './text/ReadingTimeCalculatorEn';
import { RegexGenerator } from './text/RegexGenerator';
import { RegexGeneratorEn } from './text/RegexGeneratorEn';
import { LineNumber } from './text/LineNumber';
import { LineNumberEn } from './text/LineNumberEn';

// 인코딩/디코딩
import { Base64Tool } from './encoding/Base64Tool';
import { UrlEncoder } from './encoding/UrlEncoder';
import { HashGenerator } from './encoding/HashGenerator';
import { HtmlEntity } from './encoding/HtmlEntity';
import { UnicodeConverter } from './encoding/UnicodeConverter';
import { MorseCode } from './encoding/MorseCode';
import { JwtDecoder } from './encoding/JwtDecoder';
import { Base64ToolEn } from './encoding/Base64ToolEn';
import { UrlEncoderEn } from './encoding/UrlEncoderEn';
import { HashGeneratorEn } from './encoding/HashGeneratorEn';
import { HtmlEntityEn } from './encoding/HtmlEntityEn';
import { UnicodeConverterEn } from './encoding/UnicodeConverterEn';
import { MorseCodeEn } from './encoding/MorseCodeEn';
import { JwtDecoderEn } from './encoding/JwtDecoderEn';
import { StringEscape } from './encoding/StringEscape';
import { StringEscapeEn } from './encoding/StringEscapeEn';

// 포맷터
import { JsonFormatter } from './formatter/JsonFormatter';
import { JsonCsvConverter } from './formatter/JsonCsvConverter';
import { XmlFormatter } from './formatter/XmlFormatter';
import { SqlFormatter } from './formatter/SqlFormatter';
import { Minifier } from './formatter/Minifier';
import { MarkdownPreview } from './formatter/MarkdownPreview';
import { YamlJsonConverter } from './formatter/YamlJsonConverter';
import { UrlQueryParser } from './formatter/UrlQueryParser';
import { JsonFormatterEn } from './formatter/JsonFormatterEn';
import { JsonCsvConverterEn } from './formatter/JsonCsvConverterEn';
import { XmlFormatterEn } from './formatter/XmlFormatterEn';
import { SqlFormatterEn } from './formatter/SqlFormatterEn';
import { MinifierEn } from './formatter/MinifierEn';
import { MarkdownPreviewEn } from './formatter/MarkdownPreviewEn';
import { YamlJsonConverterEn } from './formatter/YamlJsonConverterEn';
import { UrlQueryParserEn } from './formatter/UrlQueryParserEn';
import { HtmlPreview } from './formatter/HtmlPreview';
import { HtmlPreviewEn } from './formatter/HtmlPreviewEn';
import { CodeDiff } from './formatter/CodeDiff';
import { CodeDiffEn } from './formatter/CodeDiffEn';
import { CronParser } from './formatter/CronParser';
import { CronParserEn } from './formatter/CronParserEn';
import { HttpStatusCode } from './formatter/HttpStatusCode';
import { HttpStatusCodeEn } from './formatter/HttpStatusCodeEn';
import { JsonPathTester } from './formatter/JsonPathTester';
import { JsonPathTesterEn } from './formatter/JsonPathTesterEn';
import { HtmlBoilerplate } from './formatter/HtmlBoilerplate';
import { HtmlBoilerplateEn } from './formatter/HtmlBoilerplateEn';
import { FlexboxPlayground } from './formatter/FlexboxPlayground';
import { FlexboxPlaygroundEn } from './formatter/FlexboxPlaygroundEn';
import { OgPreview } from './formatter/OgPreview';
import { OgPreviewEn } from './formatter/OgPreviewEn';
import { MermaidDiagram } from './formatter/MermaidDiagram';
import { MermaidDiagramEn } from './formatter/MermaidDiagramEn';

// 이미지 도구
import { ImageResize } from './image/ImageResize';
import { ImageCompress } from './image/ImageCompress';
import { ImageConvert } from './image/ImageConvert';
import { ImageCrop } from './image/ImageCrop';
import { ImageRotate } from './image/ImageRotate';
import { Base64Image } from './image/Base64Image';
import { FaviconGenerator } from './image/FaviconGenerator';
import { VideoGifConverter } from './image/VideoGifConverter';
import { ImageResizeEn } from './image/ImageResizeEn';
import { ImageCompressEn } from './image/ImageCompressEn';
import { ImageConvertEn } from './image/ImageConvertEn';
import { ImageCropEn } from './image/ImageCropEn';
import { ImageRotateEn } from './image/ImageRotateEn';
import { Base64ImageEn } from './image/Base64ImageEn';
import { FaviconGeneratorEn } from './image/FaviconGeneratorEn';
import { VideoGifConverterEn } from './image/VideoGifConverterEn';

// 색상 도구
import { ColorConverter } from './color/ColorConverter';
import { PaletteGenerator } from './color/PaletteGenerator';
import { GradientGenerator } from './color/GradientGenerator';
import { ContrastChecker } from './color/ContrastChecker';
import { ImageColorPicker } from './color/ImageColorPicker';
import { ColorBlender } from './color/ColorBlender';
import { ColorBlindSimulator } from './color/ColorBlindSimulator';
import { ColorConverterEn } from './color/ColorConverterEn';
import { PaletteGeneratorEn } from './color/PaletteGeneratorEn';
import { GradientGeneratorEn } from './color/GradientGeneratorEn';
import { ContrastCheckerEn } from './color/ContrastCheckerEn';
import { ImageColorPickerEn } from './color/ImageColorPickerEn';
import { ColorBlenderEn } from './color/ColorBlenderEn';
import { ColorBlindSimulatorEn } from './color/ColorBlindSimulatorEn';
import { BoxShadowGenerator } from './color/BoxShadowGenerator';
import { BoxShadowGeneratorEn } from './color/BoxShadowGeneratorEn';
import { BorderRadiusGenerator } from './color/BorderRadiusGenerator';
import { BorderRadiusGeneratorEn } from './color/BorderRadiusGeneratorEn';

// 계산기/생성기
import { UuidGenerator } from './calculator/UuidGenerator';
import { QrGenerator } from './calculator/QrGenerator';
import { DateCalculator } from './calculator/DateCalculator';
import { PercentageCalculator } from './calculator/PercentageCalculator';
import { BaseConverter } from './calculator/BaseConverter';
import { UnixTimestamp } from './calculator/UnixTimestamp';
import { UnitConverter } from './calculator/UnitConverter';
import { RegexTester } from './calculator/RegexTester';
import { Timer } from './calculator/Timer';
import { ServerTime } from './calculator/ServerTime';
import { ServerTimeEn } from './calculator/ServerTimeEn';
import { RatioCalculator } from './calculator/RatioCalculator';
import { AgeCalculator } from './calculator/AgeCalculator';
import { BmiCalculator } from './calculator/BmiCalculator';
import { RandomPicker } from './calculator/RandomPicker';
import { MeetingCostCalculator } from './calculator/MeetingCostCalculator';
import { MeetingCostCalculatorEn } from './calculator/MeetingCostCalculatorEn';
import { CssUnitConverter } from './calculator/CssUnitConverter';
import { SalaryCalculator } from './calculator/SalaryCalculator';
import { LoanCalculator } from './calculator/LoanCalculator';
import { LoanCalculatorEn } from './calculator/LoanCalculatorEn';
import { InterestCalculator } from './calculator/InterestCalculator';
import { InterestCalculatorEn } from './calculator/InterestCalculatorEn';
import { BmiCalculatorEn } from './calculator/BmiCalculatorEn';
import { RatioCalculatorEn } from './calculator/RatioCalculatorEn';
import { TimerEn } from './calculator/TimerEn';
import { UnitConverterEn } from './calculator/UnitConverterEn';
import { UnixTimestampEn } from './calculator/UnixTimestampEn';
import { DateCalculatorEn } from './calculator/DateCalculatorEn';
import { PercentageCalculatorEn } from './calculator/PercentageCalculatorEn';
import { RandomPickerEn } from './calculator/RandomPickerEn';
import { BaseConverterEn } from './calculator/BaseConverterEn';
import { RegexTesterEn } from './calculator/RegexTesterEn';
import { QrGeneratorEn } from './calculator/QrGeneratorEn';
import { UuidGeneratorEn } from './calculator/UuidGeneratorEn';
import { CssUnitConverterEn } from './calculator/CssUnitConverterEn';
import { IpLookup } from './calculator/IpLookup';
import { IpLookupEn } from './calculator/IpLookupEn';
import { FileSizeCalculator } from './calculator/FileSizeCalculator';
import { FileSizeCalculatorEn } from './calculator/FileSizeCalculatorEn';
import { SpeedTest } from './calculator/SpeedTest';
import { SpeedTestEn } from './calculator/SpeedTestEn';
import { FakeDataGenerator } from './calculator/FakeDataGenerator';
import { FakeDataGeneratorEn } from './calculator/FakeDataGeneratorEn';

// 재미/테스트
import { ReactionTimeTest } from './fun/ReactionTimeTest';
import { LottoGenerator } from './fun/LottoGenerator';
import { NicknameGenerator } from './fun/NicknameGenerator';
import { ColorPerceptionTest } from './fun/ColorPerceptionTest';
import { ColorPerceptionTestEn } from './fun/ColorPerceptionTestEn';
import { RouletteSelector } from './fun/RouletteSelector';
import { RouletteSelectorEn } from './fun/RouletteSelectorEn';
import { LadderGame } from './fun/LadderGame';
import { LadderGameEn } from './fun/LadderGameEn';
import { TimingTest } from './fun/TimingTest';
import { TimingTestEn } from './fun/TimingTestEn';
import { RandomDecisionMaker } from './fun/RandomDecisionMaker';
import { RandomDecisionMakerEn } from './fun/RandomDecisionMakerEn';
import { FortuneCookie } from './fun/FortuneCookie';
import { OrderPicker } from './fun/OrderPicker';
import { OrderPickerEn } from './fun/OrderPickerEn';
import { ReactionTimeTestEn } from './fun/ReactionTimeTestEn';
import { UsLottoGenerator } from './fun/UsLottoGenerator';
import { NameCompatibility } from './fun/NameCompatibility';
import { BirthdayCompatibility } from './fun/BirthdayCompatibility';
import { DailyTarot } from './fun/DailyTarot';
import { LoveCalculator } from './fun/LoveCalculator';
import { ShipNameGenerator } from './fun/ShipNameGenerator';
import { DailyHoroscope } from './fun/DailyHoroscope';
import { PersonalityColorQuiz } from './fun/PersonalityColorQuiz';
import { ShellGame } from './fun/ShellGame';
import { ShellGameEn } from './fun/ShellGameEn';
import { LetterQr } from './fun/LetterQr';
import { LetterQrEn } from './fun/LetterQrEn';
import { SajuReading } from './fun/SajuReading';
import { SajuCompatibility } from './fun/SajuCompatibility';
import { TeamPicker } from './fun/TeamPicker';
import { TeamPickerEn } from './fun/TeamPickerEn';
import { TypingGame } from './fun/TypingGame';
import { TypingPractice } from './fun/TypingPractice';
import { TypingGameEn } from './fun/TypingGameEn';
import { TypingPracticeEn } from './fun/TypingPracticeEn';
import { NumberGuess } from './fun/NumberGuess';
import { NumberGuessEn } from './fun/NumberGuessEn';
import { TipCalculator } from './calculator/TipCalculator';
import { GpaCalculator } from './calculator/GpaCalculator';
import { PasswordStrength } from './calculator/PasswordStrength';
import { PasswordStrengthEn } from './calculator/PasswordStrengthEn';
import { InvoiceGenerator } from './calculator/InvoiceGenerator';
import { InvoiceGeneratorEn } from './calculator/InvoiceGeneratorEn';
import { ScreenRuler } from './calculator/ScreenRuler';
import { ScreenRulerEn } from './calculator/ScreenRulerEn';
import { PomodoroTimer } from './calculator/PomodoroTimer';
import { PomodoroTimerEn } from './calculator/PomodoroTimerEn';

// 추천
import { MenuRecommender } from './recommender/MenuRecommender';
import { WeekendRecommender } from './recommender/WeekendRecommender';
import { RestRecommender } from './recommender/RestRecommender';

// 도구 레지스트리 맵
const toolComponents: Record<string, ComponentType> = {
  // 텍스트 도구 (14개)
  'character-counter': CharacterCounter,
  'case-converter': CaseConverter,
  'line-break-remover': LineBreakRemover,
  'duplicate-line-remover': DuplicateLineRemover,
  'text-sorter': TextSorter,
  'random-string-generator': RandomStringGenerator,
  'korean-english-converter': KoreanEnglishConverter,
  'lorem-ipsum': LoremIpsum,
  'text-diff': TextDiff,
  'word-frequency': WordFrequency,
  'message-length-checker': MessageLengthChecker,
  'reading-time-calculator': ReadingTimeCalculator,
  'character-counter-en': CharacterCounterEn,
  'case-converter-en': CaseConverterEn,
  'line-break-remover-en': LineBreakRemoverEn,
  'duplicate-line-remover-en': DuplicateLineRemoverEn,
  'text-sorter-en': TextSorterEn,
  'random-string-generator-en': RandomStringGeneratorEn,
  'lorem-ipsum-en': LoremIpsumEn,
  'text-diff-en': TextDiffEn,
  'word-frequency-en': WordFrequencyEn,
  'message-length-checker-en': MessageLengthCheckerEn,
  'reading-time-calculator-en': ReadingTimeCalculatorEn,
  'regex-generator': RegexGenerator,
  'regex-generator-en': RegexGeneratorEn,
  'line-number': LineNumber,
  'line-number-en': LineNumberEn,

  // 인코딩/디코딩 (8개)
  'base64': Base64Tool,
  'url-encoder': UrlEncoder,
  'hash-generator': HashGenerator,
  'html-entity': HtmlEntity,
  'unicode-converter': UnicodeConverter,
  'morse-code': MorseCode,
  'jwt-decoder': JwtDecoder,
  'base64-en': Base64ToolEn,
  'url-encoder-en': UrlEncoderEn,
  'hash-generator-en': HashGeneratorEn,
  'html-entity-en': HtmlEntityEn,
  'unicode-converter-en': UnicodeConverterEn,
  'morse-code-en': MorseCodeEn,
  'jwt-decoder-en': JwtDecoderEn,
  'string-escape': StringEscape,
  'string-escape-en': StringEscapeEn,

  // 포맷터 (7개)
  'json-formatter': JsonFormatter,
  'json-csv-converter': JsonCsvConverter,
  'xml-formatter': XmlFormatter,
  'sql-formatter': SqlFormatter,
  'minifier': Minifier,
  'markdown-preview': MarkdownPreview,
  'yaml-json-converter': YamlJsonConverter,
  'url-query-parser': UrlQueryParser,
  'json-formatter-en': JsonFormatterEn,
  'json-csv-converter-en': JsonCsvConverterEn,
  'xml-formatter-en': XmlFormatterEn,
  'sql-formatter-en': SqlFormatterEn,
  'minifier-en': MinifierEn,
  'markdown-preview-en': MarkdownPreviewEn,
  'yaml-json-converter-en': YamlJsonConverterEn,
  'url-query-parser-en': UrlQueryParserEn,
  'html-preview': HtmlPreview,
  'html-preview-en': HtmlPreviewEn,
  'code-diff': CodeDiff,
  'code-diff-en': CodeDiffEn,
  'cron-parser': CronParser,
  'cron-parser-en': CronParserEn,
  'http-status-code': HttpStatusCode,
  'http-status-code-en': HttpStatusCodeEn,
  'json-path-tester': JsonPathTester,
  'json-path-tester-en': JsonPathTesterEn,
  'html-boilerplate': HtmlBoilerplate,
  'html-boilerplate-en': HtmlBoilerplateEn,
  'flexbox-playground': FlexboxPlayground,
  'flexbox-playground-en': FlexboxPlaygroundEn,
  'og-preview': OgPreview,
  'og-preview-en': OgPreviewEn,
  'mermaid-diagram': MermaidDiagram,
  'mermaid-diagram-en': MermaidDiagramEn,

  // 이미지 도구 (7개)
  'image-resize': ImageResize,
  'image-compress': ImageCompress,
  'image-convert': ImageConvert,
  'image-crop': ImageCrop,
  'image-rotate': ImageRotate,
  'base64-image': Base64Image,
  'favicon-generator': FaviconGenerator,
  'video-gif-converter': VideoGifConverter,
  'image-resize-en': ImageResizeEn,
  'image-compress-en': ImageCompressEn,
  'image-convert-en': ImageConvertEn,
  'image-crop-en': ImageCropEn,
  'image-rotate-en': ImageRotateEn,
  'base64-image-en': Base64ImageEn,
  'favicon-generator-en': FaviconGeneratorEn,
  'video-gif-converter-en': VideoGifConverterEn,

  // 색상 도구 (8개)
  'color-converter': ColorConverter,
  'palette-generator': PaletteGenerator,
  'gradient-generator': GradientGenerator,
  'contrast-checker': ContrastChecker,
  'image-color-picker': ImageColorPicker,
  'color-blender': ColorBlender,
  'color-blind-simulator': ColorBlindSimulator,
  'color-converter-en': ColorConverterEn,
  'palette-generator-en': PaletteGeneratorEn,
  'gradient-generator-en': GradientGeneratorEn,
  'contrast-checker-en': ContrastCheckerEn,
  'image-color-picker-en': ImageColorPickerEn,
  'color-blender-en': ColorBlenderEn,
  'color-blind-simulator-en': ColorBlindSimulatorEn,
  'box-shadow-generator': BoxShadowGenerator,
  'box-shadow-generator-en': BoxShadowGeneratorEn,
  'border-radius-generator': BorderRadiusGenerator,
  'border-radius-generator-en': BorderRadiusGeneratorEn,

  // 계산기/생성기 (13개)
  'uuid-generator': UuidGenerator,
  'qr-generator': QrGenerator,
  'date-calculator': DateCalculator,
  'percentage': PercentageCalculator,
  'base-converter': BaseConverter,
  'unix-timestamp': UnixTimestamp,
  'unit-converter': UnitConverter,
  'regex-tester': RegexTester,
  'timer': Timer,
  'server-time': ServerTime,
  'server-time-en': ServerTimeEn,
  'ratio-calculator': RatioCalculator,
  'age-calculator': AgeCalculator,
  'bmi-calculator': BmiCalculator,
  'random-picker': RandomPicker,
  'meeting-cost-calculator': MeetingCostCalculator,
  'meeting-cost-calculator-en': MeetingCostCalculatorEn,
  'css-unit-converter': CssUnitConverter,
  'bmi-calculator-en': BmiCalculatorEn,
  'ratio-calculator-en': RatioCalculatorEn,
  'timer-en': TimerEn,
  'unit-converter-en': UnitConverterEn,
  'unix-timestamp-en': UnixTimestampEn,
  'date-calculator-en': DateCalculatorEn,
  'percentage-en': PercentageCalculatorEn,
  'random-picker-en': RandomPickerEn,
  'base-converter-en': BaseConverterEn,
  'regex-tester-en': RegexTesterEn,
  'qr-generator-en': QrGeneratorEn,
  'uuid-generator-en': UuidGeneratorEn,
  'css-unit-converter-en': CssUnitConverterEn,
  'ip-lookup': IpLookup,
  'ip-lookup-en': IpLookupEn,
  'file-size-calculator': FileSizeCalculator,
  'file-size-calculator-en': FileSizeCalculatorEn,
  'speed-test': SpeedTest,
  'speed-test-en': SpeedTestEn,
  'fake-data-generator': FakeDataGenerator,
  'fake-data-generator-en': FakeDataGeneratorEn,
  'salary-calculator': SalaryCalculator,
  'loan-calculator': LoanCalculator,
  'loan-calculator-en': LoanCalculatorEn,
  'interest-calculator': InterestCalculator,
  'interest-calculator-en': InterestCalculatorEn,

  // 재미/테스트 (12개)
  'reaction-time-test': ReactionTimeTest,
  'lotto-generator': LottoGenerator,
  'nickname-generator': NicknameGenerator,
  'color-perception-test': ColorPerceptionTest,
  'color-perception-test-en': ColorPerceptionTestEn,
  'roulette-selector': RouletteSelector,
  'roulette-selector-en': RouletteSelectorEn,
  'ladder-game': LadderGame,
  'ladder-game-en': LadderGameEn,
  'timing-test': TimingTest,
  'timing-test-en': TimingTestEn,
  'random-decision-maker': RandomDecisionMaker,
  'random-decision-maker-en': RandomDecisionMakerEn,
  'fortune-cookie': FortuneCookie,
  'order-picker': OrderPicker,
  'order-picker-en': OrderPickerEn,
  'reaction-time-test-en': ReactionTimeTestEn,
  'us-lotto-generator-en': UsLottoGenerator,
  'name-compatibility': NameCompatibility,
  'birthday-compatibility': BirthdayCompatibility,
  'daily-tarot': DailyTarot,
  'love-calculator-en': LoveCalculator,
  'ship-name-generator-en': ShipNameGenerator,
  'daily-horoscope-en': DailyHoroscope,
  'personality-color-quiz-en': PersonalityColorQuiz,
  'tip-calculator-en': TipCalculator,
  'gpa-calculator-en': GpaCalculator,
  'shell-game': ShellGame,
  'shell-game-en': ShellGameEn,
  'letter-qr': LetterQr,
  'letter-qr-en': LetterQrEn,
  'saju-reading': SajuReading,
  'saju-compatibility': SajuCompatibility,
  'team-picker': TeamPicker,
  'team-picker-en': TeamPickerEn,
  'typing-game': TypingGame,
  'typing-practice': TypingPractice,
  'typing-game-en': TypingGameEn,
  'typing-practice-en': TypingPracticeEn,
  'number-guess': NumberGuess,
  'number-guess-en': NumberGuessEn,
  'password-strength': PasswordStrength,
  'password-strength-en': PasswordStrengthEn,
  'invoice-generator': InvoiceGenerator,
  'invoice-generator-en': InvoiceGeneratorEn,
  'screen-ruler': ScreenRuler,
  'screen-ruler-en': ScreenRulerEn,
  'pomodoro-timer': PomodoroTimer,
  'pomodoro-timer-en': PomodoroTimerEn,

  // 추천 (5개)
  'menu-recommender': MenuRecommender,
  'weekend-recommender': WeekendRecommender,
  'rest-recommender': RestRecommender,
};

/**
 * 슬러그로 도구 컴포넌트 가져오기
 */
export function getToolComponent(slug: string): ComponentType | undefined {
  return toolComponents[slug];
}

/**
 * 등록된 도구 목록 가져오기
 */
export function getRegisteredTools(): string[] {
  return Object.keys(toolComponents);
}
