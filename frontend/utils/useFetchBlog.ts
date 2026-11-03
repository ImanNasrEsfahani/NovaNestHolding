'use client';

import { useEffect } from 'react';
import { useSubmit } from 'stores/dataStore';
import { FetchBlogData } from '@/utils/fetchBlogData';

type BlogResource = 'cardsData' | 'categories' | 'tags';
const urls: Record<BlogResource, string> = {
  cardsData: '/blog/list?format=json',
  categories: '/blog/categories',
  tags: '/blog/tags',
};

/** Valid custom hook: one unconditional effect, no async hook function.
 * Data updates are ignored after unmount or resource change.
 */
export default function useFetchBlog(resource: BlogResource) {
  const setCardsData = useSubmit((state) => state.setCardsData);
  const setCategories = useSubmit((state) => state.setCategories);
  const setTags = useSubmit((state) => state.setTags);

  useEffect(() => {
    let active = true;
    FetchBlogData(urls[resource])
      .then((data) => {
        if (!active) return;
        if (resource === 'cardsData') setCardsData(data);
        else if (resource === 'categories') setCategories(data);
        else setTags(data);
      })
      .catch((error) => {
        if (active) console.error('Error fetching blog data:', error);
      });
    return () => { active = false; };
  }, [resource, setCardsData, setCategories, setTags]);
}
