import moment from 'jalali-moment';

export default function jalaliDateToAdDate(jalaliDateTime: string) {

  const formatedDate = moment(jalaliDateTime, 'jalali').format('YYYY-MM-DDHH:mm:ss');

  return formatedDate;
}
