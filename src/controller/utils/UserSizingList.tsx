import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from "@leafygreen-ui/card";
import Button from "@leafygreen-ui/button"; // Import Button component from your UI library

import DataService from '../service/DataSerice';
import { useSizingContext } from '../context/SizingContext';
import ExpandableCard from "@leafygreen-ui/expandable-card";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRemove, faTrash, faEdit, faEye } from '@fortawesome/free-solid-svg-icons';

import { useSkywalker } from "../../hooks/useSkywalker";

import '../../css/UserSizingList.css';


interface Document {
    _id: { $oid: string };
    accountName: string;
    opportunityNo: string;
    cloudProvider: string;
    dateField: string;
    workLoadType: string;
    workLoadName: string;
    user: string;
}



const UserSizingList: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [allDocuments, setAllDocuments] = useState<Document[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentPageAll, setCurrentPageAll] = useState<number>(1);
    const { accountName, opportunityNo, user } = useSizingContext();
    const documentsPerPage = 5; // Number of documents per page
    const dataService = new DataService();
    const { ...todoActions } = useSkywalker();

    useEffect(() => {
        fetchData();
    }, [currentPage, user]); // Fetch data whenever currentPage changes

    const fetchData = async () => {
        try {
            const filterData = {
                "user": user
            };

            const filterAllData = {
                "user": {
                    "$ne": user
                }
            };

         


            // const response = await dataService.handleUserSizingList(filterData);
            // const responseAllUser = await dataService.handleUserSizingList(filterAllData);

            const response = await todoActions.fetchLatestSizing(filterData);
            const responseAllUser = await todoActions.fetchLatestSizing(filterAllData);

            response && setDocuments(response);
            responseAllUser && setAllDocuments(responseAllUser); 
            
            // Assuming response is an object with a "documents" array containing document objects
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const generateLink = (acctName: string, oppno: string) => {
        const url = `${window.location.origin}${window.location.pathname}?acctName=${acctName}&oppno=${oppno}`;

        window.location.href = url;
    };

    // User pagination

    const indexOfLastDocument = currentPage * documentsPerPage;
    const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
    const currentDocuments = documents.slice(indexOfFirstDocument, indexOfLastDocument);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const maxButtons = 5; // Maximum number of pagination buttons
    const totalPages = Math.ceil(documents.length / documentsPerPage);
    const halfMaxButtons = Math.floor(maxButtons / 2);
    let startPage = Math.max(1, currentPage - halfMaxButtons);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }


    // All User pagination

    const indexOfLastDocumentAll = currentPageAll * documentsPerPage;
    const indexOfFirstDocumentAll = indexOfLastDocumentAll - documentsPerPage;
    const currentDocumentsAll = allDocuments.slice(indexOfFirstDocumentAll, indexOfLastDocumentAll);

    const paginateAll = (pageNumber: number) => setCurrentPageAll(pageNumber);


    const totalPagesAll = Math.ceil(allDocuments.length / documentsPerPage);
    const halfMaxButtonsAll = Math.floor(maxButtons / 2);
    let startPageAll = Math.max(1, currentPageAll - halfMaxButtonsAll);
    let endPageAll = Math.min(totalPagesAll, startPageAll + maxButtons - 1);

    if (endPageAll - startPageAll + 1 < maxButtons) {
        startPageAll = Math.max(1, endPageAll - maxButtons + 1);
    }


    return (
        <div className='userlist-info'>


            <div className="card-container">

                <div className="custom-card"
               
                >
                    
                    <div className="info-item">

                        <span style={{ width: "40%" }}>Namespace </span>
                        <span style={{ width: "20%" }}>Embed Field</span>
                        <span style={{ width: "10%" }}>Use Case</span>
                        <span style={{ width: "20%" }}>Created By:</span>
                        <span style={{ width: "20%" }}>Date:</span>
                        <span style={{ width: "3%" }}>Action:</span>
            
                    </div>



                    {currentDocuments.map((doc, index) => (
                        <div className={`card-content ${index % 2 === 0 ? 'even-row' : 'odd-row'}`}>
                            <div className="info-item">
                                <span style={{ width: "40%" }}>{doc.accountName}: <br /><h3 style={{ margin: "0" }}><strong>{doc.opportunityNo}</strong></h3></span>
                                <span style={{ width: "20%" }}> {doc.workLoadType}  Tier<br /><h3 style={{ margin: "0" }}><strong>{doc.workLoadName}</strong></h3></span>
                                <span style={{ width: "10%" }}>
                                    {doc.cloudProvider === 'Azure' && <img src="azure_logo.png" alt="Azure" width="40" height="30" />}
                                    {doc.cloudProvider === 'AWS' && <img src="aws_logo.png" alt="AWS" width="45" height="30" />}
                                    {doc.cloudProvider === 'GCP' && <img src="gcp_logo.png" alt="GCP" width="40" height="30" />}
                                    <br />
                                </span>
                                <span style={{ width: "20%" }}> {doc.user} </span>
                                <span style={{ width: "20%" }}> {new Date(doc.dateField).toISOString().replace("T", " ").split(".")[0]}</span>

                                <Button onClick={() => generateLink(doc.accountName, doc.opportunityNo)}><FontAwesomeIcon icon={faEdit} /> </Button>
                            </div>
                        </div>
                    ))}
                    <div className="pagination">

                        {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
                            <Button key={startPage + i} className={currentPage === startPage + i ? 'active' : ''} onClick={() => paginate(startPage + i)}>{startPage + i}</Button>
                        ))}
                    </div>
                </div>


            </div>

        

        </div>



    );
};

export default UserSizingList;
