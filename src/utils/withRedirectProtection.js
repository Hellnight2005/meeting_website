// /utils/withRedirectProtection.js

import { useEffect } from "react";
import { useRouter } from "next/router";

const withRedirectProtection = (WrappedComponent) => {
  return function ProtectedPage(props) {
    const router = useRouter();

    useEffect(() => {
      // Check if the user came via a valid internal navigation (button/link)
      const isFromRedirect = sessionStorage.getItem("fromRedirect");

      if (!isFromRedirect) {
        // If not, redirect them to the homepage (or any other page)
        router.push("/");
      }

      // Clean up sessionStorage flag after the check
      sessionStorage.removeItem("fromRedirect");
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withRedirectProtection;
