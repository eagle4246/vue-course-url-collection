// Add this new function for URL formatting
export const formatUrl = (url) => {
    if (!url) return '';
    // Remove any whitespace
    url = url.trim();
    // If it already has a protocol, return as is
    if (url.match(/^https?:\/\//i)) {
      return url;
    }
    // If it starts with www., add https://
    if (url.match(/^www\./i)) {
      return `https://${url}`;
    }
    // If it looks like a domain (has a dot and no spaces), add https://www.
    if (url.includes('.') && !url.includes(' ') && !url.includes('/')) {
      return `https://www.${url}`;
    }
    // If it starts with a domain pattern, add https://
    if (url.match(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)) {
      return `https://${url}`;
    }
    // Default: assume it needs https://
    return `https://${url}`;
  };

// Updated extractTitle function to work with formatted URLs and validate TLD
export const extractTitle = (url) => {
    try {
      let hostname;
  
      // Determine hostname based on whether it's a full URL or just a domain string
      if (url.startsWith('http')) {
        const urlObj = new URL(url);
        hostname = urlObj.hostname;
      } else {
        hostname = url; // If formatUrl didn't add a protocol, assume it's still a raw domain-like string
      }
  
      // Clean up hostname (remove "www." prefix)
      hostname = hostname.replace(/^www\./i, '');
  
      // *** IMPORTANT: Explicitly check for a valid TLD structure ***
      // This regex looks for a dot followed by at least two alphabetic characters at the end of the hostname.
      // This is a common pattern for TLDs like .com, .org, .co, .ltd, .app, etc.
      if (!/\.[a-zA-Z]{2,}$/.test(hostname)) {
        return 'Untitled'; // If no valid TLD pattern found, return "Untitled"
      }
  
      // Extract the main domain name (e.g., "google" from "google.com")
      // This regex captures the part before the first dot.
      const match = hostname.match(/^([^.]+)\./);
      
      if (match && match[1]) {
        let extractedText = match[1];
        // Capitalize the first letter and lowercase the rest for a clean title
        return extractedText.charAt(0).toUpperCase() + extractedText.slice(1).toLowerCase();
      }
  
      // Fallback for cases where a TLD exists but the name extraction regex doesn't match
      // (e.g., a very simple domain like "example.co" where 'example' is the hostname)
      // Capitalize the first letter of the full hostname for the title.
      return hostname.charAt(0).toUpperCase() + hostname.slice(1).toLowerCase();
  
    } catch (error) {
      // Catch any errors during URL parsing (e.g., if new URL(url) fails for a truly malformed URL)
      console.error('Error parsing URL for title:', error);
      return 'Untitled'; // Return "Untitled" on error
    }
  };
  