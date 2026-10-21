type FeeRow = {
  fee: string;
  amount: string;
  notes: string;
  url: string;
  historical?: boolean;
};

const sources = {
  bc: 'https://www.welcomebc.ca/immigrate-to-b-c/for-entrepreneurs-and-businesses',
  on: 'https://www.ontario.ca/page/ontario-immigrant-nominee-program-oinp',
  pei: 'https://www.princeedwardisland.ca/en/information/office-of-immigration/work-permit-stream',
  nl: 'https://www.gov.nl.ca/immigration/immigrating-to-newfoundland-and-labrador/provincial-nominee-program/entrepreneurs/international-entrepreneur/overview/',
  work: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/permit-outside/apply.html',
  biometrics: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/biometrics/how-to-give.html',
  pr: 'https://www.ircc.canada.ca/english/information/fees/fees.asp',
};

const en: FeeRow[] = [
  { fee: 'BC PNP — Entrepreneur registration', amount: '$300', notes: 'Per registration. Check official withdrawal and refund rules.', url: sources.bc },
  { fee: 'BC PNP — Entrepreneur application', amount: '$3,500', notes: 'May be refunded if withdrawn before the BC PNP begins assessing the application; see official conditions.', url: sources.bc },
  { fee: 'Ontario OINP — Entrepreneur application', amount: '$3,500 (historical)', notes: 'CLOSED stream. Historical fee only — not an application option for new candidates.', url: sources.on, historical: true },
  { fee: 'PEI — Work Permit Stream application', amount: '$10,000', notes: 'No EOI fee. Full refund if the file is not accepted; $7,500 refunded if declined or withdrawn before interview; generally non-refundable after interview. See official terms.', url: sources.pei },
  { fee: 'Newfoundland & Labrador — International Entrepreneur', amount: '$0', notes: 'No provincial application fee. Federal and document-related charges still apply.', url: sources.nl },
  { fee: 'IRCC — Work permit (per applicant)', amount: '$155', notes: 'Standard work permit processing fee, unless exempt; an additional $100 applies to open work permits where required.', url: sources.work },
  { fee: 'IRCC — Biometrics', amount: '$85 per person / $170 family maximum', notes: 'Only if required; a qualifying family must apply together. Temporary-resident biometrics are generally valid for 10 years, but PR biometrics rules differ.', url: sources.biometrics },
  { fee: 'IRCC — PNP permanent residence, principal applicant', amount: '$1,590', notes: '$990 processing + $600 Right of Permanent Residence Fee (RPRF), rates effective April 30, 2026.', url: sources.pr },
  { fee: 'IRCC — PNP permanent residence, spouse/partner', amount: '$1,590', notes: '$990 processing + $600 RPRF; RPRF may be paid later and may be refundable if an application is refused.', url: sources.pr },
  { fee: 'IRCC — PNP permanent residence, dependent child', amount: '$270 per child', notes: 'Per accompanying dependent child; no RPRF for dependent children.', url: sources.pr },
];

const fa: FeeRow[] = [
  { fee: 'ثبت اولیه کارآفرینی BC PNP', amount: '۳۰۰ دلار', notes: 'برای هر ثبت‌نام؛ شرایط رسمی انصراف و استرداد را بررسی کنید.', url: sources.bc },
  { fee: 'درخواست کارآفرینی BC PNP', amount: '۳٬۵۰۰ دلار', notes: 'در صورت انصراف پیش از آغاز ارزیابی پرونده توسط استان، ممکن است مسترد شود؛ طبق شرایط رسمی.', url: sources.bc },
  { fee: 'درخواست کارآفرینی انتاریو OINP', amount: '۳٬۵۰۰ دلار (تاریخی)', notes: 'این مسیر بسته است؛ مبلغ صرفاً تاریخی بوده و امکان درخواست جدید وجود ندارد.', url: sources.on, historical: true },
  { fee: 'درخواست مسیر مجوز کار جزیره پرنس ادوارد', amount: '۱۰٬۰۰۰ دلار', notes: 'ثبت EOI رایگان است؛ اگر پرونده پذیرفته نشود کل هزینه و در صورت رد یا انصراف قبل از مصاحبه ۷٬۵۰۰ دلار مسترد می‌شود؛ پس از مصاحبه معمولاً غیرقابل‌استرداد است.', url: sources.pei },
  { fee: 'کارآفرین بین‌المللی نیوفاندلند و لابرادور', amount: '۰ دلار', notes: 'درخواست استانی رایگان است؛ هزینه‌های فدرال و تهیه مدارک جداگانه‌اند.', url: sources.nl },
  { fee: 'IRCC — مجوز کار (هر نفر)', amount: '۱۵۵ دلار', notes: 'هزینه استاندارد بررسی مجوز کار، مگر در موارد معافیت؛ مجوز کار باز در صورت لزوم ۱۰۰ دلار اضافه دارد.', url: sources.work },
  { fee: 'IRCC — بیومتریک', amount: '۸۵ دلار هر نفر / سقف ۱۷۰ دلار خانواده', notes: 'در صورت نیاز؛ سقف خانوادگی برای اعضای واجد شرایط با درخواست هم‌زمان است. اعتبار معمول بیومتریک اقامت موقت ۱۰ سال است ولی مقررات اقامت دائم متفاوت است.', url: sources.biometrics },
  { fee: 'IRCC — اقامت دائم PNP، متقاضی اصلی', amount: '۱٬۵۹۰ دلار', notes: '۹۹۰ دلار بررسی پرونده + ۶۰۰ دلار حق اقامت دائم (RPRF)، از ۳۰ آوریل ۲۰۲۶.', url: sources.pr },
  { fee: 'IRCC — اقامت دائم PNP، همسر/شریک زندگی', amount: '۱٬۵۹۰ دلار', notes: '۹۹۰ دلار بررسی پرونده + ۶۰۰ دلار RPRF؛ حق اقامت دائم می‌تواند دیرتر پرداخت شود و در صورت رد پرونده قابل‌استرداد است.', url: sources.pr },
  { fee: 'IRCC — اقامت دائم PNP، هر فرزند وابسته', amount: '۲۷۰ دلار به‌ازای هر فرزند', notes: 'برای هر فرزند وابسته همراه؛ حق اقامت دائم RPRF به فرزند وابسته تعلق نمی‌گیرد.', url: sources.pr },
];

