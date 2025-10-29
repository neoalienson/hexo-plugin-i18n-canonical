const defaultConfig = {
  enable: true,
  default_lang: 'en',
  languages: ['en', 'zh-TW', 'zh-CN', 'ja']
};

function getCanonicalPath(path, lang, config) {
  const cfg = Object.assign({}, defaultConfig, config.canonical_multilang || {});
  const defaultLang = cfg.default_lang;
  
  let canonicalPath = path.replace(/index\.html$/, '');
  
  // For non-default language pages, point to default language version
  if (lang !== defaultLang) {
    // Remove language prefix from path
    cfg.languages.forEach(l => {
      if (l !== defaultLang) {
        const prefix = new RegExp(`^${l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\/`);
        canonicalPath = canonicalPath.replace(prefix, '');
      }
    });
  }
  
  return canonicalPath;
}

function getBasePath(path, config) {
  const cfg = Object.assign({}, defaultConfig, config.canonical_multilang || {});
  const defaultLang = cfg.default_lang;
  
  let basePath = path.replace(/index\.html$/, '');
  
  // Remove any language prefix to get base path
  cfg.languages.forEach(l => {
    if (l !== defaultLang) {
      const prefix = new RegExp(`^${l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\/`);
      basePath = basePath.replace(prefix, '');
    }
  });
  
  return basePath;
}

if (typeof hexo !== 'undefined') {
  hexo.extend.filter.register('after_render:html', function(str, data) {
    const cfg = Object.assign({}, defaultConfig, hexo.config.canonical_multilang || {});
    if (!cfg.enable) return str;
    if (!data.path) return str;
    if (str.includes('<link rel="canonical"')) return str;
    
    const { canonical, hreflangTags } = buildCanonicalTags(data, hexo.config);
    const tags = `  ${canonical}\n  ${hreflangTags}\n</head>`;
    return str.replace('</head>', tags);
  });
}

function buildCanonicalTags(data, config) {
  const cfg = Object.assign({}, defaultConfig, config.canonical_multilang || {});
  const lang = data.lang || 'en';
  const canonicalLang = data.canonical_lang || cfg.default_lang;
  
  let canonicalPath;
  if (data.canonical_lang) {
    canonicalPath = data.path.replace(/index\.html$/, '');
  } else {
    canonicalPath = getCanonicalPath(data.path, lang, config);
    if (canonicalLang !== cfg.default_lang) {
      const basePath = getBasePath(data.path, config);
      canonicalPath = canonicalLang + '/' + basePath;
    }
  }
  
  const basePath = getBasePath(data.path, config);
  let canonicalUrl = config.url + '/' + canonicalPath;
  // Ensure trailing slash for directory URLs
  if (canonicalUrl === config.url || canonicalUrl.endsWith('/')) {
    canonicalUrl = canonicalUrl || config.url + '/';
  } else if (!canonicalUrl.includes('.')) {
    canonicalUrl += '/';
  }
  
  const canonical = `<link rel="canonical" href="${canonicalUrl}" />`;
  
  const hreflangTags = cfg.languages.map(l => {
    let langPath = basePath;
    if (l !== cfg.default_lang) {
      langPath = l + '/' + basePath;
    }
    let langUrl = config.url + '/' + langPath;
    // Ensure trailing slash for directory URLs
    if (langUrl === config.url || langUrl.endsWith('/')) {
      langUrl = langUrl || config.url + '/';
    } else if (!langUrl.includes('.')) {
      langUrl += '/';
    }
    const hreflangAttr = l === canonicalLang ? `${l}" data-canonical="true` : l;
    return `<link rel="alternate" hreflang="${hreflangAttr}" href="${langUrl}" />`;
  }).join('\n  ');
  
  return { canonical, hreflangTags };
}

module.exports = { getCanonicalPath, getBasePath, defaultConfig, buildCanonicalTags };
