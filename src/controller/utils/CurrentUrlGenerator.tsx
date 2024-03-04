import React, { useState } from 'react';
import Button from '@leafygreen-ui/button';
import Icon, { glyphs } from "@leafygreen-ui/icon";
import { css } from '@leafygreen-ui/emotion';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faShareAlt } from '@fortawesome/free-solid-svg-icons';


interface CurrentUrlGeneratorProps {
  acctName: string;
  oppno: string;
}

const buttonStyle = css`
 
  margin-right: 8px;
  margin-bottom:5px;

`;


function CurrentUrlGenerator({ acctName, oppno }: CurrentUrlGeneratorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    const urlToCopy = `${window.location.origin}${window.location.pathname}?acctName=${acctName}&oppno=${oppno}`;
    
    // Create a hidden textarea element
    const textarea = document.createElement('textarea');
    textarea.value = urlToCopy;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    
    // Append the textarea to the document body
    document.body.appendChild(textarea);
    
    // Select the text inside the textarea
    textarea.select();
    
    try {
      // Copy the selected text to the clipboard
      const success = document.execCommand('copy');
      if (success) {
        setCopied(true); // Set copied state to true
        setTimeout(() => {
          setCopied(false); // Reset copied state after 3 seconds
          document.body.removeChild(textarea); // Remove the textarea from the document
        }, 3000);
      } else {
        console.error('Failed to copy URL to clipboard');
        // Optionally, you can show an error message to the user
      }
    } catch (err) {
      console.error('Failed to copy URL to clipboard:', err);
      // Optionally, you can show an error message to the user
    }
  };
  
  

  return (
    <div className={buttonStyle}>
      <Button onClick={handleCopyClick}>
        {copied ? 'Copied' :  <FontAwesomeIcon icon={faShareAlt} />}
      </Button>
    </div>
  );
}

export default CurrentUrlGenerator;
