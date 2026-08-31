const isProduction = process.env.NODE_ENV === 'production';

function getDomain() {
    if (isProduction) {
        return process.env.NEXT_PUBLIC_DJANGO_HOST_URL || 'https://back.novanestholding.com';
    } else {
        return 'http://localhost:8000';
    }
}

const environment = {
    getDomain,
};

export default environment;
