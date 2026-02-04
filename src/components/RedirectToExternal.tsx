import { useEffect } from "react";

// Add this component somewhere in your file
const RedirectToExternal = ({ url }: { url: string }) => {
    useEffect(() => {
      window.location.href = url;
    }, [url]);
  
    return null; // Render nothing
  };

  export default RedirectToExternal