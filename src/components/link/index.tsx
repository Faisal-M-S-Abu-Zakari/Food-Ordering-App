// this is a custom link component that prefetches the link when the mouse is over it and removes the prefetch when the mouse leaves
// طبيعة النيكست انه بيعمل تحميل لكل الصفحات , لذلك ممكن يتأخر الموقع شيء بسيط , لذلك بنيت هذا الكومبونينت يلي راح يحمل باقي الصفحات وقت ما تعمل هوفر على الزر
"use client";

import NextLink, { LinkProps as NextLinkProps } from "next/link";
import React, { FC, HTMLAttributes, useEffect, useRef, useState } from "react";

type CustomLinkProps = NextLinkProps & {
  children: React.ReactNode;
  href: string;
  target?: string;
} & HTMLAttributes<HTMLAnchorElement>;

const Link: FC<CustomLinkProps> = ({ children, href, ...rest }) => {
  const [prefetching, setPrefetching] = useState(false);
  // here i will fetch the button using useRef
  const linkRef = useRef<HTMLAnchorElement>(null);

  //   two functions to control fetching
  const setPrefetchListener = () => {
    setPrefetching(true);
  };
  const removePrefetchListener = () => {
    setPrefetching(false);
  };
  //   then using useEffect to apply the prefetching
  useEffect(() => {
    // to know your place in the code
    const linkElement = linkRef.current;
    // when mouse is over the button prefetch the page
    linkElement?.addEventListener("mouseover", setPrefetchListener);
    // when mouse is leave the button remove prefetch the page
    linkElement?.addEventListener("mouseleave", removePrefetchListener);
    return () => {
      linkElement?.removeEventListener("mouseover", setPrefetchListener);
      linkElement?.removeEventListener("mouseleave", removePrefetchListener);
    };
  }, [prefetching]);
  return (
    <NextLink href={href} ref={linkRef} prefetch={prefetching} {...rest}>
      {children}
    </NextLink>
  );
};

export default Link;
