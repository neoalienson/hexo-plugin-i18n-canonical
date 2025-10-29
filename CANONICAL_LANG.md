# Canonical Language Support

## Overview

The `hexo-canonical-multilang` plugin now supports the `canonical_lang` front matter metadata to handle cases where non-English content is the canonical/original version.

## Problem

Previously, the plugin always assumed English was the canonical language. For content originally written in other languages (e.g., Chinese CISP posts), this created incorrect canonical URLs.

## Solution

### New Front Matter: `canonical_lang`

Add `canonical_lang` to specify which language version is the canonical/original:

```yaml
---
title: "CISP邮件安全"
lang: zh-CN
canonical_lang: zh-CN  # This zh-CN version is canonical
---
```

## Behavior

### With `canonical_lang` Set

**zh-CN post (canonical):**
```yaml
---
title: "CISP邮件安全"
lang: zh-CN
permalink: /zh-CN/2025/10/CISP-Email-Security/
canonical_lang: zh-CN
---
```

Generated tags:
```html
<link rel="canonical" href="https://neo01.com/zh-CN/2025/10/CISP-Email-Security/" />
<link rel="alternate" hreflang="en" href="https://neo01.com/2025/10/CISP-Email-Security/" />
<link rel="alternate" hreflang="zh-TW" href="https://neo01.com/zh-TW/2025/10/CISP-Email-Security/" />
<link rel="alternate" hreflang="zh-CN" data-canonical="true" href="https://neo01.com/zh-CN/2025/10/CISP-Email-Security/" />
<link rel="alternate" hreflang="ja" href="https://neo01.com/ja/2025/10/CISP-Email-Security/" />
```

**English post (redirect):**
```yaml
---
title: "CISP Email Security"
lang: en
permalink: /2025/10/CISP-Email-Security/
original_lang_url: /zh-CN/2025/10/CISP-Email-Security/
---
```

Generated tags:
```html
<link rel="canonical" href="https://neo01.com/zh-CN/2025/10/CISP-Email-Security/" />
<link rel="alternate" hreflang="en" href="https://neo01.com/2025/10/CISP-Email-Security/" />
<link rel="alternate" hreflang="zh-TW" href="https://neo01.com/zh-TW/2025/10/CISP-Email-Security/" />
<link rel="alternate" hreflang="zh-CN" data-canonical="true" href="https://neo01.com/zh-CN/2025/10/CISP-Email-Security/" />
<link rel="alternate" hreflang="ja" href="https://neo01.com/ja/2025/10/CISP-Email-Security/" />
```

### Without `canonical_lang` (Default Behavior)

English is assumed canonical:

**English post:**
```yaml
---
title: "My Article"
lang: en
permalink: /2025/10/my-article/
---
```

Generated tags:
```html
<link rel="canonical" href="https://neo01.com/2025/10/my-article/" />
<link rel="alternate" hreflang="en" data-canonical="true" href="https://neo01.com/2025/10/my-article/" />
<link rel="alternate" hreflang="zh-TW" href="https://neo01.com/zh-TW/2025/10/my-article/" />
<link rel="alternate" hreflang="zh-CN" href="https://neo01.com/zh-CN/2025/10/my-article/" />
<link rel="alternate" hreflang="ja" href="https://neo01.com/ja/2025/10/my-article/" />
```

## Usage with Redirect Posts

For posts only available in one language, combine with `original_lang_url`:

**Canonical post (zh-CN):**
```yaml
---
title: "CISP认证指南"
lang: zh-CN
permalink: /zh-CN/2025/10/cisp-certification/
canonical_lang: zh-CN
---
Full content here...
```

**Redirect posts (en, zh-TW, ja):**
```yaml
---
title: "CISP Certification"
lang: en
permalink: /2025/10/cisp-certification/
original_lang_url: /zh-CN/2025/10/cisp-certification/
---
```

## SEO Benefits

1. **Correct canonical URLs**: Search engines know which version is the original
2. **Proper hreflang tags**: All language variants are linked correctly
3. **No duplicate content**: Redirect posts point to canonical version
4. **Better indexing**: Search engines index the correct language version

## Testing

After updating posts with `canonical_lang`, verify:

```bash
hexo clean
hexo generate
grep -A 5 "canonical" public/zh-CN/2025/10/CISP-Email-Security/index.html
```

Expected output:
```html
<link rel="canonical" href="https://neo01.com/zh-CN/2025/10/CISP-Email-Security/" />
<link rel="alternate" hreflang="en" href="https://neo01.com/2025/10/CISP-Email-Security/" />
<link rel="alternate" hreflang="zh-TW" href="https://neo01.com/zh-TW/2025/10/CISP-Email-Security/" />
<link rel="alternate" hreflang="zh-CN" data-canonical="true" href="https://neo01.com/zh-CN/2025/10/CISP-Email-Security/" />
<link rel="alternate" hreflang="ja" href="https://neo01.com/ja/2025/10/CISP-Email-Security/" />
```
