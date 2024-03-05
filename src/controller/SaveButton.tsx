import React, { useState } from 'react';
import Button from '@leafygreen-ui/button';
import { css } from '@leafygreen-ui/emotion';
import LeafygreenProvider from '@leafygreen-ui/leafygreen-provider';
import { useSizingContext, createIndexSetter } from './context/SizingContext';
import { useSkywalker } from "../hooks/useSkywalker";


import '../css/SaveButton.css';

const buttonStyle = css`
  margin: 2px;
  background-color: #00684A;
  color: #ffffff;
`;

const SaveButton: React.FC = () => {
    const { setCreateIndex, createIndex } = useSizingContext();
    const [open, setOpen] = useState(false);
    const { ...todoActions } = useSkywalker();

    const localHandleConfirmClick = () => {
        setCreateIndex(true); // Assuming createIndexSetter is always defined
    };

    return (
        <LeafygreenProvider>
            <Button className={buttonStyle} darkMode={true} onClick={localHandleConfirmClick}>Embed a new field</Button>
        </LeafygreenProvider>
    );
};

export default SaveButton;
