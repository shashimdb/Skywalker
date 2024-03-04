// Search.tsx
import React, { MouseEvent, useEffect, useState } from 'react';
import Callout, { Variant } from '@leafygreen-ui/callout';
import Card from '@leafygreen-ui/card';
import TextInput from '@leafygreen-ui/text-input';
import Modal from '@leafygreen-ui/modal';
import Button from '@leafygreen-ui/button';
import Icon from "@leafygreen-ui/icon";
import IconButton from "@leafygreen-ui/icon-button";
import axios from 'axios';
import { useSizingContext, hasRenderedSetter, sameUserDataSetter } from '../context/SizingContext';
import { PageLoader, Spinner } from "@leafygreen-ui/loading-indicator";
import '../../css/Search.css'; // Import your CSS file
import DataService from '../service/DataSerice';
import { useMetrons } from "../../hooks/useMetrons";

import { Option, OptionGroup, Select, Size } from '@leafygreen-ui/select';
import ExpandableCard from "@leafygreen-ui/expandable-card";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { BasicEmptyState, FeaturesEmptyState } from '@leafygreen-ui/empty-state';
import { devNull } from 'os';
import Converter from '../utils/Converter';
import FeaturedEmptyState from '../utils/FeaturedEmptyState';

export let newValues: {
    Tier: string;
    RAM: string;
    Storage: string;
    vCPUs: string;
    active: boolean;
}

type JsonData = {
    [key: string]: {
        Tier: string;
        RAM_GB: string;
        Storage_GB: string;
        vCPUs: string;
        NVMe_Storage_GB: string;
        NVMe_vCPUs: string;
    };
};

