type ProcessStage = {
  title: string;
  timeframe?: string;
  description: string;
};

const stagesEn: ProcessStage[] = [
  {
    title: 'Eligibility assessment & stream selection',
    timeframe: '2–4 weeks',
    description: 'We review your net worth, experience, language level and business idea, and match you to the province and stream with the highest chance of success.',
  },
  {
    title: 'Business plan & document preparation',
    timeframe: '1–3 months',
    description: 'A comprehensive, province-compliant business plan is written; net-worth evidence, source-of-funds trail, experience proof and civil documents are assembled.',
  },
  {
    title: 'Expression of Interest / registration',
    timeframe: 'Fees vary by province',
    description: "Your profile enters the province's selection pool (typical pool validity: 6–12 months). Higher-scoring candidates are invited first.",
  },
  {
    title: 'Invitation to apply',
    description: 'The province invites you to submit a full application. In most streams this triggers the net-worth verification step.',
  },
  {
    title: 'Net-worth verification by an authorized firm',
    timeframe: 'Up to 60 days',
    description: 'An independent accounting firm designated by the province verifies your personal net worth and the legal source of your funds. Start immediately upon invitation.',
  },
  {
    title: 'Full provincial application',
    timeframe: 'Usually due within 120 days of invitation; decision ~4 months',
    description: 'Business plan, verification report and all supporting documents are submitted with the provincial application fee. An interview may be required.',
  },
  {
    title: 'Work permit',
    timeframe: "Apply within ~90 days of the province's support letter",
    description: 'With the province’s Letter of Support you apply to IRCC for an entrepreneur work permit ($155 + $85 biometrics). You must land and start the business within the period the province allows.',
  },
  {
    title: 'Operate the business',
    timeframe: '12–20 months depending on province',
    description: 'You invest, hire the required Canadian workers, and actively manage the business under a signed Performance Agreement with the province.',
  },
  {
    title: 'Final report → provincial nomination',
    timeframe: 'Decision ~4 months',
    description: 'You submit evidence that you met every term of the Performance Agreement. If satisfied, the province issues your Confirmation of Nomination.',
  },
  {
    title: 'Federal permanent residence application',
    timeframe: 'Paper-based PNP stream',
    description: 'You apply to IRCC for PR as a provincial nominee. Include police certificates and medicals. Then — permanent residence for you and your family.',
  },
];

const stagesFa: ProcessStage[] = [
  {
    title: 'ارزیابی شرایط و انتخاب مسیر مناسب',
    timeframe: '۲ تا ۴ هفته',
    description: 'دارایی خالص، سابقه حرفه‌ای، سطح زبان و ایده کسب‌وکار شما را بررسی می‌کنیم و متناسب با شرایطتان، استان و مسیری را انتخاب می‌کنیم که بیشترین شانس موفقیت را داشته باشد.',
  },
  {
    title: 'تدوین طرح کسب‌وکار و آماده‌سازی مدارک',
    timeframe: '۱ تا ۳ ماه',
    description: 'طرح کسب‌وکاری جامع و مطابق الزامات استان تهیه می‌شود؛ مدارک دارایی خالص، مستندات منشأ قانونی وجوه، سوابق کاری و مدیریتی و مدارک هویتی و مدنی گردآوری می‌شوند.',
  },
  {
    title: 'ثبت ابراز علاقه (EOI) / نام‌نویسی',
    timeframe: 'هزینه‌ها بسته به استان متفاوت است',
    description: 'پروفایل شما وارد فهرست انتخاب استان می‌شود (اعتبار معمول حضور در این فهرست ۶ تا ۱۲ ماه است). متقاضیان دارای امتیاز بالاتر زودتر دعوت می‌شوند.',
  },
  {
    title: 'دریافت دعوت‌نامه برای ارائه درخواست',
    description: 'استان از شما دعوت می‌کند درخواست کامل خود را ثبت کنید. در بیشتر مسیرها، این مرحله آغاز فرایند راستی‌آزمایی دارایی خالص است.',
  },
  {
    title: 'راستی‌آزمایی دارایی خالص توسط مؤسسه مجاز',
    timeframe: 'حداکثر ۶۰ روز',
    description: 'یک مؤسسه حسابداری مستقل و مورد تأیید استان، دارایی خالص شخصی و منشأ قانونی سرمایه شما را بررسی می‌کند. این فرایند را بلافاصله پس از دریافت دعوت‌نامه آغاز کنید.',
  },
  {
    title: 'ثبت درخواست کامل استانی',
    timeframe: 'معمولاً تا ۱۲۰ روز پس از دعوت؛ تصمیم‌گیری حدود ۴ ماه',
    description: 'طرح کسب‌وکار، گزارش راستی‌آزمایی و تمامی مدارک پشتیبان همراه با پرداخت هزینه درخواست استانی ارائه می‌شوند. ممکن است مصاحبه نیز لازم باشد.',
  },
  {
    title: 'دریافت مجوز کار',
    timeframe: 'درخواست ظرف حدود ۹۰ روز از نامه حمایتی استان',
    description: 'با نامه حمایتی استان (Letter of Support)، برای مجوز کار کارآفرینی به اداره مهاجرت کانادا (IRCC) درخواست می‌دهید (۱۵۵ دلار هزینه مجوز کار به‌علاوه ۸۵ دلار بیومتریک). باید در بازه زمانی تعیین‌شده توسط استان وارد کانادا شوید و فعالیت کسب‌وکار را آغاز کنید.',
  },
  {
    title: 'راه‌اندازی و اداره کسب‌وکار',
    timeframe: '۱۲ تا ۲۰ ماه، بسته به استان',
    description: 'طبق توافق‌نامه عملکرد (Performance Agreement) امضاشده با استان، سرمایه‌گذاری می‌کنید، نیروی کار کانادایی موردنیاز را استخدام می‌کنید و شخصاً مدیریت فعال کسب‌وکار را بر عهده می‌گیرید.',
  },
  {
    title: 'گزارش نهایی ← نامزدی استانی',
    timeframe: 'تصمیم‌گیری حدود ۴ ماه',
    description: 'مدارکی ارائه می‌کنید که نشان دهد همه تعهدات توافق‌نامه عملکرد را انجام داده‌اید. در صورت تأیید استان، گواهی نامزدی استانی (Confirmation of Nomination) صادر می‌شود.',
  },
  {
    title: 'درخواست اقامت دائم فدرال',
    timeframe: 'مسیر کاغذی PNP',
    description: 'به‌عنوان نامزد استانی، درخواست اقامت دائم خود را به IRCC ارائه می‌کنید و گواهی‌های عدم سوءپیشینه و معاینات پزشکی را نیز ضمیمه می‌کنید. در پایان، شما و خانواده‌تان می‌توانید اقامت دائم کانادا را دریافت کنید.',
  },
];

