// 国内 DNS 服务器
const domesticNameservers = [
  "quic://dns.alidns.com:853",
  "https://223.6.6.6:443/dns-query",
  "https://dns.alidns.com/dns-query",
  "https://doh.360.cn/dns-query",
  "tls://dot.360.cn",
  "https://101.226.4.6/dns-query",
  "tls://101.198.198.198:853"
];
// 国外 DNS 服务器
const foreignNameservers = [
  "https://dns.cloudflare.com/dns-query",
  "tls://1dot1dot1dot1.cloudflare-dns.com",
  "https://8.8.8.8/dns-query",
  "https://dns.google/dns-query",
  "https://dns.twnic.tw/dns-query",
  "tls://101.101.101.101",
  "quic://unfiltered.adguard-dns.com:853",
  "https://unfiltered.adguard-dns.com/dns-query",
  "https://doh.tiar.app/dns-query",
  "quic://doh.tiar.app"
];
// DNS 配置
const dnsConfig = {
  // 是否启用，如为 false，则使用系统 DNS 解析
  "enable": true,
  // DOH 优先使用 http/3
  // "prefer-h3": true,
  // DNS 服务监听，支持 udp, tcp
  "listen": "0.0.0.0:10053",
  // 是否解析 IPV6, 如为 false, 则回应 AAAA 的空解析
  "ipv6": true,
  // 是否查询系统 hosts，默认 true
  "use-system-hosts": false,
  // dns 连接遵守 rules 字段的规则
  "respect-rules": true,
  // 缓存算法，默认 lru，arc 为自适应替换缓存
  "cache-algorithm": "arc",
  // mihomo 的 DNS 处理模式，可选值 fake-ip/redir-host，默认redir-host
  "enhanced-mode": "fake-ip",
  // fake-ip 模式下的 IP 范围
  "fake-ip-range": "198.18.0.1/16",
  // fake-ip 模式下的 IP 过滤
  "fake-ip-filter": [
    //匹配 localhost 等没有.的主机名
    "*",
    // 本地主机/设备
    "+.lan",
    "+.local",
    // ntp
    "time.*.com",
    "ntp.*.com",
    // Windows 网络出现小地球图标
    "+.msftconnecttest.com",
    "+.msftncsi.com",
    // QQ 快速登录检测失败
    // "localhost.ptlogin2.qq.com",
    // "localhost.sec.qq.com",
    // 微信快速登录检测失败
    //"localhost.work.weixin.qq.com"
    "+.qq.com"
  ],
  // 用于解析 DNS 服务器的域名，必须是 ip
  "default-nameserver": ["https://223.6.6.6/dns-query", "https://1.12.12.12/dns-query", "https://101.226.4.6/dns-query"],
  // 代理节点（机场域名）域名解析服务器，仅用于解析代理节点的域名，填写国内的即可，因为正常国外dns无法链接
  "proxy-server-nameserver": [...domesticNameservers],
  // 默认的域名解析服务器，域名解析兜底
  "nameserver": [...domesticNameservers],
  // 指定域名查询策略，根据域名解析策略选择不同的解析服务器
  "nameserver-policy": {
    // 域名解析策略支持 geo（需要 geo 数据库） 和 rule-set
    // geosite 列表的内容（cn,private）是 geosite 中定义的名称
    // "geosite:private,cn,geolocation-cn": domesticNameservers,
    // "geosite:google,gfw,geolocation-!cn": foreignNameservers
    // rule-set 的内容是 ruleProviders 定义的
    "rule-set:direct,private": domesticNameservers,
    "rule-set:google,gfw,geolocation-!cn": foreignNameservers
  }
};