interface SearchCalculationProps {
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

interface SearchIndex {
    name: string;
    value: string;
}


interface Index {
    name: string;
    value: string;
}



interface SearchCollectionData {
    _id: any;
    workLoadType: string;
    workLoadName: string;
    accountName: string;
    opportunityNo: string;
    cloudProvider: string;
    nameIndex: string;
    searchQueriesPSec: string;
    totalDocuments: string;
    textSearchFields: string;
    avgSizeTextPerField: string;
    autocompleteFields: string;
    avgSizeTextPerACField: string;
    dateFields: string;
    numericFields: string;
    numStringFacetFields: string;
    avgSizeFacetFields: string;
    numNumberFacetFields: string;
    numDateFacetFields: string;
    numSortFields: string;
    avgSizeSortFields: string;
    dateField: Date;
    user: string;
}


const Search: React.FC<SearchCalculationProps> = ({
    workLoadType,
    workLoadName,
    cloudProvider,
    workLoadIndex,
    content,
    updateCalculatedValues,
    handleDeleteCard,
}) => {


    const [myDeleteIndex, setDeleteIndex] = useState<number>(-1);
    const [updateIndex, setUpdateIndex] = useState<number>(-1);
    // State variables for dynamic values
    const [spinnerOpen, setSpinnerOpen] = useState(false);



    const [dataSource, setDataSource] = useState<string>("Cluster0");
    const [database, setDatabase] = useState<string>("SizingAtlas");
    const [collection, setCollection] = useState<string>("DevCollection");
    const { accountName, opportunityNo, user, hasRendered, sameUser } = useSizingContext();
    const [loading, setLoading] = useState(false);
    const initialCollectionData = {
        _id: null,
        workLoadType: '',
        workLoadName: '',
        accountName: '',
        opportunityNo: '',
        cloudProvider: '',
        nameIndex: '',
        searchQueriesPSec: '',
        totalDocuments: '',
        textSearchFields: '',
        avgSizeTextPerField: '',
        autocompleteFields: '',
        avgSizeTextPerACField: '',
        dateFields: '',
        numericFields: '',
        numStringFacetFields: '',
        avgSizeFacetFields: '',
        numNumberFacetFields: '',
        numDateFacetFields: '',
        numSortFields: '',
        avgSizeSortFields: '',
        dateField: new Date(),
        user: '',
    };
    // Your provided JSON data
    const jsonData: JsonData = {
        "M20": { "Tier": "M20", "RAM_GB": "1", "Storage_GB": "20", "vCPUs": "1", "NVMe_Storage_GB": "", "NVMe_vCPUs": "" },
        "M30": { "Tier": "M30", "RAM_GB": "2", "Storage_GB": "40", "vCPUs": "2", "NVMe_Storage_GB": "", "NVMe_vCPUs": "" },
        "M40": { "Tier": "M40", "RAM_GB": "4", "Storage_GB": "80", "vCPUs": "4", "NVMe_Storage_GB": "380", "NVMe_vCPUs": "2" },
        "M50": { "Tier": "M50", "RAM_GB": "8", "Storage_GB": "160", "vCPUs": "8", "NVMe_Storage_GB": "760", "NVMe_vCPUs": "4" },
        "M60": { "Tier": "M60", "RAM_GB": "16", "Storage_GB": "320", "vCPUs": "16", "NVMe_Storage_GB": "1600", "NVMe_vCPUs": "8" },
        "M80": { "Tier": "M80", "RAM_GB": "30", "Storage_GB": "750", "vCPUs": "32", "NVMe_Storage_GB": "1600", "NVMe_vCPUs": "16" },
        "HS20": { "Tier": "S20 (high-CPU)", "RAM_GB": "4", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "100", "NVMe_vCPUs": "2" },
        "HS30": { "Tier": "S30 (high-CPU)", "RAM_GB": "8", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "200", "NVMe_vCPUs": "4" },
        "HS40": { "Tier": "S40 (high-CPU)", "RAM_GB": "16", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "380", "NVMe_vCPUs": "8" },
        "HS50": { "Tier": "S50 (high-CPU)", "RAM_GB": "32", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "760", "NVMe_vCPUs": "16" },
        "HS60": { "Tier": "S60 (high-CPU)", "RAM_GB": "64", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "1600", "NVMe_vCPUs": "32" },
        "HS70": { "Tier": "S70 (high-CPU)", "RAM_GB": "96", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "2400", "NVMe_vCPUs": "48" },
        "HS80": { "Tier": "S80 (high-CPU)", "RAM_GB": "128", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "3200", "NVMe_vCPUs": "64" },
        "LS30": { "Tier": "S30 (low-CPU)", "RAM_GB": "8", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "50", "NVMe_vCPUs": "1" },
        "LS40": { "Tier": "S40 (low-CPU)", "RAM_GB": "16", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "100", "NVMe_vCPUs": "2" },
        "LS50": { "Tier": "S50 (low-CPU)", "RAM_GB": "32", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "200", "NVMe_vCPUs": "4" },
        "LS60": { "Tier": "S60 (low-CPU)", "RAM_GB": "64", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "380", "NVMe_vCPUs": "8" },
        "LS80": { "Tier": "S80 (low-CPU)", "RAM_GB": "128", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "760", "NVMe_vCPUs": "16" },
        "LS90": { "Tier": "S90 (low-CPU)", "RAM_GB": "256", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "1600", "NVMe_vCPUs": "32" },
        "LS100": { "Tier": "S100 (low-CPU)", "RAM_GB": "384", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "2400", "NVMe_vCPUs": "48" },
        "LS110": { "Tier": "S110 (low-CPU)", "RAM_GB": "512", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "3200", "NVMe_vCPUs": "64" }
    };

    ;
    const [indexName, setIndexName] = useState('');
    const [indexSize, setIndexSize] = useState('');
    const [isGridItemRightEnabled, setGridItemRightEnabled] = useState(false);
    const [totalDoc, setTotalDoc] = useState('0.1');
    const [percentageNo, setPercentageNo] = useState('3.33');
    const [modalOpen, setModalOpen] = useState(false);
    const [SearchCollectionData, setCollectionData] = useState<SearchCollectionData | null>(initialCollectionData);
    const [localCollectionData, setLocalCollectionData] = useState({ totalDocuments: '0', docMultiplier: '1000' });
    let [calculationData, setCalculationData] = useState('');
    const [showCalculation, setShowCalculation] = useState(false);




    const dataService = new DataService();
    const { ...todoActions } = useMetrons();

    let totalRequiredCPU = 0;
    let totalRequiredIndexStorageGB = 0;
    let totalRequiredStorageGB = 0;
    let totalRequiredFieldCacheSize = 0;
    let overallTotalStorage = 0;



    let uncompressedSizeKB = 0.0,
        uncompressedSizeGB = 0.0,
        uncompressedSizeTB = 0.0,
        compressedSizeKB = 0.0,
        compressedSizeGB = 0.0,
        compressedSizeTB = 0.0,
        averageDocumentSize = 0.0,
        totalDocuments = 0,
        percentageFrequentlyAccessed = 0,
        totalIndex = 0;
    let updatedCollections;
    let totalCompressedSizeKB = 0;
    let totalIndexes = 0;
    let noOfIndexId = 0;
    let [compressionRatio, setCompressionRatio] = useState('5');
    let [mycollections, setCollections] = useState<SearchCollectionData[]>([]);
    let [cpuCoreRequired, setCpuCoreRequired] = useState(0);
    let [storageRequired, setStorageRequired] = useState(0);
    let [indexStorageRequired, setIndexStorageRequired] = useState(0);
    let [ramRequired, setRamRequired] = useState(0);
    let [totalDiskIOPS, setTotalDiskIOPS] = useState(0);
    let [totalUncompressedSizeKB, setTotalUncompressedSizeKB] = useState(0);

    const defaultAvgSearchLatency = "0.1";
    const defaultStorageMultiFactor = "3.3";
    const defaultStorageMultiFactorAC = "5";
    const defaultDateFieldsBytes = "15";
    const defaultNumFieldsBytes = "19";
    const defaultNoFacetFieldsBytes = "19";
    const defaultNoDateFacetFieldsBytes = "19";

    // State variables to hold the input values
    const [avgSearchLatency, setAvgSearchLatency] = useState(defaultAvgSearchLatency);
    const [storageMultiFactor, setStorageMultiFactor] = useState(defaultStorageMultiFactor);
    const [storageMultiFactorAC, setStorageMultiFactorAC] = useState(defaultStorageMultiFactorAC);
    const [dateFieldsBytes, setDateFieldsBytes] = useState(defaultDateFieldsBytes);
    const [numFieldsBytes, setNumFieldsBytes] = useState(defaultNumFieldsBytes);
    const [noFacetFieldsBytes, setNoFacetFieldsBytes] = useState(defaultNoFacetFieldsBytes);
    const [noDateFacetFieldsBytes, setNoDateFacetFieldsBytes] = useState(defaultNoDateFacetFieldsBytes);


    useState(initialCollectionData);





    const calculateCollectionMetrics = async (searchCollectionData: SearchCollectionData, isComplete: boolean): Promise<void> => {


        calculationData += '\n';
        calculationData += 'Search Index: ' + searchCollectionData.nameIndex;
        calculationData += '\n';
        calculationData += '================================';
        calculationData += '\n';


        // Calculation 1
        const requiredCPU = Math.ceil(parseFloat(searchCollectionData.searchQueriesPSec) * 0.1);

        calculationData += `Step 1`;
        calculationData += '\n';
        calculationData += '';

        calculationData += 'requiredCPU = Math.ceil(' + parseFloat(searchCollectionData.searchQueriesPSec) + ' * 0.1) = ' + requiredCPU + ' \n\n';

        // Calculation 2
        const requiredIndexStorageGB = ((parseFloat(searchCollectionData.textSearchFields) * parseFloat(searchCollectionData.avgSizeTextPerField) * 3.33) +
            (parseFloat(searchCollectionData.autocompleteFields) * parseFloat(searchCollectionData.avgSizeTextPerACField) * 5) +
            (parseFloat(searchCollectionData.dateFields) * 15) +
            (parseFloat(searchCollectionData.numericFields) * 19)) * parseFloat(searchCollectionData.totalDocuments) * 0.000000001;

        calculationData += 'Step 2 \n';
        calculationData += ' requiredIndexStorageGB = (textSearchFields  * avgSizeTextPerField * 3.33) \n + (autocompleteFields  * avgSizeTextPerACField * 5) \n + (dateFields * 15) \n+ (numericFields) * 19)  * totalDocuments * 0.000000001; \n\n';
        calculationData += ' requiredIndexStorageGB = ((parseFloat(' + searchCollectionData.textSearchFields + ') \n * parseFloat(' + searchCollectionData.avgSizeTextPerField + ') * 3.33) (parseFloat(' + searchCollectionData.autocompleteFields + ') \n * parseFloat(' + searchCollectionData.avgSizeTextPerACField + ') * 5) \n + (parseFloat(' + searchCollectionData.dateFields + ') * 15) \n+ (parseFloat(' + searchCollectionData.numericFields + ') * 19)) \n * parseFloat(' + searchCollectionData.totalDocuments + ') * 0.000000001 = ' + requiredIndexStorageGB + ' \n\n';



        // Calculation 3
        const requiredStorageGB = requiredIndexStorageGB * 2;

        calculationData += 'Step 3 \n\n';
        calculationData += ' requiredStorageGB = requiredIndexStorageGB * 2; \n\n';
        calculationData += ' requiredStorageGB = ' + requiredIndexStorageGB + ' * 2 = ' + requiredStorageGB + ' \n\n';

        // Calculation 4

        const requiredFieldCacheSize = ((parseFloat(searchCollectionData.numStringFacetFields) * parseFloat(searchCollectionData.avgSizeFacetFields)) +
            (parseFloat(searchCollectionData.numNumberFacetFields) * 4) +
            (parseFloat(searchCollectionData.numDateFacetFields) * 8) +
            (parseFloat(searchCollectionData.numSortFields) * parseFloat(searchCollectionData.avgSizeSortFields))) * parseFloat(searchCollectionData.totalDocuments) * 0.000001;


        let totalStorage = Math.ceil((requiredIndexStorageGB + requiredStorageGB + requiredFieldCacheSize));

        calculationData += 'Step 4 \n\n';
        calculationData += '  requiredFieldCacheSize = ((numStringFacetFields * avgSizeFacetFields) \n + (numNumberFacetFields * 4) \n +  (numDateFacetFields * 8) \n + (numSortFields) * avgSizeSortFields)) \n * totalDocuments * 0.000001;\n\n';

        calculationData += '  requiredFieldCacheSize = ((parseFloat(' + searchCollectionData.numStringFacetFields + ') * parseFloat(' + searchCollectionData.avgSizeFacetFields + ')) \n + (parseFloat(' + searchCollectionData.numNumberFacetFields + ') * 4) \n +  (parseFloat(' + searchCollectionData.numDateFacetFields + ') * 8) \n + (parseFloat(' + searchCollectionData.numSortFields + ') * parseFloat(' + searchCollectionData.avgSizeSortFields + '))) \n * parseFloat(' + searchCollectionData.totalDocuments + ') * 0.000001 = ' + requiredFieldCacheSize + '\n\n';


        calculationData += ' \n totalStorage = Math.ceil((requiredIndexStorageGB + requiredStorageGB + requiredFieldCacheSize));';
        calculationData += ' \n totalStorage = Math.ceil((' + requiredIndexStorageGB + ' +' + requiredStorageGB + ' +' + requiredFieldCacheSize + ')) = ' + totalStorage + '\n\n';


        totalRequiredCPU += requiredCPU;
        totalRequiredIndexStorageGB += requiredIndexStorageGB;
        totalRequiredStorageGB += requiredStorageGB;
        totalRequiredFieldCacheSize += requiredFieldCacheSize;
        overallTotalStorage += totalStorage;



        // Log or use the calculated values as needed
        console.log("Required CPU:", totalRequiredCPU);
        console.log("Required Index Storage GB:", totalRequiredIndexStorageGB);
        console.log("Required Storage GB:", totalRequiredStorageGB);
        console.log("Required Field Cache Size:", totalRequiredFieldCacheSize);
        console.log("Required Total Storage GB:", overallTotalStorage);

        calculationData += 'Output \n\n';
        calculationData += "Required CPU:" + totalRequiredCPU + ' \n\n';
        calculationData += "Required Index Storage GB:" + totalRequiredIndexStorageGB + ' \n\n';
        calculationData += "Required Storage GB:" + totalRequiredStorageGB + ' \n\n';
        calculationData += "Required Field Cache Size:" + totalRequiredFieldCacheSize + ' \n\n\n';


        calculationData += "Required Total Storage GB:" + overallTotalStorage + ' \n\n';
        setCalculationData(calculationData);

        // Loop through each series
        type SeriesType = "M" | "HS" | "LS";

        function findNearestTier(cpu: number, storage: number, series: SeriesType): string | null {
            const seriesPrefix = series.toUpperCase();
            const seriesKeys = Object.keys(jsonData).filter(key => key.startsWith(seriesPrefix));

            let nearestTierByCPU: string | null = null;
            let nearestTierByStorage: string | null = null;
            let minDistanceCPU: number = Number.MAX_VALUE;
            let minDistanceStorage: number = Number.MAX_VALUE;

            for (const tier of seriesKeys) {
                const tierData = jsonData[tier];
                const tierCPU = Number(tierData.NVMe_vCPUs) || 0;
                const tierStorage = Number(tierData.NVMe_Storage_GB) || 0;

                // Find nearest tier based on requiredCPU = NVMe_vCPUs for each SeriesType
                const distanceCPU = Math.abs(cpu - tierCPU);
                if (distanceCPU < minDistanceCPU) {
                    minDistanceCPU = distanceCPU;
                    nearestTierByCPU = tier;
                }

                // Find nearest tier based on totalStorage = NVMe_Storage_GB for each SeriesType
                const distanceStorage = Math.abs(storage - tierStorage);
                if (distanceStorage < minDistanceStorage) {
                    minDistanceStorage = distanceStorage;
                    nearestTierByStorage = tier;
                }
            }


            // Choose the tier that is greater for each SeriesType
            if (nearestTierByCPU !== null && nearestTierByStorage !== null) {

                let highestTier: string | null = '';


                const nearestTierByStorageTemp = nearestTierByStorage?.toString().match(/\d+/);
                const nearestTierByStorageNumber = nearestTierByStorageTemp ? parseInt(nearestTierByStorageTemp[0], 10) : null;

                const nearestTierByCPUTemp = nearestTierByCPU?.toString().match(/\d+/);
                const nearestTierByCPUNumber = nearestTierByCPUTemp ? parseInt(nearestTierByCPUTemp[0], 10) : null;


                if (nearestTierByCPUNumber && nearestTierByStorageNumber) {
                    highestTier =
                        nearestTierByCPUNumber >= nearestTierByStorageNumber
                            ? nearestTierByCPU
                            : nearestTierByStorage || nearestTierByCPU;
                }

                return highestTier;
            }

            return null;
        }
        try {

            setCpuCoreRequired(totalRequiredCPU);
            setStorageRequired(overallTotalStorage);
            setIndexStorageRequired(totalRequiredIndexStorageGB);
            setRamRequired(totalRequiredFieldCacheSize);


            const mSeriesNearestTier = findNearestTier(totalRequiredCPU, overallTotalStorage, "M");
            const hsSeriesNearestTier = findNearestTier(totalRequiredCPU, overallTotalStorage, "HS");
            const lsSeriesNearestTier = findNearestTier(totalRequiredCPU, overallTotalStorage, "LS");

            console.log("Nearest M Series Tier:", mSeriesNearestTier);
            console.log("Nearest HS Series Tier:", hsSeriesNearestTier);
            console.log("Nearest LS Series Tier:", lsSeriesNearestTier);


            // Assume you have new values to update
            const newValues = {
                Tier: 'S',
                RAM: 'Base Tier: ' + mSeriesNearestTier,
                vCPUs: '<br>Search Tier: <br>High CPU ' + hsSeriesNearestTier?.slice(1),
                Storage: 'Low CPU ' + lsSeriesNearestTier?.slice(1),
                index: workLoadIndex,
                active: true,
                cloud: cloudProvider,
            };


            if (isComplete) {

                // Call the function passed from the parent to update the values
                updateCalculatedValues(newValues);
                setCollectionData(initialCollectionData);

            }



        } catch (error) {

        } finally {
            setCollectionData(initialCollectionData);
            // setHasRendered(false);
        }
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
                    "nameIndex": SearchCollectionData?.nameIndex
                };

                try {



                    // Make POST request using axios
                    //const response = await dataService.handleReadManyDoc(filterData)

                    const response = await todoActions.readDoc(filterData)

                    if (Array.isArray(response)) {

                        // Access the data property on the response
                        let documents: any;
                        documents = response || [];

                        const updatedCollections = documents.map((document: SearchCollectionData) => ({
                            ...document,
                            // Additional modifications if necessary
                        }));

                        const localData = {
                            workLoadType: workLoadType,
                            workLoadName: workLoadName,
                            accountName: accountName,
                            opportunityNo: opportunityNo,
                            cloudProvider: cloudProvider,
                            nameIndex: SearchCollectionData?.nameIndex,
                            searchQueriesPSec: SearchCollectionData?.searchQueriesPSec,
                            totalDocuments: SearchCollectionData?.totalDocuments,
                            textSearchFields: SearchCollectionData?.textSearchFields,
                            avgSizeTextPerField: SearchCollectionData?.avgSizeTextPerField,
                            autocompleteFields: SearchCollectionData?.autocompleteFields,
                            avgSizeTextPerACField: SearchCollectionData?.avgSizeTextPerACField,
                            dateFields: SearchCollectionData?.dateFields,
                            numericFields: SearchCollectionData?.numericFields,
                            numStringFacetFields: SearchCollectionData?.numStringFacetFields,
                            avgSizeFacetFields: SearchCollectionData?.avgSizeFacetFields,
                            numNumberFacetFields: SearchCollectionData?.numNumberFacetFields,
                            numDateFacetFields: SearchCollectionData?.numDateFacetFields,
                            numSortFields: SearchCollectionData?.numSortFields,
                            avgSizeSortFields: SearchCollectionData?.avgSizeSortFields,
                            dateField: new Date(),
                            user: user,
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
                }
            };

            // Call the async function defined above
            await fetchColData();
            closeModal();

        } catch (error) {

        } finally {
            hasRenderedSetter?.(false);
        }
    };

