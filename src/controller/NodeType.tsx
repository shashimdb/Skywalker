import Modal from '@leafygreen-ui/modal';
import { useState } from 'react';
import Button from '@leafygreen-ui/button';
import TextInput from '@leafygreen-ui/text-input';
import { Option, OptionGroup, Select, Size } from '@leafygreen-ui/select';
import { css, keyframes } from '@leafygreen-ui/emotion';
import LeafygreenProvider from '@leafygreen-ui/leafygreen-provider';

import { hasRenderedSetter, cardIndexSetter, useSizingContext, sameUserDataSetter } from './context/SizingContext';


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

const containerStyle = css`
  display: flex;
  flex-direction: column;
  height: 100%; /* Ensure the container fills the parent's height */
`;

const contentStyle = css`
  flex: 1; /* Allow the content to grow and fill the available space */
`;

const buttonContainerStyle = css`
  display: flex;
  justify-content: flex-end; /* Align the button to the right */
  margin-top: 15px; /* Adjust margin as needed */
`;


interface NodeTypeProps {
  handleWorkLoadConfirmClick: (workLoadType: string, workLoadName: string, cloudProvider: string, index: number, active: boolean) => void;
}

const WorkLoadType: React.FC<NodeTypeProps> = ({ handleWorkLoadConfirmClick }) => {
  const [open, setOpen] = useState(false);
  const [workLoadType, setworkLoadType] = useState('');
  const [workLoadName, setworkLoadName] = useState('');
  const [cloudProvider, setcloudProvider] = useState('');
  const { cardIndex, sameUser } = useSizingContext();


  const localHandleConfirmClick = () => {
    handleWorkLoadConfirmClick(workLoadType, workLoadName, cloudProvider, cardIndex, false);
    // Increment workLoadIndex
    cardIndexSetter?.(cardIndex + 1);
    setOpen(false); // Close the modal after confirming
    hasRenderedSetter?.(false);
    sameUserDataSetter && sameUserDataSetter(true);
  };

  return (
    <div className={containerStyle}>
    <LeafygreenProvider>
    <div className={contentStyle}>
    {sameUser && (
      <Button className={buttonStyle} darkMode={true} onClick={() => setOpen(curr => !curr)}>+ New Workload</Button>
    )}
      <Modal open={open} setOpen={setOpen}>
        <h1>Enter New Workload </h1>

        <Select
          label="Workload Type"
          // description="Description"
          placeholder="Select an option"
          size={Size.Default}
          value={workLoadType}
          onChange={(value) => setworkLoadType(value)}
        >
          <Option value="Generic">Generic</Option>
          <Option value="Search">Search</Option>
          <OptionGroup label="Options Not Yet Available (Do not select)">
            <Option value="Analytical">Analytical</Option>
            <Option value="Vector">Vector</Option>
            <Option value="Time Series">Time Series</Option>
          </OptionGroup>

        </Select>

        <br></br>



        <Select
          label="Cloud Provider"
          // description="Description"
          placeholder="Select an option"
          size={Size.Default}
          value={cloudProvider}
          onChange={(value) => setcloudProvider(value)}
        >
          <Option value="AWS">AWS</Option>
          <Option value="Azure">Azure</Option>
          <Option value="GCP">GCP</Option>
        </Select>

        <br></br>

        <TextInput
          label="WorkLoad Name"
          // description="Description"
          placeholder="10gen"
          value={workLoadName}
          onChange={(e) => setworkLoadName(e.target.value)}
        />

        <br></br>

        <div className={buttonContainerStyle}>
        <Button className={buttonStyle2} onClick={localHandleConfirmClick}>
          Confirm
        </Button>
        </div>
      </Modal>
      </div>
    </LeafygreenProvider>
    </div>
  );
};


export default WorkLoadType;
