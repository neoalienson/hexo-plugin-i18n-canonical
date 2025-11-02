# Changelog

## [1.1.0] - 2025-11-03

### Fixed
- Fixed canonical URL generation to always point to English version when `canonical_lang` is not set
- Translated pages (ja, zh-TW, zh-CN) now correctly point canonical to English version by default

### Changed
- Simplified canonical path logic for better maintainability
- Removed trailing slashes from canonical and hreflang URLs

### Added
- Comprehensive test suite with 29 tests covering all requirements and edge cases
- Tests for consistency checks (canonical matches hreflang, single data-canonical attribute)
- Tests for edge cases (homepage, deep paths, missing lang)

## [1.0.0] - 2025-11-01

### Added
- Initial release
- Automatic canonical tag generation for multilingual sites
- Hreflang tag generation for all language variants
- Support for `canonical_lang` front matter to specify non-English canonical content
- Support for en, zh-TW, zh-CN, ja languages
- Configurable via `_config.yml`
