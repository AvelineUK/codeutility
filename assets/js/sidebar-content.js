const SITE_CONFIG = {
    name: "CodeUtility",
    domain: "codeutility.dev",
    tagline: "Fast, privacy-focused developer utilities"
};

const TOOL_CATEGORIES = [
//    {
//        name: "Premium Tools",
//        tools: [
//            { name: "Webhook Tester", href: "webhook-tester.html" },
//            { name: "Cron Job Monitor", href: "cron-monitor.html" },
//            { name: "API Rate Limiter", href: "api-rate-limiter.html" },
//            { name: "Email Verification", href: "email-verification.html" },
//        ]
//    },
    {
        name: "Text & Encoding",
        tools: [
            { name: "Base64 Encoder/Decoder", href: "base64.html" },
            { name: "URL Encoder/Decoder", href: "url-encoder.html" },
            { name: "Case Converter", href: "case-converter.html" },
            { name: "Hash Generator", href: "hash-generator.html" },
            { name: "HTML Entity Encoder", href: "html-entity.html" },
            { name: "JWT Decoder", href: "jwt-decoder.html" },
            { name: "Unicode Converter", href: "unicode-converter.html" },
            { name: "ASCII Converter", href: "ascii-converter.html" },
            { name: "Hex Converter", href: "hex-converter.html" },
            { name: "Binary Converter", href: "binary-converter.html" },
            { name: "ROT13 Encoder", href: "rot13.html" },
            { name: "Morse Code Translator", href: "morse-code.html" },
            { name: "Character Counter", href: "character-counter.html" },
            { name: "Word Counter", href: "word-counter.html" },
            { name: "Slug Generator", href: "slug-generator.html" }
        ]
    },
    {
        name: "JSON & Data",
        tools: [
            { name: "JSON Formatter", href: "json-formatter.html" },
            { name: "JSON Validator", href: "json-validator.html" },
            { name: "CSV to JSON", href: "csv-to-json.html" },
            { name: "JSON to CSV", href: "json-to-csv.html" },
            { name: "YAML to JSON", href: "yaml-to-json.html" },
            { name: "JSON to YAML", href: "json-to-yaml.html" },
            { name: "XML to JSON", href: "xml-to-json.html" },
            { name: "JSON to XML", href: "json-to-xml.html" },
            { name: "JSON Minifier", href: "json-minifier.html" },
            { name: "JSON Diff", href: "json-diff.html" },
            { name: "JMESPath Tester", href: "jmespath-tester.html" }
        ]
    },
    {
        name: "Generators",
        tools: [
            { name: "UUID Generator", href: "uuid.html" },
            { name: "Password Generator", href: "password.html" },
            { name: "Lorem Ipsum Generator", href: "lorem-ipsum.html" },
            { name: "QR Code Generator", href: "qr-code.html" },
            { name: "Barcode Generator", href: "barcode.html" },
            { name: "Random Number Generator", href: "random-number.html" },
            { name: "Random String Generator", href: "random-string.html" },
            { name: "Color Palette Generator", href: "color-palette.html" },
            { name: "Dummy Data Generator", href: "dummy-data.html" }
        ]
    },
    {
        name: "Developer Tools",
        tools: [
            { name: "JavaScript Runner", href: "javascript-runner.html" },
            { name: "TypeScript Compiler", href: "typescript-compiler.html" },
            { name: "Regex Tester", href: "regex-tester.html" },
            { name: "Diff Checker", href: "diff-checker.html" },
            { name: "Cron Expression Builder", href: "cron-builder.html" },
            { name: "SQL Formatter", href: "sql-formatter.html" },
            { name: "HTML Formatter", href: "html-formatter.html" },
            { name: "CSS Formatter", href: "css-formatter.html" },
            { name: "JavaScript Formatter", href: "js-formatter.html" },
            { name: "HTML Minifier", href: "html-minifier.html" },
            { name: "CSS Minifier", href: "css-minifier.html" },
            { name: "JavaScript Minifier", href: "js-minifier.html" },
            { name: "Base Converter", href: "base-converter.html" },
            { name: "Git Commit Message Generator", href: "git-commit.html" }
        ]
    },
    {
        name: "CSS & Frontend",
        tools: [
            { name: "Color Picker", href: "color-picker.html" },
            { name: "Gradient Generator", href: "gradient-generator.html" },
            { name: "Box Shadow Generator", href: "box-shadow.html" },
            { name: "Border Radius Generator", href: "border-radius.html" },
            { name: "Flexbox Playground", href: "flexbox.html" },
            { name: "CSS Grid Generator", href: "css-grid.html" },
            { name: "CSS Triangle Generator", href: "css-triangle.html" },
            { name: "Image Resizer", href: "image-resizer.html" }
        ]
    },
    {
        name: "Time & Date",
        tools: [
            { name: "Unix Timestamp Converter", href: "timestamp.html" },
            { name: "Epoch Time Calculator", href: "epoch-calculator.html" },
            { name: "Timezone Converter", href: "timezone-converter.html" },
            { name: "Date Difference Calculator", href: "date-diff.html" },
            { name: "ISO 8601 Converter", href: "iso8601.html" }
        ]
    }
];
