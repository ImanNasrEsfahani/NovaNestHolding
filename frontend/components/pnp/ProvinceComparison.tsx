type Stream = {
  province: string;
  stream: string;
  investment: string;
  netWorth: string;
  language: string;
  jobs: string;
  notes: string;
  url: string;
  closed?: boolean;
};

const official = {
  bc: 'https://www.welcomebc.ca/immigrate-to-b-c/for-entrepreneurs-and-businesses',
  on: 'https://www.ontario.ca/page/ontario-immigrant-nominee-program-oinp',
  mb: 'https://immigratemanitoba.com/mpnp/bis/ep/eligibility/',
  sk: 'https://www.saskatchewan.ca/residents/moving-to-saskatchewan/live-in-saskatchewan/by-immigrating/saskatchewan-immigrant-nominee-program/browse-sinp-programs/entrepreneur/applicants-entrepreneurs',
  nb: 'https://www.gnb.ca/en/topic/family-home-community/immigration/provincial-nominee-program/business-immigration-stream.html',
  pei: 'https://www.princeedwardisland.ca/en/information/office-of-immigration/work-permit-stream',
  nl: 'https://www.gov.nl.ca/immigration/immigrating-to-newfoundland-and-labrador/provincial-nominee-program/entrepreneurs/international-entrepreneur/eligibility-criteria/',
};

const en: Stream[] = [
  { province: 'British Columbia', stream: 'Base', investment: '$200,000', netWorth: '$600,000', language: 'CLB 4', jobs: '1 full-time', notes: 'New business or purchase and expansion of an existing business; at least 33.33% ownership; eligible anywhere in B.C.', url: official.bc },
  { province: 'British Columbia', stream: 'Regional', investment: '$100,000', netWorth: '$300,000', language: 'CLB 4', jobs: '1 full-time', notes: 'New business in a participating regional community; community referral and exploratory visit required; at least 51% ownership.', url: official.bc },
  { province: 'Ontario', stream: 'Inside Greater Toronto Area (historical)', investment: 'CLOSED', netWorth: 'CLOSED', language: '—', jobs: '—', notes: 'Entrepreneur Stream closed to new applicants in November 2024. Historical thresholds were $600,000 investment and $800,000 net worth; not currently available.', url: official.on, closed: true },
  { province: 'Ontario', stream: 'Outside GTA / eligible ICT (historical)', investment: 'CLOSED', netWorth: 'CLOSED', language: '—', jobs: '—', notes: 'Entrepreneur Stream closed to new applicants. Historical lower thresholds were $200,000 investment and $400,000 net worth; not currently available.', url: official.on, closed: true },
  { province: 'Manitoba', stream: 'Winnipeg Metropolitan Region', investment: '$250,000', netWorth: '$500,000', language: 'CLB 5', jobs: '1 full-time job created or maintained', notes: 'Entrepreneur Pathway; at least 3 years of qualifying business ownership or senior management experience in the last 5 years; net-worth verification and EOI assessment.', url: official.mb },
  { province: 'Manitoba', stream: 'Outside Winnipeg Metropolitan Region', investment: '$150,000', netWorth: '$500,000', language: 'CLB 5', jobs: '1 full-time job created or maintained', notes: 'Same Entrepreneur Pathway; lower investment threshold for an eligible business outside the Winnipeg Metropolitan Region.', url: official.mb },
  { province: 'Saskatchewan', stream: 'Entrepreneur / Farm', investment: 'CLOSED', netWorth: 'CLOSED', language: '—', jobs: '—', notes: 'Permanently closed March 27, 2025. No new applications, EOIs or invitations. Previously submitted applications may continue processing.', url: official.sk, closed: true },
  { province: 'New Brunswick', stream: 'Business Immigration', investment: '$150,000', netWorth: '$500,000 (agriculture: $300,000)', language: 'CLB 4', jobs: '1 full-time', notes: 'Current stream replaces the old Entrepreneurial Stream. Age 19–59; 65/100 points; at least 2 years of qualifying experience in the last 5; provincial application fee $2,000.', url: official.nb },
  { province: 'Prince Edward Island', stream: 'Work Permit', investment: '$150,000', netWorth: '$600,000', language: 'CLB 4', jobs: 'See performance agreement', notes: 'Operate and manage an eligible PEI business; business-performance conditions and work permit requirements apply. Check current intake with PEI.', url: official.pei },
  { province: 'Newfoundland & Labrador', stream: 'International Entrepreneur', investment: '$200,000', netWorth: '$600,000', language: 'CLB 5', jobs: '1 full-time', notes: 'Generally age 21–59; invest at least $200,000 with 33.3% ownership, or $1 million equity; qualifying business experience required.', url: official.nl },
];

