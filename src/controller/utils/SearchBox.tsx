import React, { useState } from 'react';
import axios from 'axios';
import {
    SearchInput,
    SearchResult,
    SearchResultGroup
} from "@leafygreen-ui/search-input";

import { useMetrons } from "../../hooks/useMetrons";

import  DataService from '../service/DataSerice';

interface SearchResult {
    _id: { $oid: string };
    accountName: string;
    opportunityNo: string;
}

const SearchBox: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const dataService = new DataService();
    const { ...todoActions } = useMetrons();

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setQuery(inputValue);

        try {

            const response = await todoActions.search(inputValue);

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

    return (
        <div>
            {/* <h6>Search with account or opportunity</h6> */}


            <SearchInput size="large" aria-label="Label" onChange={handleInputChange} placeholder='Jedi is here!!! find your embedings' value={query} >


                {results.map((result) => (
                    <SearchResult
                        onClick={() => {

                            const url = `${window.location.origin}${window.location.pathname}load?acctName=${result.accountName}&oppno=${result.opportunityNo}`;
                           // alert(url);
                            window.open(url, '_self');
                        }}
                        description={`Opportunity Id: ${result.opportunityNo}`}
                    >
               <sub style={{ marginBottom: 0 }}>Account Name: </sub><h2 style={{ marginTop: 0 }}>{result.accountName}</h2>

                    </SearchResult>
                ))}



            </SearchInput>

        </div>

 

    );
};

export default SearchBox;
