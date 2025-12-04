const SITE_CONFIG = {
    name: "CodeUtility",
    domain: "codeutility.dev",
    tagline: "Fast, privacy-focused developer utilities"
};

const TOOL_CATEGORIES = [
//    {
//        name: "Premium Tools",
//        tools: [
//            { name: "Webhook Tester", href: "webhook-tester" },
//            { name: "Cron Job Monitor", href: "cron-monitor" },
//            { name: "API Rate Limiter", href: "api-rate-limiter" },
//            { name: "Email Verification", href: "email-verification" },
//        ]
//    },
    {
        name: "Text & Encoding",
        tools: [
            { name: "Base64 Encoder/Decoder", href: "base64" },
            { name: "URL Encoder/Decoder", href: "url-encoder" },
            { name: "Case Converter", href: "case-converter" },
            { name: "Hash Generator", href: "hash-generator" },
            { name: "HTML Entity Encoder", href: "html-entity" },
            { name: "JWT Decoder", href: "jwt-decoder" },
            { name: "Unicode Converter", href: "unicode-converter" },
            { name: "ASCII Converter", href: "ascii-converter" },
            { name: "Hex Converter", href: "hex-converter" },
            { name: "Binary Converter", href: "binary-converter" },
            { name: "ROT13 Encoder", href: "rot13" },
            { name: "Morse Code Translator", href: "morse-code" },
            { name: "Character Counter", href: "character-counter" },
            { name: "Word Counter", href: "word-counter" },
            { name: "Slug Generator", href: "slug-generator" }
        ]
    },
    {
        name: "JSON & Data",
        tools: [
            { name: "JSON Formatter", href: "json-formatter" },
            { name: "JSON Validator", href: "json-validator" },
            { name: "CSV to JSON", href: "csv-to-json" },
            { name: "JSON to CSV", href: "json-to-csv" },
            { name: "YAML to JSON", href: "yaml-to-json" },
            { name: "JSON to YAML", href: "json-to-yaml" },
            { name: "XML to JSON", href: "xml-to-json" },
            { name: "JSON to XML", href: "json-to-xml" },
            { name: "JSON Minifier", href: "json-minifier" },
            { name: "JSON Diff", href: "json-diff" },
            { name: "JMESPath Tester", href: "jmespath-tester" }
        ]
    },
    {
        name: "Generators",
        tools: [
            { name: "UUID Generator", href: "uuid" },
            { name: "Password Generator", href: "password" },
            { name: "Lorem Ipsum Generator", href: "lorem-ipsum" },
            { name: "QR Code Generator", href: "qr-code" },
            { name: "Barcode Generator", href: "barcode" },
            { name: "Random Number Generator", href: "random-number" },
            { name: "Random String Generator", href: "random-string" },
            { name: "Color Palette Generator", href: "color-palette" },
            { name: "Dummy Data Generator", href: "dummy-data" }
        ]
    },
    {
        name: "Developer Tools",
        tools: [
            { name: "JavaScript Runner", href: "javascript-runner" },
            { name: "TypeScript Compiler", href: "typescript-compiler" },
            { name: "Regex Tester", href: "regex-tester" },
            { name: "Diff Checker", href: "diff-checker" },
            { name: "Cron Expression Builder", href: "cron-builder" },
            { name: "SQL Formatter", href: "sql-formatter" },
            { name: "HTML Formatter", href: "html-formatter" },
            { name: "CSS Formatter", href: "css-formatter" },
            { name: "JavaScript Formatter", href: "js-formatter" },
            { name: "HTML Minifier", href: "html-minifier" },
            { name: "CSS Minifier", href: "css-minifier" },
            { name: "JavaScript Minifier", href: "js-minifier" },
            { name: "Base Converter", href: "base-converter" },
            { name: "Git Commit Message Generator", href: "git-commit" }
        ]
    },
    {
        name: "CSS & Frontend",
        tools: [
            { name: "Color Picker", href: "color-picker" },
            { name: "Gradient Generator", href: "gradient-generator" },
            { name: "Box Shadow Generator", href: "box-shadow" },
            { name: "Border Radius Generator", href: "border-radius" },
            { name: "Flexbox Playground", href: "flexbox" },
            { name: "CSS Grid Generator", href: "css-grid" },
            { name: "CSS Triangle Generator", href: "css-triangle" },
            { name: "Image Resizer", href: "image-resizer" }
        ]
    },
    {
        name: "Time & Date",
        tools: [
            { name: "Unix Timestamp Converter", href: "timestamp" },
            { name: "Epoch Time Calculator", href: "epoch-calculator" },
            { name: "Timezone Converter", href: "timezone-converter" },
            { name: "Date Difference Calculator", href: "date-diff" },
            { name: "ISO 8601 Converter", href: "iso8601" }
        ]
    }
];
