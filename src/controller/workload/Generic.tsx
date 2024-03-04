// Generic.tsx
import React, { MouseEvent, useEffect, useState } from 'react';
import Callout, { Variant } from '@leafygreen-ui/callout';
import Card from '@leafygreen-ui/card';
import TextInput from '@leafygreen-ui/text-input';
import TextArea from '@leafygreen-ui/text-area';
import Modal from '@leafygreen-ui/modal';
import Button from '@leafygreen-ui/button';

import axios from 'axios';
import { useSizingContext, hasRenderedSetter, sameUserDataSetter } from '../context/SizingContext';
import { PageLoader, Spinner } from "@leafygreen-ui/loading-indicator";
import Converter from '../utils/Converter';

import '../../css/Generic.css'; // Import your CSS file
import DataService from '../service/DataSerice';
import { useMetrons } from "../../hooks/useMetrons";

import Icon, { glyphs } from "@leafygreen-ui/icon";
import Tooltip from "@leafygreen-ui/tooltip";
import IconButton from "@leafygreen-ui/icon-button";
import { Option, OptionGroup, Select, Size } from '@leafygreen-ui/select';
import ExpandableCard from "@leafygreen-ui/expandable-card";




import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRemove, faTrash, faEdit, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { BasicEmptyState, FeaturesEmptyState } from '@leafygreen-ui/empty-state';
import { devNull } from 'os';
import FeaturedEmptyState from '../utils/FeaturedEmptyState';


export let newValues: {
    Tier: string;
    RAM: string;
    Storage: string;
    vCPUs: string;
    active: boolean;
    cloud: string;
}

type JsonData = {
    [key: string]: {
        Tier: string;
        RAM: string;
        Storage: string;
        vCPUs: string;
        Price: string;
    };
};

interface CalculationProps {
    workLoadType: string;
    workLoadName: string;
    accountName: string;
    opportunityNo: string;
    cloudProvider: string;
    workLoadIndex: number;
    content: string;
    updateCalculatedValues: any;
    handleDeleteCard: (index: number) => void;

}

interface Index {
    name: string;
    value: string;
}

interface GenericCollectionData {
    _id: any;
    workLoadType: string;
    workLoadName: string;
    accountName: string;
    opportunityNo: string;
    cloudProvider: string;
    nameCol: string;
    totalDocuments: string; // Make it non-optional
    insertedPerSecond: string; // Make it non-optional
    deletedPerSecond: string; // Make it non-optional
    readsPerSecond: string; // Make it non-optional
    updatesPerSecond: string; // Make it non-optional
    percentageFrequentlyAccessed: string; // Make it non-optional
    compressionRatio: string; // Make it non-optional
    totalIndex: string; // Make it non-optional
    avgDocumentSizeInKB: string;
    sampleDocument: string;
    dateField: Date;
    user: string;
    indexes: Index[];
}


