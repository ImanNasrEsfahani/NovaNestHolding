export function formatDate(input: string | number): string {
    const date = new Date(input)
    return date.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
    })
}
// The original function's runtime behavior is unchanged. Its input type no
// longer depends on the unused formidable package.
export function extractFieldValue(fields: Record<string, unknown>, fieldName: string): string {
    const fieldValue:any = fields[fieldName];
    return Array.isArray(fieldValue) ? fieldValue[0] : fieldValue;
}



export function convertDateFormat(inputDate:any) {
    const dateObject = new Date(inputDate);

    // Ensure double digits for month, day, hours, minutes, and seconds
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getDate().toString().padStart(2, '0');
    const hours = dateObject.getHours().toString().padStart(2, '0');
    const minutes = dateObject.getMinutes().toString().padStart(2, '0');
    const seconds = dateObject.getSeconds().toString().padStart(2, '0');
    const milliseconds = dateObject.getMilliseconds().toString().padStart(3, '0');

    const isoDate = `${dateObject.getFullYear()}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;

    return isoDate;
}
