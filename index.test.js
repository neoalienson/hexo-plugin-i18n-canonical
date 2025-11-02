const assert = require('assert');
const { describe, it } = require('mocha');
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

    describe('canonical_lang behavior', () => {
      it('should use zh-CN path as canonical when canonical_lang=zh-CN', () => {
        const data = {
          path: 'zh-CN/2025/10/cisp/',
          lang: 'zh-CN',
          canonical_lang: 'zh-CN'
        };
        const { canonical } = buildCanonicalTags(data, mockConfig);
        assert.strictEqual(canonical, '<link rel="canonical" href="https://neo01.com/zh-CN/2025/10/cisp" />');
      });

      it('should point English canonical when canonical_lang not set', () => {
        const data = {
          path: '2025/10/cisp/',
          lang: 'en'
        };
        const { canonical } = buildCanonicalTags(data, mockConfig);
        assert.strictEqual(canonical, '<link rel="canonical" href="https://neo01.com/2025/10/cisp" />');
      });

      it('should point English canonical when canonical_lang=en explicitly', () => {
        const data = {
          path: '2025/10/article/',
          lang: 'en',
          canonical_lang: 'en'
        };
        const { canonical } = buildCanonicalTags(data, mockConfig);
        assert.strictEqual(canonical, '<link rel="canonical" href="https://neo01.com/2025/10/article" />');
      });
    });

    describe('translated pages without canonical_lang', () => {
      it('should point Japanese page to English canonical', () => {
        const data = {
          path: 'ja/2025/10/article/',
          lang: 'ja'
        };
        const { canonical } = buildCanonicalTags(data, mockConfig);
        assert.strictEqual(canonical, '<link rel="canonical" href="https://neo01.com/2025/10/article" />');
      });

      it('should point zh-TW page to English canonical', () => {
        const data = {
          path: 'zh-TW/tools/',
          lang: 'zh-TW'
        };
        const { canonical } = buildCanonicalTags(data, mockConfig);
        assert.strictEqual(canonical, '<link rel="canonical" href="https://neo01.com/tools" />');
      });

      it('should point zh-CN page to English canonical', () => {
        const data = {
          path: 'zh-CN/about/',
          lang: 'zh-CN'
        };
        const { canonical } = buildCanonicalTags(data, mockConfig);
        assert.strictEqual(canonical, '<link rel="canonical" href="https://neo01.com/about" />');
      });
    });

    describe('hreflang tags', () => {
      it('should mark canonical language with data-canonical=true', () => {
        const data = {
          path: 'zh-CN/2025/10/cisp/',
          lang: 'zh-CN',
          canonical_lang: 'zh-CN'
        };
        const { hreflangTags } = buildCanonicalTags(data, mockConfig);
        assert(hreflangTags.includes('hreflang="zh-CN" data-canonical="true"'));
      });

      it('should mark English as canonical when canonical_lang not set', () => {
        const data = {
          path: 'ja/2025/10/article/',
          lang: 'ja'
        };
        const { hreflangTags } = buildCanonicalTags(data, mockConfig);
        assert(hreflangTags.includes('hreflang="en" data-canonical="true"'));
      });

      it('should generate all language hreflang tags', () => {
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

      it('should generate correct URLs for all languages', () => {
        const data = {
          path: '2025/10/article/',
          lang: 'en'
        };
        const { hreflangTags } = buildCanonicalTags(data, mockConfig);
        assert(hreflangTags.includes('href="https://neo01.com/2025/10/article"'));
        assert(hreflangTags.includes('href="https://neo01.com/zh-TW/2025/10/article"'));
        assert(hreflangTags.includes('href="https://neo01.com/zh-CN/2025/10/article"'));
        assert(hreflangTags.includes('href="https://neo01.com/ja/2025/10/article"'));
      });
    });

    describe('edge cases', () => {
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

      it('should handle missing lang (defaults to en)', () => {
        const data = {
          path: '2025/10/article/'
        };
        const { canonical } = buildCanonicalTags(data, mockConfig);
        assert.strictEqual(canonical, '<link rel="canonical" href="https://neo01.com/2025/10/article" />');
      });

      it('should handle paths with index.html', () => {
        const data = {
          path: 'ja/2025/10/article/index.html',
          lang: 'ja'
        };
        const { canonical } = buildCanonicalTags(data, mockConfig);
        assert.strictEqual(canonical, '<link rel="canonical" href="https://neo01.com/2025/10/article" />');
      });

      it('should handle deep nested paths', () => {
        const data = {
          path: 'ja/category/subcategory/2025/10/article/',
          lang: 'ja'
        };
        const { canonical } = buildCanonicalTags(data, mockConfig);
        assert.strictEqual(canonical, '<link rel="canonical" href="https://neo01.com/category/subcategory/2025/10/article" />');
      });
    });

    describe('consistency checks', () => {
      it('should ensure canonical URL matches one of the hreflang URLs', () => {
        const data = {
          path: 'ja/2025/10/article/',
          lang: 'ja'
        };
        const { canonical, hreflangTags } = buildCanonicalTags(data, mockConfig);
        const canonicalUrl = canonical.match(/href="([^"]+)"/)[1];
        assert(hreflangTags.includes(`href="${canonicalUrl}"`));
      });

      it('should have exactly one data-canonical=true in hreflang tags', () => {
        const data = {
          path: 'zh-CN/2025/10/cisp/',
          lang: 'zh-CN',
          canonical_lang: 'zh-CN'
        };
        const { hreflangTags } = buildCanonicalTags(data, mockConfig);
        const matches = hreflangTags.match(/data-canonical="true"/g);
        assert.strictEqual(matches.length, 1);
      });

      it('should have hreflang tag for each configured language', () => {
        const data = {
          path: '2025/10/article/',
          lang: 'en'
        };
        const { hreflangTags } = buildCanonicalTags(data, mockConfig);
        mockConfig.canonical_multilang.languages.forEach(lang => {
          assert(hreflangTags.includes(`hreflang="${lang}`));
        });
      });
    });
  });
});