const Generic: React.FC<CalculationProps> = ({
    workLoadType,
    workLoadName,
    cloudProvider,
    workLoadIndex,
    updateCalculatedValues,
    handleDeleteCard,

}) => {
    const [myDeleteIndex, setDeleteIndex] = useState<number>(-1);
    const [updateIndex, setUpdateIndex] = useState<number>(-1);
    // State variables for dynamic values
    const [dataSource, setDataSource] = useState<string>("Cluster0");
    const [database, setDatabase] = useState<string>("SizingAtlas");
    const [collection, setCollection] = useState<string>("DevCollection");


    let cardDetailsContainer = document.getElementById('cardDetailsCalculation');
    let workingSetDetailsContainer = document.getElementById('workingSetDetails');

    const { accountName, opportunityNo, user, hasRendered, sameUser } = useSizingContext();

    const initialCollectionData = {
        _id: '',
        workLoadType: '',
        workLoadName: '',
        accountName: '',
        opportunityNo: '',
        cloudProvider: '',
        nameCol: '',
        totalDocuments: '',
        insertedPerSecond: '',
        deletedPerSecond: '',
        readsPerSecond: '',
        updatesPerSecond: '',
        percentageFrequentlyAccessed: '',
        compressionRatio: '',
        totalIndex: '',
        avgDocumentSizeInKB: '',
        sampleDocument: '',
        dateField: new Date(),
        user: '',
        indexes: [],
    };
    // Your provided JSON data
    const jsonData: JsonData = {
        "M10": { "Tier": "M10", "RAM": "2 GB", "Storage": "10 GB", "vCPUs": "2", "Price": "from $0.08/hr" },
        "M20": { "Tier": "M20", "RAM": "4 GB", "Storage": "20 GB", "vCPUs": "2", "Price": "from $0.20/hr" },
        "M30": { "Tier": "M30", "RAM": "8 GB", "Storage": "40 GB", "vCPUs": "2", "Price": "from $0.54/hr" },
        "M40": { "Tier": "M40", "RAM": "16 GB", "Storage": "80 GB", "vCPUs": "4", "Price": "from $1.04/hr" },
        "M50": { "Tier": "M50", "RAM": "32 GB", "Storage": "160 GB", "vCPUs": "8", "Price": "from $2.00/hr" },
        "M60": { "Tier": "M60", "RAM": "64 GB", "Storage": "320 GB", "vCPUs": "16", "Price": "from $3.95/hr" },
        "M80": { "Tier": "M80", "RAM": "128 GB", "Storage": "750 GB", "vCPUs": "32", "Price": "from $7.30/hr" },
        "M140": { "Tier": "M140", "RAM": "192 GB", "Storage": "1000 GB", "vCPUs": "48", "Price": "from $10.99/hr" },
        "M200": { "Tier": "M200", "RAM": "256 GB", "Storage": "1500 GB", "vCPUs": "64", "Price": "from $14.59/hr" },
        "M300": { "Tier": "M300", "RAM": "384 GB", "Storage": "2000 GB", "vCPUs": "96", "Price": "from $21.85/hr" },
        "M400": { "Tier": "M400", "RAM": "512 GB", "Storage": "3000 GB", "vCPUs": "64", "Price": "from $22.40/hr" },
        "M700": { "Tier": "M700", "RAM": "768 GB", "Storage": "4096 GB", "vCPUs": "96", "Price": "from $33.26/hr" }
    };
    const [indexName, setIndexName] = useState('');
    const [indexSize, setIndexSize] = useState('');
    const [isGridItemRightEnabled, setGridItemRightEnabled] = useState(false);
    const [totalDoc, setTotalDoc] = useState('10');
    const [percentageNo, setPercentageNo] = useState('0.3');
    const [modalOpen, setModalOpen] = useState(false);
    const [spinnerOpen, setSpinnerOpen] = useState(false);
    const [GenericCollectionData, setCollectionData] = useState<GenericCollectionData | null>(initialCollectionData);
    const [loading, setLoading] = useState(false);
    const [localCollectionData, setLocalCollectionData] = useState({ totalDocuments: '0', docMultiplier: '1000' });
    let [calculationData, setCalculationData] = useState('');

    const dataService = new DataService();
    const { ...todoActions } = useMetrons();

    let uncompressedSizeKB = 0.0,
        uncompressedSizeGB = 0.0,
        uncompressedSizeTB = 0.0,
        compressedSizeKB = 0.0,
        compressedSizeGB = 0.0,
        compressedSizeTB = 0.0,
        averageDocumentSize = 0.0;


    let totalCompressedSizeKB = 0;
    let totalIndexes = 0;
    let noOfIndexId = 0;
    let [compressionRatio, setCompressionRatio] = useState('0.5');
    let [mycollections, setCollections] = useState<GenericCollectionData[]>([]);
    let [cpuCoreRequired, setCpuCoreRequired] = useState(0);
    let [ramRequired, setRamRequired] = useState(0);
    let [totalRamRequired, setTotalRamRequired] = useState(0);
    let [totalDiskIOPS, setTotalDiskIOPS] = useState(0);
    let [totalUncompressedSizeKB, setTotalUncompressedSizeKB] = useState(0);
    const [showCalculation, setShowCalculation] = useState(false);



    useState(initialCollectionData);

    const calculateCollectionMetrics = (GenericCollectionData: GenericCollectionData, isComplete: boolean): Promise<void> => {
        return new Promise((resolve) => {


            const workingSetDetailsContainer = document.getElementById('workingSetDetails');




            try {
                calculationData += '\n';
                calculationData += 'Collection: ' + GenericCollectionData.nameCol;
                calculationData += '\n';
                calculationData += '================================';
                calculationData += '\n';

                // Retrieve values from the card

                const totalDocuments = parseInt(GenericCollectionData.totalDocuments, 10);
                averageDocumentSize = parseFloat(GenericCollectionData.avgDocumentSizeInKB);
                const compressionRatio = parseFloat(GenericCollectionData.compressionRatio);


                calculationData += 'totalDocuments = ' + totalDocuments + '\n';
                calculationData += 'averageDocumentSize = ' + averageDocumentSize + '\n';
                calculationData += 'compressionRatio = ' + compressionRatio + '\n';
                calculationData += '\n';





                // Calculate uncompressed and compressed sizes
                uncompressedSizeKB = averageDocumentSize * totalDocuments;
                uncompressedSizeGB = uncompressedSizeKB / 1000000;
                uncompressedSizeTB = uncompressedSizeKB / 1000000000;

                calculationData += 'uncompressedSizeKB = averageDocumentSize * totalDocuments;\n';
                calculationData += 'uncompressedSizeKB = ' + averageDocumentSize + ' * ' + totalDocuments + '\n';
                calculationData += 'uncompressedSizeGB = uncompressedSizeKB / 1000000;\n';
                calculationData += 'uncompressedSizeGB = ' + uncompressedSizeKB + ' / 1000000\n';
                // calculationData += 'uncompressedSizeTB = uncompressedSizeKB / 1000000000;\n';
                // calculationData += 'uncompressedSizeTB = ' + uncompressedSizeKB + ' / 1000000000\n';
                calculationData += '\n';

                compressedSizeKB = uncompressedSizeKB * compressionRatio;
                compressedSizeGB = compressedSizeKB / 1000000;
                compressedSizeTB = compressedSizeKB / 1000000000;

                calculationData += 'compressedSizeKB = uncompressedSizeKB * compressionRatio;\n';
                calculationData += 'compressedSizeKB = ' + uncompressedSizeKB + ' * ' + compressionRatio + '\n';
                calculationData += 'compressedSizeGB = compressedSizeKB / 1000000;\n';
                calculationData += 'compressedSizeGB = ' + compressedSizeKB + ' / 1000000\n';
                // calculationData += 'compressedSizeTB = compressedSizeKB / 1000000000;\n';
                // calculationData += 'compressedSizeTB = ' + compressedSizeKB + ' / 1000000000\n';
                calculationData += '\n';



                // Calculate index size
                let indexSizeKB = 0;

                GenericCollectionData?.indexes?.forEach((index) => {

                    indexSizeKB += parseFloat(index.value);
                    if (index.name != '_id') {
                        noOfIndexId += 1;
                    }
                });



                indexSizeKB = indexSizeKB * totalDocuments;

                const cardDetailsContainer = document.getElementById('cardDetailsCalculation');

                if (cardDetailsContainer) {

                    cardDetailsContainer.innerHTML += `
  
                    <style>
                    th, td {
                        width: 100px; /* Set the width of columns to 100px */
                        text-align: left; /* Optional: Set text alignment to left */
                        padding: 5px; /* Optional: Add padding for better appearance */
                    }
                </style>
                <br>
                <table>
                    <tr>
                        <th>Collection Name</th>
                        <td>${GenericCollectionData.nameCol}</td>
                    </tr>
                    <tr>
                        <th>Uncompressed</th>
                        <td>${uncompressedSizeKB.toFixed(2)} KB</td>
                        <td>${uncompressedSizeGB.toFixed(2)} GB</td>
                        <td>${uncompressedSizeTB.toFixed(2)} TB</td>
                    </tr>
                    <tr>
                        <th>Compressed</th>
                        <td>${compressedSizeKB.toFixed(2)} KB</td>
                        <td>${compressedSizeGB.toFixed(2)} GB</td>
                        <td>${compressedSizeTB.toFixed(2)} TB</td>
                    </tr>
                    <tr>
                        <th>Index Size</th>
                        <td>${indexSizeKB.toFixed(2)} KB</td>
                        <td>${(indexSizeKB / 1000000).toFixed(2)} GB</td>
                        <td>${(indexSizeKB / 1000000000).toFixed(2)} TB</td>
                    </tr>
                </table>
            
                `;

                }







                // Retrieve values from the card


                let readsPerSecond = !isNaN(parseFloat(GenericCollectionData.readsPerSecond)) ? Math.max(0.0, parseFloat(GenericCollectionData.readsPerSecond)) : 0.0;
                let insertedPerSecond = !isNaN(parseFloat(GenericCollectionData.insertedPerSecond)) ? Math.max(0.0, parseFloat(GenericCollectionData.insertedPerSecond)) : 0.0;
                let deletedPerSecond = !isNaN(parseFloat(GenericCollectionData.deletedPerSecond)) ? Math.max(0.0, parseFloat(GenericCollectionData.deletedPerSecond)) : 0.0;
                let percentageAccess = !isNaN(parseFloat(GenericCollectionData.percentageFrequentlyAccessed)) ? Math.max(0.0, parseFloat(GenericCollectionData.percentageFrequentlyAccessed)) : 0.0;
                let updatesPerSecond = !isNaN(parseFloat(GenericCollectionData.updatesPerSecond)) ? Math.max(0.0, parseFloat(GenericCollectionData.updatesPerSecond)) : 0.0;


                // Calculate Disk IOPS for the current card
                const diskIOPS = (readsPerSecond + updatesPerSecond + insertedPerSecond + deletedPerSecond) / 20;
                calculationData += 'diskIOPS = (readsPerSecond + updatesPerSecond + insertedPerSecond + deletedPerSecond) / 20;\n';
                calculationData += 'diskIOPS = (' + readsPerSecond + ' + ' + updatesPerSecond + ' + ' + insertedPerSecond + ' + ' + deletedPerSecond + ') / 20;\n';
                calculationData += '\n';


                // Update total sizes and counts
                totalUncompressedSizeKB += uncompressedSizeKB + indexSizeKB;
                totalCompressedSizeKB += compressedSizeKB + indexSizeKB;
                totalDiskIOPS += diskIOPS;
                totalIndexes += noOfIndexId //totalIndexesInCollection - noOfIndexId;

                calculationData += 'totalUncompressedSizeKB += uncompressedSizeKB + indexSizeKB;\n';
                calculationData += 'totalUncompressedSizeKB += ' + uncompressedSizeKB + ' + ' + indexSizeKB + ' =  ' + totalUncompressedSizeKB + '\n';
                calculationData += 'totalCompressedSizeKB += compressedSizeKB + indexSizeKB;\n';
                calculationData += 'totalCompressedSizeKB += ' + compressedSizeKB + ' + ' + indexSizeKB + '\n';
                calculationData += 'totalDiskIOPS += diskIOPS;\n';
                calculationData += 'totalDiskIOPS += ' + diskIOPS + '\n';
                calculationData += 'totalIndexes += noOfIndexId\n';
                calculationData += 'totalIndexes += ' + noOfIndexId + '\n';
                calculationData += '\n';



                let opsPerCPUCore = 12500 * Math.pow((1 - 0.05), (totalIndexes));
                calculationData += 'opsPerCPUCore = 12500 * Math.pow((1 - 0.05), (totalIndexes));\n';
                calculationData += 'opsPerCPUCore = 12500 * Math.pow((1 - 0.05), (' + totalIndexes + '));\n';
                calculationData += '\n';


                cpuCoreRequired = Math.ceil((totalDiskIOPS / opsPerCPUCore));
                ramRequired = Math.ceil((uncompressedSizeKB * percentageAccess) / (1024 * 1024));


                totalRamRequired += ramRequired;

                calculationData += 'cpuCoreRequired = Math.ceil((totalDiskIOPS / opsPerCPUCore));\n';
                calculationData += 'cpuCoreRequired = ' + Math.ceil((totalDiskIOPS / opsPerCPUCore)) + '\n';
                calculationData += 'ramRequired = Math.ceil((totalUncompressedSizeKB * percentageAccess) / (1024 * 1024));\n';
                calculationData += 'ramRequired = Math.ceil((' + uncompressedSizeKB + ' * ' + percentageAccess + ') / (1024 * 1024));\n';
                calculationData += 'ramRequired = ' + Math.ceil((uncompressedSizeKB * percentageAccess) / (1024 * 1024)) + '\n';
                calculationData += '\n';



                if (workingSetDetailsContainer) {
                    workingSetDetailsContainer.innerHTML += `

                <table class ="subTask" style="">
                    <tr>
                        <th>${GenericCollectionData.nameCol}</th>
                        <td>${(ramRequired * 1000000).toFixed(2)} KB</td>
                        <td>${(ramRequired).toFixed(2)} GB</td>
                        <td>${(ramRequired / 1000).toFixed(2)} TB</td>
                    </tr>                           
                </table>
       
                `;
                }



                setCpuCoreRequired(cpuCoreRequired);
                setRamRequired(totalRamRequired);
                setTotalDiskIOPS(totalDiskIOPS);
                setTotalUncompressedSizeKB(totalUncompressedSizeKB);
                calculationData += '_______________________________\n';
                calculationData += 'Note: incremental values \n\n';
                calculationData += 'Cpu Core Required = ' + cpuCoreRequired + '\n';
                calculationData += 'RAM  Required = ' + totalRamRequired + '\n';
                calculationData += 'DISK IOPs Required =' + totalDiskIOPS + '\n';
                calculationData += 'Un Compressed in GB =' + (totalUncompressedSizeKB / 1000000) + '\n';
                calculationData += '_______________________________\n';
                calculationData += '\n';

                setCalculationData(calculationData);

                // Step 1: Find the RAM tier nearest

                let smallestRamDifference = 0;
                let nearestTierRAM = '';

                for (const [tier, data] of Object.entries(jsonData)) {
                    const tierRAM = parseInt(data.RAM.replace(" GB", ""));
                    const ramDifference = totalRamRequired - tierRAM;

                    if (ramDifference <= smallestRamDifference) {
                        nearestTierRAM = tier;
                        break;
                    }
                }

                // Step 2: Find the CPU tier nearest

                let smallestCpuDifference = 0;
                let typeBase = null;

                let nearestTierCPU = '';

                for (const [tier, data] of Object.entries(jsonData)) {
                    const tierCPUs = parseInt(data.vCPUs);
                    const cpuDifference = cpuCoreRequired - tierCPUs;

                    if (cpuDifference <= smallestCpuDifference) {
                        nearestTierCPU = tier;
                        break;
                    }
                }


                // // Step 3: Find the highest tier between RAM and CPU tiers
                let highestTier: string | null = '';
                let tierRAM: number = parseInt(nearestTierRAM.replace(/\D/g, ''), 10);
                let tierCPU: number = parseInt(nearestTierCPU.replace(/\D/g, ''), 10);


                if (nearestTierRAM && nearestTierCPU) {

                    if (tierRAM >= tierCPU) {

                        highestTier = nearestTierRAM;
                        typeBase = "Based on RAM";

                    } else {

                        highestTier = nearestTierCPU;
                        typeBase = "Based on CPU";
                    }
                } else if (nearestTierRAM) {
                    highestTier = nearestTierRAM;
                } else if (nearestTierCPU) {
                    highestTier = nearestTierCPU;
                }

                // Display the JSON data for the selected tiers

                console.log("JSON data for the selected tiers:");
                console.log('Nearest Tier based on RAM:', jsonData[nearestTierRAM]);

                console.log('Nearest Tier based on vCPUs:', jsonData[nearestTierCPU]);
                console.log('Nearest Tier based on RAM and vCPUs::', jsonData[highestTier]);




                // Assume you have new values to update
                const newValues = {
                    Tier: jsonData[highestTier].Tier,
                    RAM: 'RAM: ' + jsonData[highestTier].RAM,
                    Storage: 'Storage: ' + jsonData[highestTier].Storage,
                    vCPUs: 'CPU: ' + jsonData[highestTier].vCPUs,
                    index: workLoadIndex,
                    active: true,
                    cloud: cloudProvider
                };

                if (isComplete) {

                    // Call the function passed from the parent to update the values
                    updateCalculatedValues(newValues);
                    setCollectionData(initialCollectionData);

                }

            } catch (error) {

            }
        });
    };

    const addIndex = () => {
        if (indexName && indexSize) {
            setCollectionData((prevData) => ({
                ...prevData!,
                indexes: [...(prevData?.indexes || []), { name: indexName, value: indexSize }],
            }));
            setIndexName('');
            setIndexSize('');
        }
    };

    const deleteIndex = (index: number) => {
        setCollectionData((prevData) => ({
            ...prevData!,
            indexes: prevData?.indexes.filter((_, i) => i !== index) || [],
        }));
    };

    const calculateTotalIndexSize = (collection: GenericCollectionData | 0): number => {
        if (collection && collection.indexes) {
            return collection.indexes.length;
        }
        // Return a default value if collection is undefined
        return 0;
    };

    const saveCollection = async () => {
        try {
            setLoading(true);
            const fetchColData = async () => {
                const filterData = {
                    "accountName": accountName,
                    "opportunityNo": opportunityNo,
                    "workLoadType": workLoadType,
                    "workLoadName": workLoadName,
                    "nameCol": GenericCollectionData?.nameCol
                };

                try {

                    // Make POST request using axios
                    // const response = await dataService.handleReadManyDoc(filterData)

                    const response = await todoActions.readDoc(filterData);
                    console.log(JSON.stringify(response));

                    if (Array.isArray(response)) {

                        // Access the data property on the response
                        let documents: any;
                        documents = response || [];

                        const updatedCollections = documents.map((document: GenericCollectionData) => ({
                            ...document,
                            // Additional modifications if necessary
                        }));

                        const calculatedTotalIndex = calculateTotalIndexSize(GenericCollectionData!);

                        const localData = {
                            workLoadType: workLoadType,
                            workLoadName: workLoadName,
                            accountName: accountName,
                            opportunityNo: opportunityNo,
                            cloudProvider: cloudProvider,
                            nameCol: GenericCollectionData?.nameCol,
                            totalDocuments: GenericCollectionData?.totalDocuments,
                            insertedPerSecond: GenericCollectionData?.insertedPerSecond,
                            deletedPerSecond: GenericCollectionData?.deletedPerSecond,
                            readsPerSecond: GenericCollectionData?.readsPerSecond,
                            updatesPerSecond: GenericCollectionData?.updatesPerSecond,
                            percentageFrequentlyAccessed: GenericCollectionData?.percentageFrequentlyAccessed,
                            compressionRatio: GenericCollectionData?.compressionRatio,
                            totalIndex: calculatedTotalIndex.toString(),
                            avgDocumentSizeInKB: GenericCollectionData?.avgDocumentSizeInKB,
                            sampleDocument: GenericCollectionData?.sampleDocument,
                            dateField: new Date(),
                            user: user,
                            indexes: GenericCollectionData?.indexes,
                        };

                        if (updatedCollections && updatedCollections.length > 0) {



                            // await dataService.handleUpdatetDoc(filterData, localData);
                            await todoActions.updateDoc(filterData, localData);

                        } else {


                            await todoActions.insertDoc(localData);
                        }
                    }

                    else {
                        // If response does not have valid data, handle it accordingly
                        console.error("Invalid or empty response:", response);
                    }

                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    // Call the async function defined above
                    fetchData();
                    setLoading(false);

                }
            };

            // Call the async function defined above
            await fetchColData();
            closeModal();
        }
        catch (error) {

        } finally {
            hasRenderedSetter?.(false);

        }
    };

    const fetchData = async () => {



        const filterData = {
            "accountName": accountName, //  from SizingContext
            "opportunityNo": opportunityNo, //  from SizingContext
            "workLoadType": workLoadType, // Sent while calling the Generic Object
            "workLoadName": workLoadName // Sent while calling the Generic Object
        };

        try {
            setLoading(true);
            // Make POST request using axios
            //const response = await dataService.handleReadManyDoc(filterData)
            const response = await todoActions.readDoc(filterData)


            if (Array.isArray(response)) {

                // Access the data property on the response
                let documents: any;
                documents = response || [];

                let updatedCollections = documents.map((document: GenericCollectionData) => ({
                    ...document,
                    // Additional modifications if necessary
                }));



                // Check if updatedCollections is empty
                if (!Array.isArray(updatedCollections) || updatedCollections.length === 0) {

                    setCollections([]);
                    setShowCalculation(false);
                    console.log('inside 0 records');
                    sameUserDataSetter && sameUserDataSetter(true);
                    return null;

                } else {
                    setCollections(updatedCollections);
                    setShowCalculation(true);
                    return updatedCollections;
                }

            }

            else {
                // If response does not have valid data, handle it accordingly
                console.error("Invalid or empty response:", response);
            }


        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const updateTier = async () => {

        sameUserDataSetter && sameUserDataSetter(false);


        // Call the async function defined above
        const updatedCollections = await fetchData();

        calculationData = '';
        totalUncompressedSizeKB = 0;
        totalCompressedSizeKB = 0;
        totalDiskIOPS = 0;
        totalIndexes = 0;
        noOfIndexId = 0;
        try {

            setLoading(true);

            if (updatedCollections !== null) {

                // Use a for loop to iterate exactly twice
                for (let executionCount = 0; executionCount < 2 && updatedCollections !== null; executionCount++) {
                    // Iterate over each collection, calculate metrics, and print each element
                    if (executionCount == 1) {


                        if (cardDetailsContainer) {
                            cardDetailsContainer.innerHTML = '';
                        }


                        if (workingSetDetailsContainer) {
                            workingSetDetailsContainer.innerHTML = '';
                        }

                        const length = updatedCollections?.length || 0;

                        updatedCollections?.forEach((collection, index) => {
                            const iteration = index === length - 1 ? true : false;


                            sameUserDataSetter && sameUserDataSetter(user === collection.user);


                            calculateCollectionMetrics(collection, iteration);
                        });

                    }

                    // Introduce a 2-second delay before the next iteration
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

        } catch (error) {

        } finally {
            setLoading(false);


            hasRenderedSetter?.(true);
        }


    };


    const openModal = (data?: GenericCollectionData) => {
        if (data) {

            const existingCollectionIndex = mycollections.findIndex(col => col.nameCol === data.nameCol);

            if (existingCollectionIndex !== -1) {
                // If the collection with the same name already exists, update it
                const updatedCollections = [...mycollections];
                updatedCollections[existingCollectionIndex] = {
                    ...mycollections[existingCollectionIndex],
                    ...data,
                };
                setCollections(updatedCollections);
            } else {

                // If the collection does not exist, create a new one
                setCollections([...mycollections, data]);
            }

            setCollectionData(data); // Set GenericCollectionData to provided data

        } else {
            setCollectionData(initialCollectionData);
            setIndexName('');
            setIndexSize('');
        }

        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        hasRenderedSetter?.(false);
    };


    const deleteCollection = async (data?: GenericCollectionData) => {
        try {
            setLoading(true);
            if (data) {
                const deletedata = async () => {
                    const filterData = {
                        "accountName": data.accountName,
                        "opportunityNo": data.opportunityNo,
                        "workLoadType": data.workLoadType,
                        "workLoadName": data.workLoadName,
                        "nameCol": data.nameCol
                    };
                    // await dataService.handleDeleteDoc(filterData);
                    await todoActions.deleteDoc(filterData);
                };

                // Call the async function defined above
                deletedata();

            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            // Call the async function defined above
            updateTier();

        }

    };

    const calculateTotalDocuments = () => {
        const totalDocuments = parseInt(localCollectionData.totalDocuments || '0', 10);
        const multiplier = parseInt(localCollectionData.docMultiplier, 10);

        return totalDocuments * multiplier;
    };


    const handleDeleteTier = (index: number, workLoadType: string, workLoadName: string) => {

        try {
            setLoading(true);
            if (workLoadType && workLoadName && accountName && opportunityNo) {
                const deletedata = async () => {
                    const filterData = {
                        "accountName": accountName,
                        "opportunityNo": opportunityNo,
                        "workLoadType": workLoadType,
                        "workLoadName": workLoadName,
                    };
                    //const response = await dataService.handleDeleteCol(filterData);
                    const response = await todoActions.deleteDoc(filterData);


                    handleDeleteCard(index);
                    hasRenderedSetter?.(true);


                };
                // Call the async function defined above
                deletedata();
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            // Call the async function defined above
            updateTier();

        }

    };

    useEffect(() => {

        // Set initial form values when GenericCollectionData changes
        if (GenericCollectionData) {
            setCollectionData(GenericCollectionData);
        } else {
            // Reset form values when modal is opened for adding a new collection
            setCollectionData(initialCollectionData);
            updateTier();
        }

        if (!hasRendered) {
            updateTier();
        }

    }, [hasRendered, modalOpen, GenericCollectionData]);

    return (


        <div>

            <div>
                {/* Display your data here using the updatedCollections state */}
                {loading ? (
                    <div >

                        <Modal darkMode={false} open={true}>
                            <Spinner baseFontSize={13} description="Upating data.... " />
                        </Modal>

                    </div>
                ) : (


                    <Modal darkMode={false} open={false}>
                        <Spinner description="Upating data...." />
                    </Modal>

                )}


                <div className="callout-note">


                    <div className="grid-container-coachgtm">
                        {/* Row 1 */}
                        <div className="grid-item-left">
                            <Card darkMode={false} className="card-styles" as="article">
                                <section>
                                    {/* <h2>{workLoadName} | {workLoadType}</h2> */}
                                    <div >

                                        <h2>Business Rule: </h2>

                                        <div >
                                            {/* 
                                            <TextInput
                                                label="Total Document"
                                                // description="Description"
                                                placeholder="10000000"
                                                value={totalDoc}
                                                onChange={(e) => setTotalDoc(e.target.value)}
                                            />
                                            <br></br> */}
                                            <TextInput
                                                label="% of data accessed"
                                                // description="Description"
                                                placeholder="0.3"
                                                value={percentageNo}
                                                onChange={(e) => setPercentageNo(e.target.value)}
                                            />
                                            <br></br>

                                            <TextInput
                                                label="Wired Tiger Compression Ratio"
                                                // description="Description"
                                                placeholder="0.5"
                                                value={compressionRatio}
                                                onChange={(e) => setCompressionRatio(e.target.value)}
                                            />
                                            <br></br>
                                        </div>
                                        <div id="cardDetails"><div>


                                            This value will be default when you create a collection.


                                        </div></div>


                                    </div>
                                </section>


                            </Card>
                        </div>
                        <div className="grid-item-right">

                            <Card darkMode={false} className="card-styles" as="article">

                                <section id="collection-details">

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            {sameUser && (
                                                <><Button className={"buttonStyle2"} onClick={() => openModal()}>+ Collection</Button><Button style={{ marginRight: 10 }} onClick={() => handleDeleteTier(workLoadIndex, workLoadType, workLoadName)}>Remove <FontAwesomeIcon icon={faTrash} /></Button></>
                                            )}
                                            <Button onClick={() => updateTier()}     > <FontAwesomeIcon icon={faRefresh} /></Button>
                                        </div>
                                        <p style={{ fontSize: 14, color: '#00684a', marginLeft: 'auto' }}>
                                            <span style={{ color: 'black', paddingLeft: 5 }}>Tier:</span> {workLoadType} |
                                            <span style={{ color: 'black', paddingLeft: 5 }}>Name:</span> {workLoadName} |
                                            <span style={{ color: 'black', paddingLeft: 5 }}>Cloud:</span> {cloudProvider} - ACTIVE
                                        </p>
                                    </div>

                                    <br></br>

                                    {showCalculation ? (
                                        <table className="collection-table">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Total Documents</th>
                                                    <th>Avg Doc Size </th>
                                                    <th>% Frequently Accessed</th>
                                                    <th>Compress Ratio</th>
                                                    <th>Total Indexs</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {mycollections.map((col, index) => (
                                                    <tr key={index}>
                                                        <td>{col.nameCol}</td>
                                                        <td>{col.totalDocuments}</td>
                                                        <td>{col.avgDocumentSizeInKB}</td>
                                                        <td>{col.percentageFrequentlyAccessed}</td>
                                                        <td>{col.compressionRatio}</td>
                                                        <td>{col.totalIndex}</td>
                                                        <td>
                                                            {sameUser && (
                                                                <><Button className="button" onClick={() => openModal(col)}><FontAwesomeIcon icon={faEdit} /></Button><Button className="button" onClick={() => deleteCollection(col)}> <FontAwesomeIcon icon={faTrash} /></Button></>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                    ) : (
                                        <></>
                                    )}


                                </section>



                                <Modal open={modalOpen}>



                                    <h4 style={{ borderBottom: '2px solid #00684A', width: '40%', padding: '10px', marginBottom: '20px', color: '#00684A' }}>{GenericCollectionData ? 'Edit Collection' : 'Add Collection'} </h4>
                                    <div className="form-container">
                                        <div className="form-column">
                                            <TextInput
                                                label="Collection Name"
                                                value={GenericCollectionData?.nameCol || ''}
                                                onChange={(e) => setCollectionData((prevData) => ({ ...prevData!, nameCol: e.target.value }))}
                                            />
                                            <br></br>
                                            <TextArea className='text-area'
                                                label="Sample Doc (Copy paste one json doc)"
                                                value={GenericCollectionData?.sampleDocument || ''}
                                                onChange={(e) => setCollectionData((prevData) => {
                                                    try {
                                                        const parsedValue = JSON.parse(e.target.value);
                                                        const newSizeInBytes = JSON.stringify(parsedValue).length; // Calculate length in bytes
                                                        const newSizeInKB = newSizeInBytes / 1024; // Convert to kilobytes

                                                        return {
                                                            ...prevData!,
                                                            avgDocumentSizeInKB: newSizeInKB.toFixed(2),
                                                            sampleDocument: e.target.value,
                                                        };
                                                    } catch (error) {
                                                        console.error('Error parsing JSON:', error);
                                                        return prevData;
                                                    }
                                                })}
                                            />
                                            <br></br>
                                            -- OR --
                                            <br></br>  <br></br>
                                            <TextInput
                                                label="Enter Avg. Doc size in KB"
                                                value={GenericCollectionData?.avgDocumentSizeInKB || ''}
                                                onChange={(e) => {
                                                    const inputValue = parseFloat(e.target.value);
                                                    if (!isNaN(inputValue) && inputValue > 0.0) {
                                                        setCollectionData((prevData) => ({ ...prevData!, avgDocumentSizeInKB: e.target.value }))
                                                    }

                                                    else {
                                                        setCollectionData((prevData) => ({ ...prevData!, avgDocumentSizeInKB: e.target.value }))
                                                    }

                                                }
                                                }
                                            />



                                            <br></br>

                                            <h4 style={{ borderBottom: '2px solid #00684A', width: '40%', padding: '10px', marginBottom: '20px', color: '#00684A' }}>IOPS </h4>
                                            <TextInput
                                                label="New Documents Inserted Per Second"
                                                value={GenericCollectionData?.insertedPerSecond || '0'}
                                                onChange={(e) => setCollectionData((prevData) => ({ ...prevData!, insertedPerSecond: e.target.value }))}
                                            />
                                            <TextInput
                                                label="Documents Deleted Per Second"
                                                value={GenericCollectionData?.deletedPerSecond || '0'}
                                                onChange={(e) => setCollectionData((prevData) => ({ ...prevData!, deletedPerSecond: e.target.value }))}
                                            />
                                            <TextInput
                                                label="Reads Per Second"
                                                value={GenericCollectionData?.readsPerSecond || '0'}
                                                onChange={(e) => setCollectionData((prevData) => ({ ...prevData!, readsPerSecond: e.target.value }))}
                                            />
                                            <TextInput
                                                label="Updates Per Second"
                                                value={GenericCollectionData?.updatesPerSecond || '0'}
                                                onChange={(e) => setCollectionData((prevData) => ({ ...prevData!, updatesPerSecond: e.target.value }))}
                                            />



                                        </div>
                                        <div className="form-column">
                                       
                                            <div style={{ display: 'flex', border: '1px solid #ccc', backgroundColor: '#f9f9f9', padding: '10px', marginBottom: '20px' }}>
                                                <TextInput
                                                    label="Enter No."
                                                    name="totalDocuments"
                                                    value={(() => {
                                                        const totalDocuments = parseInt(GenericCollectionData?.totalDocuments || '0');

                                                        if (totalDocuments % 1000000 === 0) {
                                                            const quotient = Math.floor(totalDocuments / 1000000);
                                                            return quotient.toString() || totalDoc;
                                                        } else {
                                                            const quotient = Math.floor(totalDocuments / 1000);
                                                            return quotient.toString() || totalDoc;
                                                        }
                                                    })()}
                                                    onChange={(e) => setCollectionData((prevData) => {
                                                        try {
                                                            setLocalCollectionData((prevData) => ({ ...prevData!, totalDocuments: e.target.value }));
                                                            const totalDocuments = parseInt(e.target.value);
                                                            const multiplerValue = parseInt(localCollectionData.docMultiplier);
                                                            const totalCalculatedDoc = totalDocuments * multiplerValue;

                                                            return {
                                                                ...prevData!, totalDocuments: totalCalculatedDoc.toString()
                                                            };
                                                        } catch (error) {
                                                            console.error('Error in document no', error);
                                                            return prevData;
                                                        }
                                                    })}
                                                    style={{ marginRight: '10px' }}
                                                /> <h4 style={{ marginRight: '10px', marginTop: '35px' }}>x </h4>
                                                <Select
                                                    className="select-style"
                                                    label="Multiplier"
                                                    name="docMultiplier"
                                                    placeholder="Select"
                                                    size={Size.Large}
                                                    value={localCollectionData.docMultiplier}
                                                    onChange={(e) => setCollectionData((prevData) => {
                                                        try {
                                                            setLocalCollectionData((prevData) => ({ ...prevData!, docMultiplier: e }));
                                                            const totalDocuments = parseInt(localCollectionData.totalDocuments);
                                                            const multiplerValue = parseInt(e);
                                                            const totalCalculatedDoc = totalDocuments * multiplerValue;

                                                            return {
                                                                ...prevData!, totalDocuments: totalCalculatedDoc.toString()
                                                            };
                                                        } catch (error) {
                                                            console.error('Error in document no', error);
                                                            return prevData;
                                                        }
                                                    })}
                                                >
                                                    <Option value="1000">1K</Option>
                                                    <Option value="1000000">1M</Option>
                                                </Select>

                                                <br></br>

                                            
                                            </div>

                                            Total Documents
                                            = {calculateTotalDocuments()}
                                        
                               


                                            <h4 style={{ borderBottom: '2px solid #00684A', width: '40%', padding: '10px', marginBottom: '20px', color: '#00684A' }}>Storage </h4>

                                            <TextInput
                                                label="Percentage Frequently Accessed (< 1.0 ) "
                                                description='e.g. (1 is 100%, 0.1  is 10% & 0.01 is 1%)'
                                                value={GenericCollectionData?.percentageFrequentlyAccessed === '' ? '0.0' : GenericCollectionData?.percentageFrequentlyAccessed}
                                                onChange={(e) => setCollectionData((prevData) => ({ ...prevData!, percentageFrequentlyAccessed: e.target.value }))}
                                            />
                                            <TextInput
                                                label="Compression Ratio (< 1.0)"
                                                description='e.g. (1 is 100%, 0.1  is 10% & 0.01 is 1%)'
                                                value={GenericCollectionData?.compressionRatio === '' ? '0.0' : GenericCollectionData?.compressionRatio}
                                                onChange={(e) => setCollectionData((prevData) => ({ ...prevData!, compressionRatio: e.target.value }))}
                                            />

                                            <br></br>

                                            <h4 style={{ borderBottom: '2px solid #00684A', width: '40%', padding: '10px', marginBottom: '20px', color: '#00684A' }}>Index </h4>
                                            <div className="inline-inputs">

                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Name</th>
                                                            <th>Size </th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {GenericCollectionData?.indexes && GenericCollectionData.indexes.map((index, idx) => (
                                                            <tr key={idx}>
                                                                <td>{index.name}</td>
                                                                <td>{index.value}</td>
                                                                <td>
                                                                    <div className="index-actions">
                                                                        <IconButton onClick={() => deleteIndex(idx)} aria-label="Delete Index">
                                                                            <Icon glyph="Trash" />
                                                                        </IconButton>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="inline-inputs">


                                                <div>
                                                    <TextInput
                                                        label="Index Name"
                                                        value={indexName}
                                                        onChange={(e) => setIndexName(e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <TextInput
                                                        label="Index Size  in KB"
                                                        value={indexSize}
                                                        onChange={(e) => setIndexSize(e.target.value)}
                                                    />
                                                </div>
                                                <Button className="indexButton" onClick={addIndex}>Add</Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="button-container">
                                        <Converter />       
                                        <Button className="buttonStyle2" onClick={saveCollection}>Save</Button>
                                        <Button className="button" onClick={closeModal}>Close</Button>
                                    </div>

                                </Modal>


                                {showCalculation ? (
                                    <section >
                                        <h2>How it was calculated: {workLoadType}</h2>
                                        <div className="right-column">
                                            {/* Disk Capacity & Performance */}
                                            <div className="">
                                                <h4>Disk Capacity & Performance</h4>
                                                <div className="subTask">
                                                    Total Data size: {totalUncompressedSizeKB} KB | {(totalUncompressedSizeKB / 1000).toFixed(2)} MB | {(totalUncompressedSizeKB / 1000000).toFixed(2)} GB  = ( UncompressedSize + indexSize of collections )
                                                </div>
                                                <div className="subTask">
                                                    Disk IOPS (number of operations / 20): {totalDiskIOPS}
                                                </div>
                                                <div className="cardDetails" id="cardDetailsCalculation"></div>
                                                <br></br>

                                            </div>

                                            {/* Memory Requirements */}
                                            <div className="task">
                                                <h4>Memory Requirements</h4>
                                                <div className="subTask">
                                                    RAM Required: {ramRequired}
                                                </div>
                                                <br></br>
                                                <div className="subTask">
                                                    Sum of working set of each collection: <br />info: % accessed * (uncompressed docs + indexes)
                                                </div>
                                                <div className="workingSetDetails" id="workingSetDetails"></div>


                                                <div className="ramRequiredDetails" id="ramRequiredDetails"></div>
                                            </div>

                                            {/* CPU Requirements */}
                                            <div className="task">
                                                <h4>CPU Requirements</h4>
                                                <div className="subTask">
                                                    CPU Cores Required: {cpuCoreRequired}
                                                </div>
                                                <br></br>
                                                <div className="subTask">
                                                    Ops Per CPU Core <br />info: (12500 - 5% for each index other than _id):
                                                </div>
                                                <div className="opsPerCPUCoreDetails" id="opsPerCPUCoreDetails"></div>

                                            </div>
                                        </div>
                                    </section>
                                ) : (
                                    <FeaturedEmptyState />
                                )}



                            </Card>

                            <br></br>

                            {showCalculation ? (
                                <ExpandableCard
                                    title="Calculation details"

                                >
                                    <h4>Summary</h4>
                                    <h4>===========================</h4>
                                    <pre>{calculationData}</pre>
                                </ExpandableCard>
                            ) : (
                                <></>
                            )}


                        </div>
                    </div>
                </div >

            </div>

        </div >
    );
};



// Connect the component to Redux
export default Generic;