    const fetchData = async () => {

        const filterData = {
            "accountName": accountName,
            "opportunityNo": opportunityNo,
            "workLoadType": workLoadType,
            "workLoadName": workLoadName
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


                let updatedCollections = documents.map((document: SearchCollectionData) => ({
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
        // setHasRendered(true);
        sameUserDataSetter && sameUserDataSetter(false);

        try {
            // Call the async function defined above
            const updatedCollections = await fetchData();

            calculationData = '';
            totalUncompressedSizeKB = 0;
            totalCompressedSizeKB = 0;
            totalDiskIOPS = 0;
            totalIndexes = 0;
            noOfIndexId = 0;

            setLoading(true);

            if (updatedCollections !== null) {

                // Use a for loop to iterate exactly twice
                for (let executionCount = 0; executionCount < 2 && updatedCollections !== null; executionCount++) {

                    // Iterate over each collection, calculate metrics, and print each element
                    if (executionCount == 1) {

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

    const openModal = (data?: SearchCollectionData) => {
        // setLocalHasRendered(false);
        if (data) {
            console.log(data);
            const existingCollectionIndex = mycollections.findIndex(col => col.nameIndex === data.nameIndex);

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

            setCollectionData(data); // Set SearchCollectionData to provided data

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


    const deleteCollection = async (data?: SearchCollectionData) => {
        try {

            if (data) {
                const deletedata = async () => {
                    const filterData = {
                        "accountName": data.accountName,
                        "opportunityNo": data.opportunityNo,
                        "workLoadType": data.workLoadType,
                        "workLoadName": data.workLoadName,
                        "nameIndex": data.nameIndex
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
            setLoading(false);
        }

    };

    const calculateTotalDocuments = () => {
        console.log(localCollectionData);
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
        // Set initial form values when SearchCollectionData changes
        if (SearchCollectionData) {
            setCollectionData(SearchCollectionData);

        } else {
            // Reset form values when modal is opened for adding a new collection
            setCollectionData(initialCollectionData);

        }
        if (!hasRendered) {

            setCalculationData("");
            updateTier();
        }

    }, [hasRendered, modalOpen, SearchCollectionData]);

    return (

        <div>

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
                                        <TextInput
                                            label="Avg Search Latency (execution time in seconds)"
                                            placeholder="0.1"
                                            value={avgSearchLatency}
                                            onChange={(e) => setAvgSearchLatency(e.target.value)}
                                        />
                                        <br></br>
                                        <TextInput
                                            label="Storage multiplication factor (text)"
                                            placeholder="3.3"
                                            value={storageMultiFactor}
                                            onChange={(e) => setStorageMultiFactor(e.target.value)}
                                        />
                                        <br></br>
                                        <TextInput
                                            label="Storage multiplication factor (autocomplete)"
                                            placeholder="5"
                                            value={storageMultiFactorAC}
                                            onChange={(e) => setStorageMultiFactorAC(e.target.value)}
                                        />
                                        <br></br>
                                        <TextInput
                                            label="No. Date Fields in Bytes"
                                            placeholder="15"
                                            value={dateFieldsBytes}
                                            onChange={(e) => setDateFieldsBytes(e.target.value)}
                                        />
                                        <br></br>
                                        <TextInput
                                            label="No. Numeric Fields in Bytes"
                                            placeholder="19"
                                            value={numFieldsBytes}
                                            onChange={(e) => setNumFieldsBytes(e.target.value)}
                                        />
                                        <br></br>
                                        <TextInput
                                            label="No. Facet Fields in Bytes"
                                            placeholder="19"
                                            value={noFacetFieldsBytes}
                                            onChange={(e) => setNoFacetFieldsBytes(e.target.value)}
                                        />
                                        <br></br>
                                        <TextInput
                                            label="No. DateFacet Fields in Bytes"
                                            placeholder="19"
                                            value={noDateFacetFieldsBytes}
                                            onChange={(e) => setNoDateFacetFieldsBytes(e.target.value)}
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
                                            <><Button className={"buttonStyle2"} onClick={() => openModal()}>+ Search Index</Button><Button style={{ marginRight: 10 }} onClick={() => handleDeleteTier(workLoadIndex, workLoadType, workLoadName)}>Remove  <FontAwesomeIcon icon={faTrash} /></Button></>
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
                                                <th>Search Queries Per Second  </th>
                                                <th>Text Search Fields  </th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mycollections.map((col, index) => (
                                                <tr key={index}>
                                                    <td>{col.nameIndex}</td>
                                                    <td>{col.totalDocuments}</td>
                                                    <td>{col.searchQueriesPSec}</td>
                                                    <td>{col.searchQueriesPSec}</td>
                                                    <td>
                                                        {sameUser && (
                                                            <><Button className="button" onClick={(e: MouseEvent<HTMLButtonElement>) => openModal(col)}><FontAwesomeIcon icon={faEdit} /></Button><Button className="button" onClick={() => deleteCollection(col)}> <FontAwesomeIcon icon={faTrash} /></Button></>
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

                                <h2>{SearchCollectionData ? 'Edit Collection' : 'Add Collection'}</h2>
                                <TextInput
                                    label="Search Index Name"
                                    value={SearchCollectionData?.nameIndex || ''}
                                    onChange={(e) => setCollectionData((prevData) => ({ ...prevData!, nameIndex: e.target.value }))}
                                />
                                <TextInput
                                    label="Search Queries Per Second"
                                    value={SearchCollectionData?.searchQueriesPSec ? String(SearchCollectionData.searchQueriesPSec) : '0'}
                                    onChange={(e) => setCollectionData((prevData) => ({ ...prevData!, searchQueriesPSec: e.target.value }))}
                                />


                                {/* <TextInput
                                    label="Num Documents"
                                    value={SearchCollectionData?.totalDocuments ? String(SearchCollectionData.totalDocuments) : '0'}
                                    onChange={(e) => setCollectionData((prevData) => ({ ...prevData!, totalDocuments: e.target.value }))}
                                /> */}
                                <br></br>

                                <div style={{ display: 'flex', border: '1px solid #ccc', backgroundColor: '#f9f9f9', padding: '10px', marginBottom: '20px' }}>

                                    <div style={{ display: 'flex' }}>
                                        <TextInput
                                            label="Total Documents"
                                            name="totalDocuments"
                                            value={(() => {
                                                const totalDocuments = parseInt(SearchCollectionData?.totalDocuments || '0'); // Convert string to int


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
                                                    const totalCalculatedDoc = totalDocuments * multiplerValue; // Convert to kilobytes

                                                    return {
                                                        ...prevData!, totalDocuments: totalCalculatedDoc.toString()
                                                    };
                                                } catch (error) {
                                                    console.error('Error in document no', error);
                                                    return prevData;
                                                }
                                            })}
                                            style={{ marginRight: '10px' }}
                                        /> <h4 style={{ marginRight: '10px', marginTop: '35px', }}>x </h4>
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

                                                    const totalCalculatedDoc = totalDocuments * multiplerValue; // Convert to kilobytes


                                                    return {
                                                        ...prevData!, totalDocuments: totalCalculatedDoc.toString()
                                                    };
                                                } catch (error) {
                                                    console.error('Error in document no', error);
                                                    return prevData;
                                                }
                                            })} >

                                            <Option value="1000">1K</Option>
                                            <Option value="1000000">1M</Option>

                                        </Select>

                                    </div>

                                </div>
                                Total Documents
                                = {calculateTotalDocuments()}
                                <br></br>
                                <div className="form-container">
                                    <div className="form-column">


                                        <h4 style={{ borderBottom: '2px solid #00684A', width: '60%', padding: '10px', marginBottom: '20px', color: '#00684A' }}> Memory (field cache) </h4>
                                        <TextInput
                                            label="Average size of facet fields (B)"
                                            value={SearchCollectionData?.avgSizeFacetFields ? String(SearchCollectionData.avgSizeFacetFields) : '0'}
                                            onChange={(e) => setCollectionData((prevData) => ({ ...prevData!, avgSizeFacetFields: e.target.value }))}
                                        />
                                        <TextInput
                                            label="Number of numberFacet fields"
                                            value={SearchCollectionData?.numNumberFacetFields ? String(SearchCollectionData.numNumberFacetFields) : '0'}
                                            onChange={(e) => setCollectionData((prevData) => ({ ...prevData!, numNumberFacetFields: e.target.value }))}
                                        />
                                        <TextInput
                                            label="Number of dateFacet fields"
                                            value={SearchCollectionData?.numDateFacetFields ? String(SearchCollectionData.numDateFacetFields) : '0'}
                                            onChange={(e) => setCollectionData((prevData) => ({ ...prevData!, numDateFacetFields: e.target.value }))}
                                        />
                                        <TextInput
                                            label="Number of sortable fields"
                                            value={SearchCollectionData?.numSortFields ? String(SearchCollectionData.numSortFields) : '0'}
                                            onChange={(e) => setCollectionData((prevData) => ({ ...prevData!, numSortFields: e.target.value }))}
                                        />
                                        <TextInput
                                            label="Avg Size of sortable fields"
                                            value={SearchCollectionData?.avgSizeSortFields ? String(SearchCollectionData.avgSizeSortFields) : '0'}
                                            onChange={(e) => setCollectionData((prevData) => ({ ...prevData!, avgSizeSortFields: e.target.value }))}
                                        />



                                    </div>
                                    <div className="form-column">


                                        <h4 style={{ borderBottom: '2px solid #00684A', width: '40%', padding: '10px', marginBottom: '20px', color: '#00684A' }}> Storage </h4>


                                        <TextInput
                                            label="Text Search Fields"
                                            value={SearchCollectionData?.textSearchFields ? String(SearchCollectionData.textSearchFields) : '0'}
                                            onChange={(e) => setCollectionData((prevData) => ({ ...prevData!, textSearchFields: e.target.value }))}
                                        />
                                        <TextInput
                                            label="Average Size of text per field (B)"
                                            value={SearchCollectionData?.avgSizeTextPerField ? String(SearchCollectionData.avgSizeTextPerField) : '0'}
                                            onChange={(e) => setCollectionData((prevData) => ({ ...prevData!, avgSizeTextPerField: e.target.value }))}
                                        />
                                        <TextInput
                                            label="Autocomplete fields"
                                            value={SearchCollectionData?.autocompleteFields ? String(SearchCollectionData.autocompleteFields) : '0'}
                                            onChange={(e) => setCollectionData((prevData) => ({ ...prevData!, autocompleteFields: e.target.value }))}
                                        />


                                        <TextInput
                                            label="Average Size of text per autocomplete field (B)"
                                            value={SearchCollectionData?.avgSizeTextPerACField ? String(SearchCollectionData.avgSizeTextPerACField) : '0'}
                                            onChange={(e) => setCollectionData((prevData) => ({ ...prevData!, avgSizeTextPerACField: e.target.value }))}
                                        />
                                        <TextInput
                                            label=" Date Fields"
                                            value={SearchCollectionData?.dateFields ? String(SearchCollectionData.dateFields) : '0'}
                                            onChange={(e) => setCollectionData((prevData) => ({ ...prevData!, dateFields: e.target.value }))}
                                        />
                                        <TextInput
                                            label="Numeric Fields"
                                            value={SearchCollectionData?.numericFields ? String(SearchCollectionData.numericFields) : '0'}
                                            onChange={(e) => setCollectionData((prevData) => ({ ...prevData!, numericFields: e.target.value }))}
                                        />

                                        <TextInput
                                            label="Number of StringFacet fields"
                                            value={SearchCollectionData?.numStringFacetFields ? String(SearchCollectionData.numStringFacetFields) : '0'}
                                            onChange={(e) => setCollectionData((prevData) => ({ ...prevData!, numStringFacetFields: e.target.value }))}
                                        />
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
                                        <div className="task">
                                            <h4>vCPU Requirement</h4>
                                            <div className="subTask">Search CPU : {cpuCoreRequired}</div>
                                        </div>
                                        <div className="task">
                                            <h4>Storage Requirements</h4>
                                            <div className="subTask"> Search index storage (GB):  {indexStorageRequired.toFixed(6)}</div>
                                            <div className="subTask"> Storage required (GB):  {storageRequired}</div>
                                        </div>
                                        <div className="task">
                                            <h4>Memory Requirements</h4>
                                            <div className="subTask"> Field cache size (MB): {ramRequired.toFixed(3)}</div>
                                        </div>

                                        <div className="task">
                                            <br></br>



                                        </div>


                                    </div>
                                </section>
                            ) : (
                                <FeaturedEmptyState />
                            )}
                        </Card>
                        <br>
                        </br>
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
    );
};



// Connect the component to Redux
export default Search;