export default function PnpEntrepreneurTimeline({ lang }: { lang: string }) {
  const persian = lang === 'fa';
  const stages = persian ? stagesFa : stagesEn;

  return (
    <section
      id="pnp-entrepreneur-process"
      aria-labelledby="pnp-entrepreneur-process-heading"
      dir={persian ? 'rtl' : 'ltr'}
      className="mx-auto w-full max-w-7xl px-4 py-12 lg:py-20"
    >
      <header className="mx-auto mb-10 max-w-4xl text-center">
        <h2 id="pnp-entrepreneur-process-heading" className="font-header text-2xl font-bold text-gray-800 md:text-3xl">
          {persian ? 'مراحل گام‌به‌گام برنامه کارآفرینی استانی (PNP)' : 'Step-by-Step PNP Entrepreneur Process'}
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-gray-600 md:text-base">
          {persian
            ? 'مسیر کامل از ارزیابی اولیه تا دریافت اقامت دائم را پیش از شروع فرایند بشناسید.'
            : 'See the full journey, from initial eligibility review to permanent residence, before you commit.'}
        </p>
      </header>

      <ol className="mx-auto max-w-5xl">
        {stages.map((stage, index) => (
          <li key={index} className="flex items-stretch gap-3 sm:gap-5">
            <div aria-hidden="true" className="flex w-10 shrink-0 flex-col items-center sm:w-12">
              <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white shadow-sm sm:h-12 sm:w-12 sm:text-base">
                {String(index + 1).padStart(2, '0')}
              </span>
              {index < stages.length - 1 && (
                <span className="my-1.5 w-0.5 flex-1 rounded-full bg-emerald-200" />
              )}
            </div>

            <div className="mb-5 min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm sm:px-6 sm:py-5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                {persian ? `مرحله ${index + 1}` : `Stage ${index + 1}`}
              </p>
              <h3 className="font-header text-lg font-bold leading-7 text-gray-800 sm:text-xl">
                {stage.title}
              </h3>
              {stage.timeframe && (
                <p className="mt-2 text-sm font-semibold leading-6 text-emerald-800">
                  {stage.timeframe}
                </p>
              )}
              <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
                {stage.description}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mx-auto mt-4 max-w-5xl rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm leading-7 text-gray-800 sm:text-base">
        <strong>{persian ? 'زمان واقع‌بینانه کل فرایند:' : 'Overall realistic timeline:'}</strong>{' '}
        {persian
          ? 'حدود ۲ تا ۳ سال از ثبت اولیه تا دریافت اقامت دائم، بسته به استان و زمان برگزاری دوره‌های انتخاب.'
          : 'approximately 2–3 years from registration to permanent residence, depending on the province and draw timing.'}
      </p>
    </section>
  );
}
