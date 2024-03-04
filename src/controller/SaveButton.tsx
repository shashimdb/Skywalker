import Modal from '@leafygreen-ui/modal';
import React, { useEffect, useState } from 'react';
import Button from '@leafygreen-ui/button';
import TextInput from '@leafygreen-ui/text-input';

import { css, keyframes } from '@leafygreen-ui/emotion';
import LeafygreenProvider from '@leafygreen-ui/leafygreen-provider';
import { useSizingContext, sameUserDataSetter } from './context/SizingContext';

import axios from 'axios';
import {
    SearchInput,
    SearchResult,
    SearchResultGroup
} from "@leafygreen-ui/search-input";
import { Option, OptionGroup, Select, Size } from '@leafygreen-ui/select';

import DataService from './service/DataSerice';
import { useMetrons } from "../hooks/useMetrons";

import Intro from './vector/Intro';

import '../css/SaveButton.css';

interface SearchResult {
    _id: string;
    nm: string;
    opportunity: [];
    
}

const buttonStyle = css`
  /* Add any additional styles for the button if needed */
  margin: 2px;
  background-color: #00684A;
  color: #ffffff;
`;

const buttonStyle2 = css`
  /* Add any additional styles for the button if needed */
  margin-top: 15px;
  background-color: #00684A;
  color: #ffffff;
`;

interface SaveButtonProps {
    handleConfirmClick: (accountName: string, opportunityNo: string) => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ handleConfirmClick }) => {
    const { accountName, opportunityNo, setSizingData } = useSizingContext();
    const [open, setOpen] = useState(false);
    // const [localAccountName, setLocalAccountName] = useState('');
    // const [localOpportunityNo, setLocalOpportunityNo] = useState('');
    // const [opportunityOptions, setOpportunityOptions] = useState<JSX.Element[]>([]);
    const { ...todoActions } = useMetrons();


    // const [query, setQuery] = useState<string>('');
    // const dataService = new DataService();

    const localHandleConfirmClick = () => {
        // handleConfirmClick(localAccountName, localOpportunityNo);
        // setSizingData(localAccountName, localOpportunityNo);
        setOpen(true); // Close the modal after confirming

        // sameUserDataSetter && sameUserDataSetter(true);
    };




    return (
        <LeafygreenProvider>
            <Button className={buttonStyle} darkMode={true} onClick={() => localHandleConfirmClick}>Embed a new field </Button>
     
        </LeafygreenProvider>
    );
};

export default SaveButton;
