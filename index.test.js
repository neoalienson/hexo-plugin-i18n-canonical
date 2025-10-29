const assert = require('assert');
const plugin = require('./index');
const { getCanonicalPath, getBasePath, defaultConfig, buildCanonicalTags } = plugin;

describe('hexo-canonical-multilang', () => {
  const mockConfig = {
    canonical_multilang: {
      default_lang: 'en',
      languages: ['en', 'zh-TW', 'zh-CN', 'ja']
    }
  };

  describe('getCanonicalPath', () => {
    it('should remove index.html from path', () => {
      const result = getCanonicalPath('about/index.html', 'en', mockConfig);
      assert.strictEqual(result, 'about/');
    });

    it('should keep default language path unchanged', () => {
      const result = getCanonicalPath('tools/', 'en', mockConfig);
      assert.strictEqual(result, 'tools/');
    });

    it('should remove zh-TW prefix for translated pages', () => {
      const result = getCanonicalPath('zh-TW/tools/', 'zh-TW', mockConfig);
      assert.strictEqual(result, 'tools/');
    });

    it('should remove zh-CN prefix for translated pages', () => {
      const result = getCanonicalPath('zh-CN/about/', 'zh-CN', mockConfig);
      assert.strictEqual(result, 'about/');
    });

    it('should remove ja prefix for translated pages', () => {
      const result = getCanonicalPath('ja/games/', 'ja', mockConfig);
      assert.strictEqual(result, 'games/');
    });

    it('should handle blog post paths', () => {
      const result = getCanonicalPath('zh-TW/2025/10/article/index.html', 'zh-TW', mockConfig);
      assert.strictEqual(result, '2025/10/article/');
    });

    it('should handle root path', () => {
      const result = getCanonicalPath('index.html', 'en', mockConfig);
      assert.strictEqual(result, '');
    });

    it('should handle translated root path', () => {
      const result = getCanonicalPath('zh-TW/index.html', 'zh-TW', mockConfig);
      assert.strictEqual(result, '');
    });
  });

  describe('getBasePath', () => {
    it('should remove all language prefixes', () => {
      assert.strictEqual(getBasePath('zh-TW/tools/', mockConfig), 'tools/');
      assert.strictEqual(getBasePath('zh-CN/tools/', mockConfig), 'tools/');
      assert.strictEqual(getBasePath('ja/tools/', mockConfig), 'tools/');
    });

    it('should keep default language path', () => {
      assert.strictEqual(getBasePath('tools/', mockConfig), 'tools/');
    });

    it('should handle blog posts', () => {
      assert.strictEqual(getBasePath('zh-CN/2025/10/article/', mockConfig), '2025/10/article/');
    });
  });

  describe('buildCanonicalTags', () => {
    const mockConfig = {
      url: 'https://neo01.com',
      canonical_multilang: {
        default_lang: 'en',
        languages: ['en', 'zh-TW', 'zh-CN', 'ja']
      }
    };

    it('should use current path as canonical when canonical_lang is set', () => {
      const data = {
        path: 'zh-CN/2025/10/cisp/',
        lang: 'zh-CN',
        canonical_lang: 'zh-CN'
      };
      const { canonical } = buildCanonicalTags(data, mockConfig);
      assert.strictEqual(canonical, '<link rel="canonical" href="https://neo01.com/zh-CN/2025/10/cisp" />');
    });

    it('should point to default lang when canonical_lang not set', () => {
      const data = {
        path: '2025/10/cisp/',
        lang: 'en'
      };
      const { canonical } = buildCanonicalTags(data, mockConfig);
      assert.strictEqual(canonical, '<link rel="canonical" href="https://neo01.com/2025/10/cisp" />');
    });

    it('should mark canonical language in hreflang tags', () => {
      const data = {
        path: 'zh-CN/2025/10/cisp/',
        lang: 'zh-CN',
        canonical_lang: 'zh-CN'
      };
      const { hreflangTags } = buildCanonicalTags(data, mockConfig);
      assert(hreflangTags.includes('hreflang="zh-CN" data-canonical="true"'));
    });

    it('should generate all hreflang tags', () => {
      const data = {
        path: 'zh-CN/2025/10/cisp/',
        lang: 'zh-CN',
        canonical_lang: 'zh-CN'
      };
      const { hreflangTags } = buildCanonicalTags(data, mockConfig);
      assert(hreflangTags.includes('hreflang="en"'));
      assert(hreflangTags.includes('hreflang="zh-TW"'));
      assert(hreflangTags.includes('hreflang="zh-CN"'));
      assert(hreflangTags.includes('hreflang="ja"'));
    });

    it('should handle homepage', () => {
      const data = {
        path: 'index.html',
        lang: 'en'
      };
      const { canonical } = buildCanonicalTags(data, mockConfig);
      assert.strictEqual(canonical, '<link rel="canonical" href="https://neo01.com" />');
    });

    it('should handle translated homepage', () => {
      const data = {
        path: 'zh-TW/index.html',
        lang: 'zh-TW'
      };
      const { canonical } = buildCanonicalTags(data, mockConfig);
      assert.strictEqual(canonical, '<link rel="canonical" href="https://neo01.com" />');
    });

    it('should handle zh-TW page pointing to English canonical', () => {
      const data = {
        path: 'zh-TW/tools/',
        lang: 'zh-TW'
      };
      const { canonical } = buildCanonicalTags(data, mockConfig);
      assert.strictEqual(canonical, '<link rel="canonical" href="https://neo01.com/tools" />');
    });

    it('should handle English page when zh-CN is canonical', () => {
      const data = {
        path: '2025/10/cisp/',
        lang: 'en'
      };
      const { canonical } = buildCanonicalTags(data, mockConfig);
      assert.strictEqual(canonical, '<link rel="canonical" href="https://neo01.com/2025/10/cisp" />');
    });
  });
});
