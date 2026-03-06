#!/usr/bin/env node
/**
 * Inject JSON-LD schema into all landing pages
 * Adds: FAQPage, RealEstateListing, Organization, BreadcrumbList
 */
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://paulvu.github.io/hiep-phuoc-premia';
const ROOT = path.join(__dirname, '..');

const commonFAQ = [
  { q: "Hiệp Phước Premia ở đâu?", a: "Hiệp Phước Premia tọa lạc tại mặt tiền đường Nguyễn Văn Tạo nối dài, xã Phước Vĩnh Đông, huyện Cần Giuộc, tỉnh Long An — giáp ranh huyện Nhà Bè, TP.HCM." },
  { q: "Hiệp Phước Premia có sổ đỏ riêng không?", a: "Có. Mỗi nền đất tại Hiệp Phước Premia được cấp sổ đỏ riêng (Giấy chứng nhận quyền sử dụng đất), sở hữu vĩnh viễn." },
  { q: "Giá đất nền Hiệp Phước Premia bao nhiêu?", a: "Giá đất nền Hiệp Phước Premia dao động tùy vị trí và diện tích. Liên hệ hotline 0878 349 899 hoặc Zalo để nhận bảng giá chi tiết mới nhất." },
  { q: "Hiệp Phước Premia có được vay ngân hàng không?", a: "Có. Ngân hàng VietinBank, ACB, MB hỗ trợ vay đến 70% giá trị nền, thanh toán giãn 12-24 tháng." },
  { q: "Chủ đầu tư Hiệp Phước Premia là ai?", a: "Chủ đầu tư là Hai Thành Group — đơn vị có track record phát triển Saigon Village, Hiệp Phước Harbour View Giai Đoạn 1, The 826 EC." },
  { q: "Hiệp Phước Premia cách TP.HCM bao xa?", a: "Dự án giáp trực tiếp huyện Nhà Bè (TP.HCM), chỉ cách 1 con rạch. Đến Phú Mỹ Hưng Q7 khoảng 20-30 phút, Quận 1 khoảng 25 phút." }
];

const schemas = {
  faq: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": commonFAQ.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  },
  realEstate: {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": "Hiệp Phước Premia — Khu Đô Thị Sinh Thái 50ha",
    "description": "Đất nền sổ đỏ riêng 50ha ven sông Soài Rạp, giáp Nhà Bè TP.HCM. CĐT Hai Thành Group.",
    "url": BASE_URL,
    "image": "https://premia.vn/wp-content/uploads/2026/01/phoi-canh-hiep-phuoc-premia.jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Mặt tiền Nguyễn Văn Tạo nối dài",
      "addressLocality": "Cần Giuộc",
      "addressRegion": "Long An",
      "addressCountry": "VN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "10.5890",
      "longitude": "106.7140"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "VND"
    }
  },
  org: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hiệp Phước Premia",
    "url": BASE_URL,
    "logo": "https://premia.vn/wp-content/uploads/2026/03/logo-hiep-phuoc-premia.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+84-878-349-899",
      "contactType": "sales",
      "availableLanguage": "Vietnamese"
    },
    "sameAs": ["https://premia.vn"]
  }
};

const files = [
  'index.html',
  'v2-realestate.html',
  'v3-luxury.html',
  'v4-airbnb.html',
  'v5-editorial.html',
  'v6-dark.html',
  'v7-calculator.html'
];

let count = 0;
files.forEach(file => {
  const fp = path.join(ROOT, file);
  let html = fs.readFileSync(fp, 'utf8');

  // Skip if already has schema
  if (html.includes('application/ld+json')) {
    console.log(`⏩ ${file} — already has schema`);
    return;
  }

  const schemaBlock = `
<!-- Schema.org Structured Data for SEO + LLM -->
<script type="application/ld+json">${JSON.stringify(schemas.faq)}</script>
<script type="application/ld+json">${JSON.stringify(schemas.realEstate)}</script>
<script type="application/ld+json">${JSON.stringify(schemas.org)}</script>
`;

  // Inject before </head>
  html = html.replace('</head>', schemaBlock + '</head>');
  fs.writeFileSync(fp, html);
  count++;
  console.log(`✅ ${file} — schema injected`);
});

console.log(`\n🚀 Done! Injected schema into ${count} files`);