// 规则集通用配置
const ruleProviderCommon = {
  // provider 类型，可选 http/file/inline
  "type": "http",
  // provider 格式，可选 yaml/text/mrs，默认 yaml
  "format": "yaml",
  // 更新provider的时间，单位为秒，设置为1天
  "interval": 86400
};
// 规则集
const ruleProviders = {
  // 直连域名列表
  "direct": {
    ...ruleProviderCommon,
    // behavior 根据 url 类型决定
    // classical：经典的格式，形如 DOMAIN-SUFFIX,google.com
    // domain 域名，形如 +.google.com
    // ipcidr：cidr 的 ip
    "behavior": "domain",
    "url": "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/direct.txt",
    "path": "./ruleset/loyalsoldier/direct.yaml"
  },
  // 私有网络专用域名列表
  "private": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/private.txt",
    "path": "./ruleset/loyalsoldier/private.yaml"
  },
  // GFWList 域名列表
  "gfw": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/gfw.txt",
    "path": "./ruleset/loyalsoldier/gfw.yaml"
  },
  // 非中国大陆域名
  "geolocation-!cn": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/geolocation-!cn.yaml",
    "path": "./ruleset/loyalsoldier/geolocation-!cn.yaml"
  },
  // 中国大陆 IP 地址列表
  "cncidr": {
    ...ruleProviderCommon,
    "behavior": "ipcidr",
    "url": "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/cncidr.txt",
    "path": "./ruleset/loyalsoldier/cncidr.yaml"
  },
  // 局域网 IP 及保留 IP 地址列表
  "lancidr": {
    ...ruleProviderCommon,
    "behavior": "ipcidr",
    "url": "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/lancidr.txt",
    "path": "./ruleset/loyalsoldier/lancidr.yaml"
  },
  // 需要直连的常见软件列表
  "applications": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/applications.txt",
    "path": "./ruleset/loyalsoldier/applications.yaml"
  },
  "microsoft": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Microsoft/Microsoft.yaml",
    "path": "./ruleset/blackmatrix7/Microsoft.yaml"
  },
  "onedrive": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/OneDrive/OneDrive.yaml",
    "path": "./ruleset/blackmatrix7/OneDrive.yaml"
  },
  "openai": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/OpenAI/OpenAI.yaml",
    "path": "./ruleset/blackmatrix7/OpenAI.yaml"
  },
  "claude": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Claude/Claude.yaml",
    "path": "./ruleset/blackmatrix7/claude.yaml"
  },
  "gemini": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Gemini/Gemini.yaml",
    "path": "./ruleset/blackmatrix7/Gemini.yaml"
  },
  "google": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Google/Google.yaml",
    "path": "./ruleset/blackmatrix7/Google.yaml"
  },
  "youtube": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/YouTube/YouTube.yaml",
    "path": "./ruleset/blackmatrix7/YouTube.yaml"
  },
  "tiktok": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/TikTok/TikTok.yaml",
    "path": "./ruleset/blackmatrix7/TikTok.yaml"
  },
  "docker": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "format": "yaml",
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Docker/Docker.yaml",
    "path": "./ruleset/blackmatrix7/docker.yaml"
  },
  "foreignailist": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "format": "text",
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/refs/heads/master/Clash/Ruleset/AI.list",
    "path": "./ruleset/blackmatrix7/foreignailist.txt"
  }
};

// 代理组通用配置
const groupBaseOption = {
  // 代理组健康检查间隔，单位秒
  "interval": 20,
  // 健康检查超时时间，单位毫秒
  "timeout": 1000,
  // 健康检查 url。不使用其他 url，耗流量，https 和 http 流量销毁差不多
  "url": "https://www.gstatic.com/generate_204",
  // 健康检查时期望的 HTTP 响应状态码。若配置了该字段，则只有当响应状态码与期望状态一致时才认为节点可用。默认为 *，表示对响应状态不做要求
  "expected-status": 204,
  // 懒惰状态，默认为 true,未选择到当前策略组时，不进行测试
  "lazy": false,
  // 最大失败次数，超过则触发一次强制健康检查，默认 5
  "max-failed-times": 3,
  // 策略组是否隐藏
  "hidden": false
};
// 代理组（代理组的顺序影响显示顺序）
const proxyGroups = [
  {
    ...groupBaseOption,
    "name": "手动选择",
    "type": "select",
    "include-all": true,
    "icon": "https://fastly.jsdelivr.net/gh/xiaofanshifu/vpn@main/icon/manual.svg"
  },
  {
    ...groupBaseOption,
    "url": "https://chatgpt.com/",
    "expected-status": "200",
    "name": "AI",
    "type": "select",
    "proxies": ["手动选择"],
    "include-all": true,
    "filter": "新加坡|獅城|SG|🇸🇬|台湾|台灣|TW|🇹🇼|日本|JP|🇯🇵|韩国|韓國|KR|🇰🇷|马来西亚|馬來西亞|MY|🇲🇾|菲律宾|菲律賓|PH|🇵🇭|印度|IN|🇮🇳|美国|美國|US|🇺🇸",
    "icon": "https://fastly.jsdelivr.net/gh/xiaofanshifu/vpn@main/icon/ai.svg"
  },
  {
    ...groupBaseOption,
    "name": "谷歌服务",
    "type": "select",
    "proxies": ["手动选择", "延时优选"],
    "include-all": true,
    "icon": "https://fastly.jsdelivr.net/gh/xiaofanshifu/vpn@main/icon/google.svg"
  },
  {
    ...groupBaseOption,
    "name": "YouTube",
    "type": "select",
    "proxies": ["手动选择", "延时优选"],
    "include-all": true,
    "icon": "https://fastly.jsdelivr.net/gh/xiaofanshifu/vpn@main/icon/youtube.svg"
  },
  {
    ...groupBaseOption,
    "name": "TikTok",
    "type": "select",
    "proxies": ["手动选择", "延时优选"],
    "include-all": true,
    "icon": "https://fastly.jsdelivr.net/gh/xiaofanshifu/vpn@main/icon/tiktok.svg"
  },
  {
    ...groupBaseOption,
    "name": "容器服务",
    "type": "select",
    "proxies": ["手动选择", "延时优选"],
    "include-all": true,
    "icon": "https://fastly.jsdelivr.net/gh/xiaofanshifu/vpn@main/icon/container.svg"
  },
  {
    ...groupBaseOption,
    "name": "微软服务",
    "type": "select",
    "proxies": ["DIRECT", "手动选择", "延时优选"],
    "include-all": true,
    "icon": "https://fastly.jsdelivr.net/gh/xiaofanshifu/vpn@main/icon/microsoft.svg"
  },
  {
    ...groupBaseOption,
    "name": "延时优选",
    // 定时切换到延时最低的节点，即自动选择
    "type": "url-test",
    // 代理切换容忍度，即新一轮的节点测试，延时跟现在的节点延时的差值超过这个值，则切换到新节点，以毫秒为单位
    "tolerance": 50,
    "include-all": true,
    "icon": "https://fastly.jsdelivr.net/gh/xiaofanshifu/vpn@main/icon/speed.svg"
  },
  {
    ...groupBaseOption,
    "name": "漏网之鱼",
    "type": "select",
    "proxies": ["延时优选", "手动选择", "DIRECT"],
    "include-all": true,
    "icon": "https://fastly.jsdelivr.net/gh/xiaofanshifu/vpn@main/icon/fish.svg"
  }
];

