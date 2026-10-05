import * as React from 'react';
// import Input from '@/components/common/form/Input';
import { getServerTranslation } from 'app/i18n';

import PersonalInfoInput from '@/components/common/form/PersonalInfoInput';

export default function StartupFormPersonalInformation({
    lang,
    register,
    errors
  }: {
    lang: string;
    register: any;
    errors: any;

    countries: any;
    countryName: string;
    countryNameRequired: string;
    countryNamePlaceholder: string;
    provinceOfResidence: string;
    provinceOfResidenceRequired: string;
    provinceOfResidencePlaceholder: string;
    cityOfResidence: string;
    cityOfResidenceRequired: string;
    cityOfResidencePlaceholder: string;
  }) {

  const { t } = getServerTranslation(lang, 'formComponent');
  const { t: tCountry } = getServerTranslation(lang, 'countryInput');

  return (
    <>
      <div className="mb-8 grid grid-cols-1 gap-6 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
        <PersonalInfoInput
          register={register}
          errors={errors}
          nameInputs={{
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'email',
            phoneNumber: 'phoneNumber',
            countryOfResidence: 'countryOfResidence',
            provinceOfResidence: '',
            cityOfResidence: 'cityOfResidence',
            TypeOfCollaboration: '',
            FieldOfExpert: '',
            FieldOfInterest: ''
          }}
          noLabel={false}
          translations={{

            firstName: t('firstName'),
            firstNameRequired: t('firstNameRequired'),
            firstNamePlaceholder: t('firstNamePlaceholder'),

            lastName: t('lastName'),
            lastNameRequired: t('lastNameRequired'),
            lastNamePlaceholder: t('lastNamePlaceholder'),

            email: t('email'),
            emailRequired: t('emailRequired'),
            emailErrorMessage: t('emailErrorMessage'),
            emailPlaceholder: t('emailPlaceholder'),

            phoneNumber: t('phoneNumber'),
            phoneNumberRequired: t('phoneNumberRequired'),
            phoneNumberErrorMessage: t('phoneNumberErrorMessage'),
            phoneNumberPlaceholder: t('phoneNumberPlaceholder'),

            countries: tCountry('countries', { returnObjects: true }),
            countryName: tCountry('countryName'),
            countryNameRequired: tCountry('countryNameRequired'),
            countryNamePlaceholder: tCountry('countryNamePlaceholder'),

            provinceOfResidence: tCountry('provinceOfResidence'),
            provinceOfResidenceRequired: tCountry('provinceOfResidenceRequired'),
            provinceOfResidencePlaceholder: tCountry('provinceOfResidencePlaceholder'),

            cityOfResidence: tCountry('cityOfResidence'),
            cityOfResidenceRequired: tCountry('cityOfResidenceRequired'),
            cityOfResidencePlaceholder: tCountry('cityOfResidencePlaceholder'),

            TypeOfCollaboration: t('TypeOfCollaboration'),
            TypeOfCollaborationRequired: t('TypeOfCollaborationRequired'),
            TypeOfCollaborationPlaceholder: t('TypeOfCollaborationPlaceholder'),
            TypeOfCollaborationData: t('TypeOfCollaborationData', { returnObjects: true }) || [],

            FieldOfExpert: t('FieldOfExpert'),
            FieldOfExpertRequired: t('FieldOfExpertRequired'),
            FieldOfExpertPlaceholder: t('FieldOfExpertPlaceholder'),
            FieldOfExpertData: t('FieldOfExpertData', { returnObjects: true }) || [],

            FieldOfExpertOther: t('FieldOfExpertOther', { returnObjects: true }),
            FieldOfExpertOtherRequired: t('FieldOfExpertOtherRequired', { returnObjects: true }),
            FieldOfExpertOtherPlaceholder: t('FieldOfExpertOtherPlaceholder', { returnObjects: true }),
            FieldOfInterestData: t('FieldOfInterestData', { returnObjects: true }) || [],

            FieldOfInterest: t('FieldOfInterest'),
            FieldOfInterestRequired: t('FieldOfInterestRequired'),
            FieldOfInterestPlaceholder: t('FieldOfInterestPlaceholder'),

            FieldOfInterestOther: t('FieldOfInterestOther', { returnObjects: true }),
            FieldOfInterestOtherRequired: t('FieldOfInterestOtherRequired', { returnObjects: true }),
            FieldOfInterestOtherPlaceholder: t('FieldOfInterestOtherPlaceholder', { returnObjects: true }),
          }}
        />
      </div>
    </>
  );
}
