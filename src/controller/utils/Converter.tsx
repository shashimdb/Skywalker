import React, { useState, useEffect } from 'react';
import Button from '@leafygreen-ui/button';
import TextInput from '@leafygreen-ui/text-input';
import { Tabs, Tab } from '@leafygreen-ui/tabs';
import Modal from '@leafygreen-ui/modal';
import LeafygreenProvider from '@leafygreen-ui/leafygreen-provider';
import { css } from '@leafygreen-ui/emotion'; // Add this import

const buttonStyle = css`
  margin: 2px;
  background-color: #00684A;
  color: #ffffff;
`;

const Converter: React.FC = () => {
    const [byteValue, setByteValue] = useState('');
    const [kbValue, setKbValue] = useState('');
    const [gbValue, setGbValue] = useState('');
    const [gbValue2, setGbValue2] = useState('');
    const [totalDocuments, setTotalDocuments] = useState('');
    const [avgDocSize, setAvgDocSize] = useState('');
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(0);

    const handleByteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setByteValue(value);
        if (!isNaN(parseFloat(value))) {
            const kb = parseFloat(value) / 1024;
            const gb = kb / (1024 * 1024 * 1024);
            setKbValue(kb.toFixed(2).toString());
            setGbValue(gb.toFixed(2).toString());
        } else {
            setKbValue('');
            setGbValue('');
        }
    };

    const handleKbChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setKbValue(value);
        if (!isNaN(parseFloat(value))) {
            const bytes = parseFloat(value) * 1024;
            const gb = parseFloat(value) / (1024 * 1024);
            setByteValue(bytes.toFixed(2).toString());
            setGbValue(gb.toFixed(2).toString());
        } else {
            setByteValue('');
            setGbValue('');
        }
    };

    const handleGbChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setGbValue(value);
        if (!isNaN(parseFloat(value))) {
            const bytes = parseFloat(value) * (1024 * 1024 * 1024);
            const kb = parseFloat(value) * (1024 * 1024);
            setByteValue(bytes.toFixed(2).toString());
            setKbValue(kb.toFixed(2).toString());
        } else {
            setByteValue('');
            setKbValue('');
        }
    };


    const handleGbValue2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGbValue2(e.target.value);

    };

    const handleTotalDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const gbValue2Int = parseInt(gbValue2);
        const totalDocumentsFloat = parseInt(totalDocuments) * 10;

        setTotalDocuments(e.target.value);

        const gbInKB = gbValue2Int * (1024 * 1024); // Convert gb to kilobytes
        const newAvgDocSize = (gbInKB / totalDocumentsFloat).toFixed(10).toString();
        setAvgDocSize(newAvgDocSize);

        console.log(gbValue2Int);

        console.log(totalDocumentsFloat);

        console.log(gbInKB);

        console.log(newAvgDocSize);

    };

    const handleAvgDocSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const gbValue2Int = parseInt(gbValue2);
        const avgDocSizeFloat = parseFloat(avgDocSize);


        setAvgDocSize(e.target.value);

        const gbInKB = gbValue2Int * (1024 * 1024); // Convert gb to kilobytes
        const newTotalDocuments = (gbInKB / avgDocSizeFloat).toFixed(10).toString();
        setTotalDocuments(newTotalDocuments);

    };




    return (
        <LeafygreenProvider>
            <Button className={buttonStyle} darkMode={true} onClick={() => setOpen(curr => !curr)}>Converter </Button>
            <Modal open={open} setOpen={setOpen}>
                <Tabs aria-labelledby="some-id" setSelected={setSelected} selected={selected}>
                    <Tab name="General">
                        <div>
                            <h4> Converted</h4>
                            <label>
                                <TextInput label="Bytes:" type="text" value={byteValue} onChange={handleByteChange} />
                            </label>
                            <br />
                            <label>
                                <TextInput label="Kilobytes:" type="text" value={kbValue} onChange={handleKbChange} />
                            </label>
                            <br />
                            <label>
                                <TextInput label="Gigabytes:" type="text" value={gbValue} onChange={handleGbChange} />
                            </label>
                        </div>
                    </Tab>
                    <Tab name="By Total Size">
                        <div>
                            <h4> Find Avg Doc size & Total Document</h4>
                            <label>
                                <TextInput label="Gigabytes:" type="text" value={gbValue2} onChange={handleGbValue2Change} />
                            </label>
                            <br />
                            <label>
                                <TextInput label="Total Document:" type="text" value={totalDocuments} onChange={handleTotalDocumentsChange} />
                            </label>
                            <br />
                            <label>
                                <TextInput label="Avg Doc in KB:" type="text" value={avgDocSize} onChange={handleAvgDocSizeChange} />
                            </label>
                        </div>
                    </Tab>
                </Tabs>
            </Modal>
        </LeafygreenProvider>
    );
};

export default Converter;
