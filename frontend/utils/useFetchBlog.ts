'use client';

import { useEffect } from "react";
import { useSubmit } from "stores/dataStore";
import { FetchBlogData } from "@/utils/fetchBlogData";

const {setCardsData, setCategories, setTags} = useSubmit.getState();


export default async function useFetchBlog(stateNme: string) {

  switch (stateNme) {
    case "cardsData":
      useEffect(() => {
        // Inside the useEffect, fetch the data and update the state
        async function fetchData() {
          try {
            const data = await FetchBlogData('/blog/list?format=json');
            setCardsData(data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
    
        fetchData();
      }, []);
      break
    case "categories":
      useEffect(() => {
        // Inside the useEffect, fetch the data and update the state
        async function fetchData() {
          try {
            const data = await FetchBlogData('/blog/categories');
            setCategories(data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
    
        fetchData();
      }, []);
      break
    case "tags":
      useEffect(() => {
        // Inside the useEffect, fetch the data and update the state
        async function fetchData() {
          try {
            const data = await FetchBlogData('blog/tags');
            setTags(data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
    
        fetchData();
      }, []);
      break
  }
  //   case "categories":
  //     break
  // }
  //   case "tags":
  //     break
  // }
    //   case "cardData":
  //     break
  // }

}
