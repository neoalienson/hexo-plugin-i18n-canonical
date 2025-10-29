# Test Summary

## Test Results

✅ **All 19 tests passing**

## Test Coverage

### 1. getCanonicalPath (8 tests)
- ✅ Remove index.html from path
- ✅ Keep default language path unchanged
- ✅ Remove zh-TW prefix for translated pages
- ✅ Remove zh-CN prefix for translated pages
- ✅ Remove ja prefix for translated pages
- ✅ Handle blog post paths
- ✅ Handle root path
- ✅ Handle translated root path

### 2. getBasePath (3 tests)
- ✅ Remove all language prefixes
- ✅ Keep default language path
- ✅ Handle blog posts

### 3. buildCanonicalTags (8 tests)
- ✅ Use current path as canonical when canonical_lang is set
- ✅ Point to default lang when canonical_lang not set
- ✅ Mark canonical language in hreflang tags
- ✅ Generate all hreflang tags
- ✅ Handle homepage
- ✅ Handle translated homepage
- ✅ Handle zh-TW page pointing to English canonical
- ✅ Handle English page when zh-CN is canonical

## Key Test Scenarios

### Scenario 1: zh-CN as Canonical
```javascript
const data = {
  path: 'zh-CN/2025/10/cisp/',
  lang: 'zh-CN',
  canonical_lang: 'zh-CN'
};
// Result: canonical points to zh-CN version
// <link rel="canonical" href="https://neo01.com/zh-CN/2025/10/cisp" />
```

### Scenario 2: English as Default Canonical
```javascript
const data = {
  path: '2025/10/article/',
  lang: 'en'
};
// Result: canonical points to English version
// <link rel="canonical" href="https://neo01.com/2025/10/article" />
```

### Scenario 3: Translated Page to English
```javascript
const data = {
  path: 'zh-TW/tools/',
  lang: 'zh-TW'
};
// Result: canonical points to English version
// <link rel="canonical" href="https://neo01.com/tools" />
```

## Running Tests

```bash
cd hexo-canonical-multilang
npm test
```

## Test Framework

- **Framework**: Mocha
- **Assertions**: Node.js assert
- **Test File**: index.test.js