const fa: Stream[] = [
  { province: 'بریتیش کلمبیا', stream: 'پایه (Base)', investment: '۲۰۰٬۰۰۰ دلار', netWorth: '۶۰۰٬۰۰۰ دلار', language: 'CLB 4', jobs: '۱ شغل تمام‌وقت', notes: 'راه‌اندازی کسب‌وکار جدید یا خرید و توسعه کسب‌وکار موجود؛ حداقل ۳۳٫۳۳٪ مالکیت؛ در سراسر استان.', url: official.bc },
  { province: 'بریتیش کلمبیا', stream: 'منطقه‌ای (Regional)', investment: '۱۰۰٬۰۰۰ دلار', netWorth: '۳۰۰٬۰۰۰ دلار', language: 'CLB 4', jobs: '۱ شغل تمام‌وقت', notes: 'فقط کسب‌وکار جدید در جوامع منطقه‌ای مشارکت‌کننده؛ معرفی‌نامه جامعه و بازدید اکتشافی الزامی؛ حداقل ۵۱٪ مالکیت.', url: official.bc },
  { province: 'انتاریو', stream: 'داخل منطقه تورنتوی بزرگ (تاریخی)', investment: 'بسته', netWorth: 'بسته', language: '—', jobs: '—', notes: 'مسیر کارآفرینی از نوامبر ۲۰۲۴ برای درخواست‌های جدید بسته است. حداقل‌های تاریخی: ۶۰۰٬۰۰۰ دلار سرمایه‌گذاری و ۸۰۰٬۰۰۰ دلار دارایی خالص؛ در حال حاضر قابل درخواست نیست.', url: official.on, closed: true },
  { province: 'انتاریو', stream: 'خارج از GTA / فناوری واجد شرایط (تاریخی)', investment: 'بسته', netWorth: 'بسته', language: '—', jobs: '—', notes: 'مسیر کارآفرینی بسته است. حداقل‌های تاریخی: ۲۰۰٬۰۰۰ دلار سرمایه‌گذاری و ۴۰۰٬۰۰۰ دلار دارایی خالص؛ در حال حاضر قابل درخواست نیست.', url: official.on, closed: true },
  { province: 'منیتوبا', stream: 'منطقه شهری وینیپگ', investment: '۲۵۰٬۰۰۰ دلار', netWorth: '۵۰۰٬۰۰۰ دلار', language: 'CLB 5', jobs: 'ایجاد یا حفظ ۱ شغل تمام‌وقت', notes: 'مسیر کارآفرینی؛ حداقل ۳ سال سابقه واجد شرایط مالکیت یا مدیریت ارشد در ۵ سال اخیر؛ بررسی دارایی و ارزیابی EOI.', url: official.mb },
  { province: 'منیتوبا', stream: 'خارج از منطقه شهری وینیپگ', investment: '۱۵۰٬۰۰۰ دلار', netWorth: '۵۰۰٬۰۰۰ دلار', language: 'CLB 5', jobs: 'ایجاد یا حفظ ۱ شغل تمام‌وقت', notes: 'همان مسیر کارآفرینی با حداقل سرمایه‌گذاری کمتر برای کسب‌وکار واجد شرایط خارج از منطقه شهری وینیپگ.', url: official.mb },
  { province: 'ساسکاچوان', stream: 'کارآفرینی / کشاورزی', investment: 'بسته', netWorth: 'بسته', language: '—', jobs: '—', notes: 'از ۲۷ مارس ۲۰۲۵ برای همیشه بسته شده؛ درخواست جدید، EOI و دعوت‌نامه جدید پذیرفته نمی‌شود. پرونده‌های قبلی ممکن است ادامه یابند.', url: official.sk, closed: true },
  { province: 'نیوبرانزویک', stream: 'مهاجرت تجاری (Business Immigration)', investment: '۱۵۰٬۰۰۰ دلار', netWorth: '۵۰۰٬۰۰۰ دلار (کشاورزی: ۳۰۰٬۰۰۰)', language: 'CLB 4', jobs: '۱ شغل تمام‌وقت', notes: 'جایگزین مسیر کارآفرینی قدیمی؛ سن ۱۹ تا ۵۹ سال؛ حداقل ۶۵ امتیاز؛ ۲ سال سابقه واجد شرایط در ۵ سال اخیر؛ هزینه درخواست استانی ۲٬۰۰۰ دلار.', url: official.nb },
  { province: 'جزیره پرنس ادوارد', stream: 'مجوز کار (Work Permit)', investment: '۱۵۰٬۰۰۰ دلار', netWorth: '۶۰۰٬۰۰۰ دلار', language: 'CLB 4', jobs: 'طبق توافق‌نامه عملکرد', notes: 'مدیریت فعال کسب‌وکار واجد شرایط؛ تعهدات عملکردی و شرایط مجوز کار لازم است. وضعیت پذیرش جاری را از استان بررسی کنید.', url: official.pei },
  { province: 'نیوفاندلند و لابرادور', stream: 'کارآفرین بین‌المللی', investment: '۲۰۰٬۰۰۰ دلار', netWorth: '۶۰۰٬۰۰۰ دلار', language: 'CLB 5', jobs: '۱ شغل تمام‌وقت', notes: 'عموماً سن ۲۱ تا ۵۹ سال؛ دست‌کم ۲۰۰٬۰۰۰ دلار سرمایه‌گذاری و ۳۳٫۳٪ مالکیت یا یک میلیون دلار سرمایه سهامی؛ سابقه تجاری واجد شرایط.', url: official.nl },
];

