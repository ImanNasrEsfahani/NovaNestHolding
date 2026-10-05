async function FetchBlogData(url: string) {
    url = `${process.env.NEXT_PUBLIC_DJANGO_HOST_URL}${url}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch data.');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error while fetching data:', error);
      throw error;
    }
}

export { FetchBlogData }