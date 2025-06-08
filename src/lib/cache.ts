// to increase the performance of your app , you have to handle the caching
// there is two way of caching : 1- for the all app 2- for specific tags ==> if i cache the best-sellers , then it will cache the best-sellers only (this is called specific tags)
// next and react support caching method to be imported and used , 1-in the next cache method i pass the react cache method
// then in the react cache method , pass 3 thing :
// 1-callBack function , wich is the getBestSallers function that will return the best-sellers product
// 2-then i pass keyParts , this keyPart will specifiy to which type you are making cache (product , category ...) , in few words : now you are making cache for whome ?
// 3- revalidate : if the product are changed in Db so you have to revalidate the cache after specific time ... and there is tags to specifiy the revalidate will be for which part exactlly

// this cache are already Promise , so the cb will not be async/await

import { unstable_cache as nextCache } from "next/cache";
import { cache as reactCache } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback = (...args: any[]) => Promise<any>;

export function cache<T extends Callback>(
  cb: T,
  keyParts: string[],
  options: { revalidate?: number | false; tags?: string[] }
) {
  return nextCache(reactCache(cb), keyParts, options);
}