export default function ProvinceComparison({ lang }: { lang: string }) {
  const persian = lang === 'fa';
  const rows = persian ? fa : en;
  const headers = persian
    ? ['استان / مسیر', 'حداقل سرمایه‌گذاری (CAD)', 'حداقل دارایی خالص (CAD)', 'زبان', 'ایجاد شغل', 'شرایط کلیدی']
    : ['Province / Stream', 'Minimum Investment (CAD)', 'Minimum Net Worth (CAD)', 'Language', 'Job Creation', 'Key Conditions & Notes'];

  return (
    <section id="pnp-province-comparison" className="mx-auto w-full max-w-7xl px-4 py-12 lg:py-20" dir={persian ? 'rtl' : 'ltr'}>
      <div className="mb-7 text-center">
        <h2 className="font-header text-2xl font-bold text-gray-800 md:text-3xl">
          {persian ? 'مقایسه برنامه‌های کارآفرینی استانی کانادا' : 'Province-by-Province Entrepreneur Stream Comparison'}
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-gray-600 md:text-base">
          {persian ? 'شرایط حداقلی مسیرهای منتخب را مقایسه کنید. وضعیت بسته بودن برنامه‌ها به‌صورت مشخص نشان داده شده است.' : 'Compare minimum requirements across selected entrepreneur immigration streams. Closed pathways are explicitly identified.'}
        </p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full min-w-[1050px] border-collapse text-sm text-gray-700">
          <thead className="bg-gray-800 text-white"><tr>{headers.map((h) => <th key={h} scope="col" className="px-4 py-4 text-start font-semibold">{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={`${r.url}-${i}`} className={`${r.closed ? 'bg-amber-50' : i % 2 ? 'bg-gray-50' : 'bg-white'} border-t border-gray-200 align-top`}>
                <th scope="row" className="min-w-[180px] px-4 py-4 text-start font-semibold">
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900">{r.province} <span aria-hidden="true">↗</span></a>
                  <span className="mt-1 block font-normal text-gray-600">{r.stream}</span>
                  {r.closed && <span className="mt-2 inline-block rounded bg-amber-100 px-2 py-1 text-xs font-bold text-amber-900">{persian ? 'بسته' : 'CLOSED'}</span>}
                </th>
                <td className="px-4 py-4 whitespace-nowrap" dir="ltr">{r.investment}</td>
                <td className="px-4 py-4" dir="ltr">{r.netWorth}</td>
                <td className="px-4 py-4 whitespace-nowrap" dir="ltr">{r.language}</td>
                <td className="px-4 py-4">{r.jobs}</td>
                <td className="min-w-[310px] px-4 py-4 leading-6">{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm leading-7 text-gray-600">
        {persian ? 'آخرین بررسی: ۲۱ اکتبر ۲۰۲۶. مبالغ به دلار کانادا هستند؛ شرایط، سهمیه‌ها و پذیرش‌ها ممکن است تغییر کنند. پیش از اقدام، لینک رسمی هر استان را بررسی کنید. ارقام تاریخی برنامه‌های بسته، شرایط درخواست فعلی نیستند.' : 'Last reviewed: October 21, 2026. All amounts are in Canadian dollars. Requirements, intake and quotas can change; verify the linked official provincial page before applying. Historical thresholds for closed streams are not current application options.'}
      </p>
    </section>
  );
}