// 规则（规则的顺序影响分流）
const rules = [
  // 自定义规则
  "DOMAIN-SUFFIX,lastpass.com,DIRECT",
  "DOMAIN-SUFFIX,pkgs.org,DIRECT",
  "DOMAIN-SUFFIX,arena.ai,AI",
  "DOMAIN-SUFFIX,chatgpt.com,AI",
  "DOMAIN-SUFFIX,openai.com,AI",
  "DOMAIN-SUFFIX,aistudio.google.com,AI",
  "DOMAIN-SUFFIX,generativelanguage.googleapis.com,AI",
  "DOMAIN-SUFFIX,daily-cloudcode-pa.googleapis.com,AI",
  "DOMAIN-SUFFIX,pkgs.org,DIRECT",
  "DOMAIN-SUFFIX,v2rayse.com,延时优选",
  "DOMAIN-SUFFIX,opencloudos.org,延时优选",
  "DOMAIN-SUFFIX,techpowerup.com,手动选择",
  "DOMAIN-SUFFIX,hf-mirror.com,DIRECT",

  // 规则集,规则集名称,代理组名称
  // AI
  "RULE-SET,openai,AI",
  "RULE-SET,gemini,AI",
  "RULE-SET,claude,AI",
  "RULE-SET,foreignailist,AI",
  // docker
  "RULE-SET,docker,容器服务",
  // TikTok
  "RULE-SET,tiktok,TikTok",
  // Google
  "DOMAIN-KEYWORD,google,谷歌服务",
  "RULE-SET,google,谷歌服务",
  // 微软
  "DOMAIN-KEYWORD,microsoft,微软服务",
  "RULE-SET,microsoft,微软服务",
  "RULE-SET,onedrive,微软服务",
  // YouTube
  "RULE-SET,youtube,YouTube",
  // 其他
  "RULE-SET,direct,DIRECT",
  "RULE-SET,private,DIRECT",
  "RULE-SET,lancidr,DIRECT,no-resolve",
  "RULE-SET,cncidr,DIRECT,no-resolve",
  "RULE-SET,applications,DIRECT",
  "RULE-SET,gfw,手动选择",
  // 其他规则
  "MATCH,漏网之鱼"
];

// 程序入口
function main(config) {
  const proxyCount = config?.proxies?.length ?? 0;
  // const proxyProviderCount = typeof config?.["proxy-providers"] === "object" ? Object.keys(config["proxy-providers"]).length : 0;
  const proxyProviderCount = Object.keys(config?.["proxy-providers"] ?? {}).length;

  if (proxyCount === 0 && proxyProviderCount === 0) {
    throw new Error("配置文件中未找到任何代理节点");
  }

  /*
  // 过滤掉 name 包含“剩余流量”或“套餐到期”等的代理，以及 name 中的替换字符串
  // 定义正则表达式
  const filterPattern = /(推荐|网址|导航|剩余|套餐|过期|到期|官网|官方|永久|域名|反诈|一元|重置|试用|地址|客服|付费|订阅)/i;

  if (Array.isArray(config.proxies)) {
    // 过滤掉正则匹配的代理
    config.proxies = config.proxies.filter(proxy => !filterPattern.test(proxy.name));
  }
  */

  // 从 config 对象中获取 proxies 属性,如果 config.proxies 存在且是有效的数组，则将其赋值给 proxies 变量；如果 config.proxies 不存在或为 undefined，则 proxies 将被赋值为空数组 []
  const proxies = config.proxies || [];
  if (proxies.length === 0) {
    throw new Error("处理后配置文件中未找到任何有效代理节点");
  }

  // 生成订阅配置
  const newConfig = {
    "dns": dnsConfig,
    "proxies": proxies,
    "proxy-groups": proxyGroups,
    "rule-providers": ruleProviders,
    "rules": rules
  };

  // 返回新的配置
  return newConfig;
}
