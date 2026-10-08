'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import TextArea from '@/components/common/TextArea';
import FormTitle from '@/components/common/form/FormTitle';
import Input from '@/components/common/form/Input';
import ButtonRefactor from '@/components/common/ButtonRefactor';
import { submitContactForm } from '../../pages/api/contact-us';

type Fields = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
};

type Labels = {
  formTitle: string;
  formSubtitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
  firstNameRequired: string;
  lastNameRequired: string;
  emailRequired: string;
  phoneNumberRequired: string;
  messageRequired: string;
  sendButton: string;
  sendingButton: string;
  successMessage: string;
  failedMessage: string;
};

export default function AffiliateContactForm({ affiliateName, affiliateSlug, labels }: {
  affiliateName: string;
  affiliateSlug: string;
  labels: Labels;
}) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Fields>({
    mode: 'onBlur',
    defaultValues: { firstName: '', lastName: '', email: '', phoneNumber: '', message: '' }
  });
  const [result, setResult] = useState<'success' | 'error' | null>(null);

  const onSubmit = async (form: Fields) => {
    setResult(null);
    const data = new FormData();
    data.append('name', `${form.firstName.trim()} ${form.lastName.trim()}`.trim());
    data.append('email', form.email.trim());
    data.append('number', form.phoneNumber.trim());
    data.append('subject', `Affiliate inquiry: ${affiliateName}`.slice(0, 500));
    data.append('message', `[Affiliate: ${affiliateName} | ${affiliateSlug}]\n\n${form.message.trim()}`);
    try {
      // Reuse an existing, registered Django route (not the missing /contact-profile endpoint).
      const response = await submitContactForm(data);
      if (!response || response.status < 200 || response.status >= 300) throw new Error('Contact submission failed');
      setResult('success');
      reset();
    } catch {
      setResult('error');
    }
  };

  return (
    <div className="flex w-full flex-col items-center md:items-start">
      <div className="h-[75px] w-full md:h-[125px]">
        <FormTitle formTitle={labels.formTitle} formSubtitle={labels.formSubtitle} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full pt-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Input id="affiliate-first-name" nameInput="firstName" register={register} errors={errors} type="text"
            label={labels.firstName} required={labels.firstNameRequired} patternValue="" patternMessage=""
            placeholder={labels.firstName} className="input col-span-1 mb-1 w-full" />
          <Input id="affiliate-last-name" nameInput="lastName" register={register} errors={errors} type="text"
            label={labels.lastName} required={labels.lastNameRequired} patternValue="" patternMessage=""
            placeholder={labels.lastName} className="input col-span-1 mb-1 w-full" />
          <Input id="affiliate-email" nameInput="email" register={register} errors={errors} type="email"
            label={labels.email} required={labels.emailRequired} patternValue="^[^\s@]+@[^\s@]+\.[^\s@]+$" patternMessage={labels.emailRequired}
            placeholder="name@example.com" className="input col-span-1 mb-1 w-full" />
          <Input id="affiliate-phone" nameInput="phoneNumber" register={register} errors={errors} type="tel"
            label={labels.phoneNumber} required={labels.phoneNumberRequired} patternValue="" patternMessage=""
            placeholder={labels.phoneNumber} className="input col-span-1 mb-1 w-full" />
        </div>
        <TextArea title={labels.message} register={register} errors={errors} required={labels.messageRequired}
          nameTextArea="message" patternValue="" patternMessage="" placeholder={labels.message}
          maxLength={1300} maxLengthMessage="1300 characters maximum" validate="" />
        <div className="mx-auto mt-8 pb-2">
          <ButtonRefactor type="submit" text={isSubmitting ? labels.sendingButton : labels.sendButton} disabled={isSubmitting} />
        </div>
        {result && (
          <p role="status" aria-live="polite"
            className={`mx-auto mt-5 max-w-xl rounded-lg p-4 text-center text-sm ${result === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {result === 'success' ? labels.successMessage : labels.failedMessage}
          </p>
        )}
      </form>
    </div>
  );
}