export default function GovernmentFeeSchedule({ lang }: { lang: string }) {
  const persian = lang === 'fa';
  const rows = persian ? fa : en;
  return (
    <section id="pnp-government-fees" className="mx-auto w-full max-w-7xl px-4 py-12 lg:py-20" dir={persian ? 'rtl' : 'ltr'}>
      <header className="mb-7 text-center">
        <h2 className="font-header text-2xl font-bold text-gray-800 md:text-3xl">
          {persian ? 'جدول هزینه‌های دولتی مهاجرت کارآفرینی (۲۰۲۶)' : 'Government Fee Schedule (Approximate, 2026)'}
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-gray-600 md:text-base">
          {persian ? 'مبالغ به دلار کانادا و برای برنامه‌ریزی اولیه بودجه هستند. پرداخت واقعی به مسیر انتخابی، اعضای خانواده و شرایط پرونده بستگی دارد.' : 'Amounts are in CAD and intended for preliminary budgeting. Actual fees depend on your stream, family size and application circumstances.'}
        </p>
      </header>
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full min-w-[760px] border-collapse text-sm text-gray-700">
          <thead className="bg-gray-800 text-white">
            <tr>
              {(persian ? ['عنوان هزینه', 'مبلغ (دلار کانادا)', 'توضیحات'] : ['Fee', 'Amount (CAD)', 'Notes']).map((head) => (
                <th key={head} scope="col" className="px-4 py-4 text-start font-semibold">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className={`${row.historical ? 'bg-amber-50' : index % 2 ? 'bg-gray-50' : 'bg-white'} border-t border-gray-200 align-top`}>
                <th scope="row" className="w-[34%] px-4 py-4 text-start font-semibold">
                  <a href={row.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900">{row.fee} <span aria-hidden="true">↗</span></a>
                  {row.historical && <span className="mt-2 block w-fit rounded bg-amber-100 px-2 py-1 text-xs font-bold text-amber-900">{persian ? 'برنامه بسته' : 'CLOSED STREAM'}</span>}
                </th>
                <td className="w-[25%] px-4 py-4 font-semibold">{row.amount}</td>
                <td className="px-4 py-4 leading-6">{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5 md:p-6">
        <h3 className="text-lg font-bold text-gray-800">{persian ? 'نمونه بودجه: متقاضی مجرد در مسیر BC Base' : 'Example budget: single applicant, BC Base'}</h3>
        <p className="mt-2 text-sm leading-7 text-gray-700">
          {persian ? '۳۰۰ دلار ثبت اولیه + ۳٬۵۰۰ دلار درخواست استانی + ۱۵۵ دلار مجوز کار + ۸۵ دلار بیومتریک + ۱٬۵۹۰ دلار اقامت دائم = حدود ۵٬۶۳۰ دلار کانادا هزینه دولتی.' : '$300 registration + $3,500 provincial application + $155 work permit + $85 biometrics + $1,590 permanent residence = approximately CAD $5,630 in government fees.'}
        </p>
        <p className="mt-3 text-sm leading-7 text-gray-600">
          {persian ? 'این مثال فرض می‌کند تمام این هزینه‌ها برای متقاضی لازم باشد؛ ممکن است بیومتریک جدید یا برخی پرداخت‌ها لازم نباشد. سرمایه‌گذاری تجاری، خدمات بررسی دارایی، معاینات پزشکی، آزمون زبان، ترجمه، سفر و حق‌الزحمه مشاوران در این مبلغ نیست.' : 'This example assumes all listed charges are applicable; some applicants may not need new biometrics or certain payments. Business investment, net-worth verification, medical exams, language testing, translations, travel and professional fees are excluded.'}
        </p>
      </div>
      <p className="mt-4 text-sm leading-7 text-gray-600">
        {persian ? 'آخرین بررسی: ۲۱ اکتبر ۲۰۲۶. تعرفه‌ها و مقررات استرداد ممکن است بدون اطلاع تغییر کنند؛ پیش از پرداخت، مبلغ و شرایط را از لینک رسمی هر ردیف بررسی کنید. این جدول مشاوره حقوقی یا مهاجرتی نیست.' : 'Last reviewed: October 21, 2026. Fees and refund policies can change without notice. Confirm the current amount and terms using the official links in each row before paying. This table is not immigration or legal advice.'}
      </p>
    </section>
  );
}
