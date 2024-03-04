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
    const [localAccountName, setLocalAccountName] = useState('');
    const [localOpportunityNo, setLocalOpportunityNo] = useState('');
    const [opportunityOptions, setOpportunityOptions] = useState<JSX.Element[]>([]);
    const { ...todoActions } = useMetrons();


    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const dataService = new DataService();

    const localHandleConfirmClick = () => {
        handleConfirmClick(localAccountName, localOpportunityNo);
        setSizingData(localAccountName, localOpportunityNo);
        setOpen(false); // Close the modal after confirming

        sameUserDataSetter && sameUserDataSetter(true);
    };

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setQuery(inputValue);
        try {
            // Make POST request using axios
            const response = await todoActions.findOppo(inputValue);

            if (Array.isArray(response)) {

                setResults(response);
            }
            else {
                // If response does not have valid data, handle it accordingly
                console.error("Invalid or empty response:", response);
            }
        } catch (error) {
            // Handle error
            console.error("Error:", error);
        }

    };

    const handleSelectedAccount = async (accountName: string, opportunity: []) => {
        try {
            setLocalAccountName(accountName);
            setQuery(''); // Clear SearchInput value
            setResults([]); // Clear results

            const options = opportunity.map((opp: any) => (
                <Option key={opp.nm} value={opp.nm}>{opp.nm}</Option>
            ));
            setOpportunityOptions(options);
        } catch (error) {
            // Handle error
            console.error("Error:", error);
        }
    };


    return (
        <LeafygreenProvider>
            <Button className={buttonStyle} darkMode={true} onClick={() => setOpen(curr => !curr)}>Create sizing for new opportunity </Button>
            <Modal open={open} setOpen={setOpen}>
                <p>Start sizing with <strong>Account name </strong>and <strong>Opportunity </strong>details</p>
                <div> {/* Ensuring content is within the Modal */}
                    <SearchInput size="large" aria-label="Label" onChange={handleInputChange} placeholder='Search account .' value={query} />

                    {results.map((result) => (
                        <SearchResult
                            key={result._id}
                            description={`Opportunity Id: ${result.nm}`}
                            onClick={() => handleSelectedAccount(result.nm, result.opportunity)}
                        >
                            <sub style={{ marginBottom: 0 }}>Account Name: </sub>
                            <h2 style={{ marginTop: 0, color: '#00684a' }}>{result.nm}</h2>
                        </SearchResult>
                    ))}

                </div>

                <br></br>
                <TextInput
                    label="Account Name"
                    placeholder="10gen"
                    value={localAccountName}
                    onChange={(e) => setLocalAccountName(e.target.value)}
                />
                <br></br>

                <Select
                    label="Opportunity No."
                    defaultValue="cat"
                    onChange={(e) => setLocalOpportunityNo(e)}
                >
                    {opportunityOptions}
                </Select>

                {localOpportunityNo ? (

                <Button className={buttonStyle2} onClick={localHandleConfirmClick}>
                    Confirm
                </Button>
                ): (
                    <></>
                )}
            </Modal>
        </LeafygreenProvider>
    );
};

export default SaveButton;
