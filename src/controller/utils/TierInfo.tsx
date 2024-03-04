import Modal from '@leafygreen-ui/modal';
import React, { useEffect, useState } from 'react';
import Button from '@leafygreen-ui/button';

import '../../css/TierInfo.css';


interface JsonData {
    [key: string]: {
        Tier: string;
        RAM_GB: string;
        Storage_GB: string;
        vCPUs: string;
        NVMe_Storage_GB: string;
        NVMe_vCPUs: string;
    };
}

const jsonData: JsonData = {
    "M10": { "Tier": "M10", "RAM_GB": "2 GB", "Storage_GB": "10 GB", "vCPUs": "2", "NVMe_Storage_GB": "", "NVMe_vCPUs": "" },
    "M20": { "Tier": "M20", "RAM_GB": "4 GB", "Storage_GB": "20 GB", "vCPUs": "2", "NVMe_Storage_GB": "", "NVMe_vCPUs": "" },
    "M30": { "Tier": "M30", "RAM_GB": "8 GB", "Storage_GB": "40 GB", "vCPUs": "2", "NVMe_Storage_GB": "", "NVMe_vCPUs": "" },
    "M40": { "Tier": "M40", "RAM_GB": "16 GB", "Storage_GB": "80 GB", "vCPUs": "4", "NVMe_Storage_GB": "", "NVMe_vCPUs": "" },
    "M50": { "Tier": "M50", "RAM_GB": "32 GB", "Storage_GB": "160 GB", "vCPUs": "8", "NVMe_Storage_GB": "", "NVMe_vCPUs": "" },
    "M60": { "Tier": "M60", "RAM_GB": "64 GB", "Storage_GB": "320 GB", "vCPUs": "16", "NVMe_Storage_GB": "", "NVMe_vCPUs": "" },
    "M80": { "Tier": "M80", "RAM_GB": "128 GB", "Storage_GB": "750 GB", "vCPUs": "32", "NVMe_Storage_GB": "", "NVMe_vCPUs": "" },
    "M140": { "Tier": "M140", "RAM_GB": "192 GB", "Storage_GB": "1000 GB", "vCPUs": "48", "NVMe_Storage_GB": "", "NVMe_vCPUs": "" },
    "M200": { "Tier": "M200", "RAM_GB": "256 GB", "Storage_GB": "1500 GB", "vCPUs": "64", "NVMe_Storage_GB": "", "NVMe_vCPUs": "" },
    "M300": { "Tier": "M300", "RAM_GB": "384 GB", "Storage_GB": "2000 GB", "vCPUs": "96", "NVMe_Storage_GB": "", "NVMe_vCPUs": "" },
    "M400": { "Tier": "M400", "RAM_GB": "512 GB", "Storage_GB": "3000 GB", "vCPUs": "64", "NVMe_Storage_GB": "", "NVMe_vCPUs": "" },
    "M700": { "Tier": "M700", "RAM_GB": "768 GB", "Storage_GB": "4096 GB", "vCPUs": "96", "NVMe_Storage_GB": "", "NVMe_vCPUs": "" },
    "HS20": { "Tier": "S20 (high-CPU)", "RAM_GB": "4 GB", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "100 GB", "NVMe_vCPUs": "2" },
    "HS30": { "Tier": "S30 (high-CPU)", "RAM_GB": "8 GB", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "200 GB", "NVMe_vCPUs": "4" },
    "HS40": { "Tier": "S40 (high-CPU)", "RAM_GB": "16 GB", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "380 GB", "NVMe_vCPUs": "8" },
    "HS50": { "Tier": "S50 (high-CPU)", "RAM_GB": "32 GB", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "760 GB", "NVMe_vCPUs": "16" },
    "HS60": { "Tier": "S60 (high-CPU)", "RAM_GB": "64 GB", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "1600 GB", "NVMe_vCPUs": "32" },
    "HS70": { "Tier": "S70 (high-CPU)", "RAM_GB": "96 GB", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "2400 GB", "NVMe_vCPUs": "48" },
    "HS80": { "Tier": "S80 (high-CPU)", "RAM_GB": "128 GB", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "3200 GB", "NVMe_vCPUs": "64" },
    "LS30": { "Tier": "S30 (low-CPU)", "RAM_GB": "8 GB", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "50 GB", "NVMe_vCPUs": "1" },
    "LS40": { "Tier": "S40 (low-CPU)", "RAM_GB": "16 GB", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "100 GB", "NVMe_vCPUs": "2" },
    "LS50": { "Tier": "S50 (low-CPU)", "RAM_GB": "32 GB", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "200 GB", "NVMe_vCPUs": "4" },
    "LS60": { "Tier": "S60 (low-CPU)", "RAM_GB": "64 GB", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "380 GB", "NVMe_vCPUs": "8" },
    "LS80": { "Tier": "S80 (low-CPU)", "RAM_GB": "128 GB", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "760 GB", "NVMe_vCPUs": "16" },
    "LS90": { "Tier": "S90 (low-CPU)", "RAM_GB": "256 GB", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "1600 GB", "NVMe_vCPUs": "32" },
    "LS100": { "Tier": "S100 (low-CPU)", "RAM_GB": "384 GB", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "2400 GB", "NVMe_vCPUs": "48" },
    "LS110": { "Tier": "S110 (low-CPU)", "RAM_GB": "512 GB", "Storage_GB": "", "vCPUs": "", "NVMe_Storage_GB": "3200 GB", "NVMe_vCPUs": "64" }
};

const TierInfo: React.FC = ( ) => {
    const [open, setOpen] = useState(false);



   // Filter the JSON data for M series
   const mSeriesData: JsonData = Object.entries(jsonData)
   .filter(([key, value]) => key.startsWith('M'))
   .reduce((acc, [key, value]) => {
       acc[key] = value;
       return acc;
   }, {} as JsonData);

// Filter the JSON data for HS series
const hsSeriesData: JsonData = Object.entries(jsonData)
   .filter(([key, value]) => key.startsWith('HS'))
   .reduce((acc, [key, value]) => {
       acc[key] = value;
       return acc;
   }, {} as JsonData);

// Filter the JSON data for LS series
const lsSeriesData: JsonData = Object.entries(jsonData)
   .filter(([key, value]) => key.startsWith('LS'))
   .reduce((acc, [key, value]) => {
       acc[key] = value;
       return acc;
   }, {} as JsonData);

    // Render table function
    const renderTable = (series: string, data: JsonData) => {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Tier</th>
                        <th>RAM (GB)</th>
                        <th>Storage (GB)</th>
                        <th>vCPUs</th>
                        <th>NVMe Storage (GB)</th>
                        <th>NVMe vCPUs</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(data).map(tier => (
                        <tr key={tier}>
                            <td>{data[tier].Tier}</td>
                            <td>{data[tier].RAM_GB}</td>
                            <td>{data[tier].Storage_GB}</td>
                            <td>{data[tier].vCPUs}</td>
                            <td>{data[tier].NVMe_Storage_GB}</td>
                            <td>{data[tier].NVMe_vCPUs}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
 
            <><Button  onClick={() => setOpen((curr) => !curr)}>
            Tier Info
        </Button><Modal open={open} setOpen={setOpen}>
                <div className="tier-info">
                    <h2>Generic Tier </h2>
                    {renderTable('M Series', mSeriesData)}

                    <h2>Search Tier - High CPU</h2>
                    {renderTable('HS Series', hsSeriesData)}

                    <h2>Search Tier - Low CPU</h2>
                    {renderTable('LS Series', lsSeriesData)}
                </div>
            </Modal></>
   
    );
};

export default TierInfo;
