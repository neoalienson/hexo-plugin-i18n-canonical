# hexo-plugin-i18n-canonical

Hexo plugin to manage canonical URLs for multilingual sites.

## Features

- Automatically adds canonical tags to all pages
- Automatically adds hreflang tags for all language variants
- Points translated content to source language (default: English)
- Supports custom canonical language via `canonical_lang` front matter
- Supports zh-TW, zh-CN, and ja translations
- Skips pages that already have canonical tags
- Improves SEO for multilingual content

## Installation

From the root of your project:

```bash
npm install ./hexo-plugin-i18n-canonical
```

Or add to `package.json`:

```json
{
  "dependencies": {
    "hexo-plugin-i18n-canonical": "file:../hexo-plugin-i18n-canonical"
  }
}
```

## Configuration

Optional configuration in `_config.yml`:

```yaml
canonical_multilang:
  enable: true      # Default: true (set to false to disable)
  default_lang: en  # Default: 'en'
  languages:        # Default: ['en', 'zh-TW', 'zh-CN', 'ja']
    - en
    - zh-TW
    - zh-CN
    - ja
```

**To disable the plugin:**

```yaml
canonical_multilang:
  enable: false
```

## Usage

The plugin automatically:

1. Detects language from `lang` front matter
2. Generates canonical URLs pointing to English version (unless `canonical_lang` is set)
3. Adds hreflang tags for all language variants
4. Marks canonical language with `data-canonical="true"` attribute
5. Respects `canonical_lang` front matter for non-English canonical content

### Front Matter Options

**canonical_lang**: Specify which language version is the canonical/original content

```yaml
---
title: "CISP邮件安全"
lang: zh-CN
canonical_lang: zh-CN  # This zh-CN version is the canonical
---
```

When `canonical_lang` is set:
- The page's canonical URL points to itself
- Other language versions should use `original_lang_url` to redirect to this version
- Hreflang tags still generated for all language variants

## Examples

**Default Behavior (English as canonical):**

All translated pages point to English version:
- Japanese page `/ja/2025/10/article/` → canonical: `https://neo01.com/2025/10/article`
- zh-TW page `/zh-TW/tools/` → canonical: `https://neo01.com/tools`
- zh-CN page `/zh-CN/about/` → canonical: `https://neo01.com/about`
- English page `/about/` → canonical: `https://neo01.com/about`

**With canonical_lang (Non-English canonical):**
- `/zh-CN/2025/10/cisp/` with `canonical_lang: zh-CN` → canonical: `https://neo01.com/zh-CN/2025/10/cisp/`
- `/2025/10/cisp/` (English redirect) → canonical: `https://neo01.com/zh-CN/2025/10/cisp/`
- `/zh-TW/2025/10/cisp/` (redirect) → canonical: `https://neo01.com/zh-CN/2025/10/cisp/`

**Hreflang Tags (added to all pages):**
```html
<link rel="canonical" href="https://neo01.com/2025/10/article" />
<link rel="alternate" hreflang="en" data-canonical="true" href="https://neo01.com/2025/10/article" />
<link rel="alternate" hreflang="zh-TW" href="https://neo01.com/zh-TW/2025/10/article" />
<link rel="alternate" hreflang="zh-CN" href="https://neo01.com/zh-CN/2025/10/article" />
<link rel="alternate" hreflang="ja" href="https://neo01.com/ja/2025/10/article" />
```

## Testing

```bash
npm test
```

## License

MIT
