import React, { useEffect, useState } from 'react';
import { css, keyframes } from '@leafygreen-ui/emotion';
import LeafygreenProvider from '@leafygreen-ui/leafygreen-provider';
import { MongoDBLogoMark } from '@leafygreen-ui/logo';
import Button from '@leafygreen-ui/button';
import Card from '@leafygreen-ui/card';
import Modal from '@leafygreen-ui/modal';
import { Tabs, Tab } from '@leafygreen-ui/tabs';
import Generic from './controller/workload/Generic';
import Search from './controller/workload/Search';
import SaveButton from './controller/SaveButton';
import NodeType from './controller/NodeType';
import TierInfo from './controller/utils/TierInfo';
import CurrentUrlGenerator from './controller/utils/CurrentUrlGenerator';

import { SizingProvider } from './controller/context/SizingContext';
import FAQ from './controller/utils/FAQ';

import SearchBox from './controller/utils/SearchBox';
import UserSizingList from './controller/utils/UserSizingList';
import BasicEmptyState from './controller/utils/BasicEmptyState';

import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

import DataService from './controller/service/DataSerice';
import { sizingDataSetter, userDataSetter, useSizingContext, hasRenderedSetter, cardIndexSetter } from './controller/context/SizingContext';

import { AppProvider, useApp } from "./RealmApp";
import { useMetrons } from "./hooks/useMetrons";

const leafAnimation = keyframes`
  from {
    transform: rotate(-5deg);
  }
  to {
    transform: rotate(5deg);
  }
`;

const logoStyle = css`
  display: inline-block;
  margin: 2px;
  animation: ${leafAnimation} 1s infinite alternate-reverse ease-in-out;
  transform-origin: 50% 100%;
`;

const logoStyleFont = css`
  display: inline-block;
  margin: 2px;
  font-size: 50px;
  transform-origin: 50% 100%;
  font-family: 'MongoDB Value Serif','Times New Roman',serif;
  color: #00684A
`;

const logoHeader = css`
border-bottom: 0.5px solid #000;
  margin: 2px;
  transform-origin: 50% 100%;
`;

const sizingHeaderLeft = css`
font-family: 'MongoDB Value Serif','Times New Roman',serif;
margin: 2px;
font-size: 30px;
transform-origin: 50% 100%;
color: #00684A;
text-align: left;
`;

const searchBox = css`
width: 300%;
border-radius: 10px; 
border: 2px solid #00684A;
`;

const sizingHeaderRight = css`
font-family: 'MongoDB Value Serif','Times New Roman',serif;
font-size: 30px;
transform-origin: 50% 100%;
color: #00684A;
padding: 10px;
`;

const searchBar = css`
  width: 100%;
`;

const searchInput = css`
  flex: 1;
  padding: 1px;
  font-size: 16px;
  width : 20px;
`;

const flexContainer = css`
  display: flex;
  gap: 10px; /* Adjust the gap as needed */
  align-items: center;
  justify-content: space-between;
  padding-top: 1%;
  padding-left: 1%;
  margin-bottom: 10px;
  width: 100%; /* Take up full width of the parent container */
`;

const selectStyle = css`
  flex: 1; /* This makes the Select components take equal width */
`;

const buttonStyle = css`
  /* Add any additional styles for the button if needed */
  margin: 2px;

`;

const buttonCardStyle = css`
   /* Add any additional styles for the button if needed */

   background-color: #00684A;
   color: #ffffff;

   display: flex;
   justify-content: flex-end;
`;

const cardContainer = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  // margin: 2px;
`;

const cardStyles = css`
   width: 32%; /* Set the desired width for each card */
  //  border-bottom: 1px solid #00684A;
  //  border-right: 1px solid #00684A;
   background-color: #ffffff;
   margin-right: 10px;
   margin-bottom: 15px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5); /* Add a shadow effect */
`;

const cardStyleHeader = css`
display: flex;
background: #00684A;
padding: 10px;
borderRadius:'5px; 
`;

const table = css`
    width: 100%;
    margin-top: 10px;
    display: table;
    border-collapse: separate;
    box-sizing: border-box;
    text-indent: initial;
    border-spacing: 2px;
    border-color: gray;
`;

const wrapperStyle = css`
  display: grid;
  grid-template-columns: auto auto;
  gap: 10px; /* Adjust as needed */
`;

const leftColumnStyle = css`
  display: flex;
  align-items: center;
`;

const rightColumnStyle = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Metron: React.FC<{}> = () => {

  const { currentUser, logOut } = useApp();
  const { ...todoActions } = useMetrons();

  const todoDocument = {
    name: currentUser?.profile.email.toString(),
    createdAt: new Date()
  };

  currentUser && todoActions.saveTodo(todoDocument);
  if (currentUser && userDataSetter) {
    userDataSetter(currentUser.profile.email.toString());
  }



  const [selected, setSelected] = useState(0);
  const [accountName, setAccountName] = useState('');
  const [opportunityNo, setOppNumber] = useState('');
  const [estimateText, setEstimateText] = useState('');
  const [cards, setCards] = useState<React.ReactNode[]>([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [shouldRefreshCalculation, setShouldRefreshCalculation] = useState({
    workLoadType: '',
    workLoadName: '',
    accountName: '',
    opportunityNo: '',
    cloudProvider: '',
    workLoadIndex: 0,
    content: '',
  });
  const [calculatedValues, setCalculatedValues] = useState<Array<{ Tier: string; RAM: string; Storage: string; vCPUs: string; workLoadIndex: number; active: boolean; cloud: string; }>>([]);
  const [firstEffectCompleted, setFirstEffectCompleted] = useState(false);

  // const className = isActive ? 'active' : 'inactive';


  let updateCalculatedValues = (newValues: { Tier: string; RAM: string; Storage: string; vCPUs: string; workLoadIndex: number; active: boolean; cloud: string; }) => {

    setCalculatedValues((prevValues) => {
      // If prevValues is undefined, initialize it as an empty object
      const currentValues = prevValues || {};


      // Update the properties of the object using workLoadIndex as the key
      const updatedValues = {

        ...currentValues,
        ...newValues,

      };
      return updatedValues;
    });





  };


  // Example values, replace them with your actual values

  var shouldRenderCalculationTab = false;
  let _accountName = '';
  let _opportunityNo = '';
  var cloudProvider = '';
  var workLoadType = '';
  var workLoadName = '';

  function getQueryStringParams() {
    return new URLSearchParams(window.location.search);
  }

  const dataService = new DataService();

  // Function to handle query string parameters
  const handleQueryString = async (accountName: string, opportunityNo: string) => {




    // if (userDataSetter) {
    //   userDataSetter("joe smith");
    // }

    if (accountName && opportunityNo) {



      // Now you can use sizingDataSetter in this file
      if (sizingDataSetter) {
        sizingDataSetter(accountName, opportunityNo);
      }

      // Call handleConfirmClick with parsed values
      handleConfirmClick(accountName, opportunityNo);

      // Make an API call to get data based on parsed values
      const filterData = {
        "accountName": accountName,
        "opportunityNo": opportunityNo
      };



      //const response = await dataService.handleFetchWorkloads(filterData);
      const response = await todoActions.fetchworkloads(filterData);

      // Map each document to a promise
      const promises = response.map(async (document: { workLoadType: string; workLoadName: string; cloudProvider: string; accountName: string; opportunityNo: string; workLoadIndex: number; }, index: number) => {
        cardIndexSetter?.(index + 1);
        return handleOnloadWorkLoadConfirmClick(document.workLoadType, document.workLoadName, document.cloudProvider, index, document.accountName, document.opportunityNo, false);
      });

      // Wait for all promises to resolve
      await Promise.all(promises);
    }
  };


  const handleConfirmClick = (accountName: string, opportunityNo: string) => {
    const message = `<div style="border-left: 1px solid #00684A;padding:5px;">
    <div style="font-size: 14px;color:#00684A; margin-bottom: 5px;">
        <strong>Account Name:</strong>
        ${accountName}
    </div>
    <div style="font-size: 15px;color: black;">
        <strong>Opportunity No:</strong>
        ${opportunityNo}
    </div>
</div> `;
    setAccountName(accountName);
    setOppNumber(opportunityNo);
    // Update the estimate text
    setEstimateText(message);
  };

  const handleOnloadWorkLoadConfirmClick = async (workLoadType: string, workLoadName: string, cloudProvider: string, workLoadIndex: number, accountName: string, opportunityNo: string, active: boolean) => {
    return new Promise<void>((resolve, reject) => {
      try {
        setAccountName(accountName);
        setOppNumber(opportunityNo);

        setShouldRefreshCalculation({
          workLoadType: workLoadType,
          workLoadName: workLoadName,
          accountName: accountName,
          opportunityNo: opportunityNo,
          cloudProvider: cloudProvider,
          workLoadIndex: workLoadIndex,
          content: '',
        });


        // Update the state with sample data
        setCalculatedValues([
          {
            Tier: '--',
            RAM: '--,',
            Storage: '--',
            vCPUs: '--',
            workLoadIndex: workLoadIndex,
            active: false,
            cloud: cloudProvider,
          },
          // Add more objects as needed
        ]);



        const message = (

          <div onClick={() => handleViewCard(workLoadType, workLoadName, accountName, opportunityNo, cloudProvider, workLoadIndex)}>
            <div style={{ display: 'flex', padding: '8px', borderRadius: '5px' }} id={workLoadIndex.toString()}>
              {/* First Column */}

              <div style={{ flex: 1, marginRight: '10px', marginTop: '35px' }}>
                <h6 id={`tier-${workLoadIndex}`} style={{ margin: 0, fontSize: '50px' }}>-- </h6>
              </div>

              {/* Second Column */}
              <div style={{ flex: 1, fontSize: 14, borderRadius: '5px', padding: '5px' }}>
                <table>
                  <tbody>
                    -- <br />-- <br /> --<br />
                  </tbody>
                </table>
              </div>

              {/* Third Column */}

              <div style={{ flex: 1, marginRight: '10px' }}>
                <sub style={{ margin: 0, fontSize: '12px' }}>



                  {cloudProvider === 'Azure' && <img id={`cloudProviderLogo-${workLoadIndex}`} src="azure_logo_w.png" alt="Azure" width="40" height="30" />}
                  {cloudProvider === 'AWS' && <img id={`cloudProviderLogo-${workLoadIndex}`} src="aws_logo_w.png" alt="AWS" width="50" height="30" />}
                  {cloudProvider === 'GCP' && <img id={`cloudProviderLogo-${workLoadIndex}`} src="gcp_logo_w.png" alt="GCP" width="40" height="30" />}


                  <br></br>
                  {workLoadType} Tier <br />
                  <span style={{ fontWeight: 700, fontSize: '12px' }}> {workLoadName} </span>

                  <br />

                </sub>
              </div>

            </div>
            <div className={buttonCardStyle} >
              <span>
                {/* <Button darkMode={true} className={buttonCardStyle} onClick={() => handleViewCard(workLoadType, workLoadName, accountName, opportunityNo, cloudProvider, workLoadIndex)}
            >
              View
            </Button> */}
                {/* <Button darkMode={true} className={buttonCardStyle} onClick={() => handleDeleteCard(workLoadIndex)}>remove </Button> */}

              </span>
            </div>
          </div>
        )

        // Update the estimate text
        setCards(prevCards => [...prevCards, message]);
        resolve(); // Resolve the promise if everything is successful
      } catch (error) {
        console.error("Error in handleOnloadWorkLoadConfirmClick:", error);
        reject(error); // Reject the promise if there's an error
      }
    });
  };

  const handleWorkLoadConfirmClick = (workLoadType: string, workLoadName: string, cloudProvider: string, workLoadIndex: number, active: boolean) => {
    // Update the state to render the Calculation component
    setShouldRefreshCalculation({
      workLoadType: workLoadType,
      workLoadName: workLoadName,
      accountName: _accountName,
      opportunityNo: _opportunityNo,
      cloudProvider: cloudProvider,
      workLoadIndex: workLoadIndex,
      content: '',
    });


    // Update the state with sample data
    setCalculatedValues([
      {
        Tier: '--',
        RAM: '--,',
        Storage: '--',
        vCPUs: '--',
        workLoadIndex: workLoadIndex,
        active: false,
        cloud: cloudProvider,
      },
      // Add more objects as needed
    ]);

    // Add a new card with its index
    const index = cards.length;

    const message = (
      <div onClick={() => handleViewCard(workLoadType, workLoadName, accountName, opportunityNo, cloudProvider, workLoadIndex)}>
        <div style={{ display: 'flex', padding: '8px', borderRadius: '5px' }} id={index.toString()}>
          {/* First Column */}

          <div style={{ flex: 1, marginRight: '10px', marginTop: '35px' }}>
            <h6 id={`tier-${index}`} style={{ margin: 0, fontSize: '50px' }}>-- </h6>
          </div>


          {/* Second Column */}
          <div style={{ flex: 1, fontSize: 14, borderRadius: '5px', padding: '5px' }}>
            <table>
              <tbody>
                -- <br />-- <br /> --<br />
              </tbody>
            </table>
          </div>

          {/* Third Column */}

          <div style={{ flex: 1, marginRight: '10px' }}>
            <sub style={{ margin: 0, fontSize: '12px' }}>


              {cloudProvider === 'Azure' && <img id={`cloudProviderLogo-${index}`} src="azure_logo_w.png" alt="Azure" width="40" height="30" />}
              {cloudProvider === 'AWS' && <img id={`cloudProviderLogo-${index}`} src="aws_logo_w.png" alt="AWS" width="50" height="30" />}
              {cloudProvider === 'GCP' && <img id={`cloudProviderLogo-${index}`} src="gcp_logo_w.png" alt="GCP" width="40" height="30" />}


              <br></br>
              {workLoadType} Tier <br />
              <span style={{ fontWeight: 700, fontSize: '12px' }}> {workLoadName} </span>

              <br />

            </sub>
          </div>
        </div>
        <div>


          {/* <Button darkMode={true} className={buttonCardStyle} onClick={() => handleViewCard(workLoadType, workLoadName, _accountName, _opportunityNo, cloudProvider, workLoadIndex)}>
            View
          </Button> */}


        </div>
      </div>
    )


    // Update the estimate text
    setCards(prevCards => [...prevCards, message]);
  };

  const handleDeleteCard = (index: number) => {
    // Set the deletingIndex and open the delete confirmation modal
    setDeletingIndex(index);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingIndex !== null) {
      // Remove the card at the specified index
      setCards(prevCards => prevCards.filter((_, i) => i !== deletingIndex));
    }

    // Close the delete confirmation modal
    setDeleteModalOpen(false);
  };

  const handleCancelDelete = () => {
    // Clear the deletingIndex and close the delete confirmation modal
    setDeletingIndex(null);
    setDeleteModalOpen(false);
  };

  const handleViewCard = (workLoadType: string, workLoadName: string, accountName: string, opportunityNo: string, cloudProvider: string, workLoadIndex: number) => {
    try {




      setShouldRefreshCalculation({
        workLoadType: workLoadType,
        workLoadName: workLoadName,
        accountName: accountName,
        opportunityNo: opportunityNo,
        cloudProvider: cloudProvider,
        workLoadIndex: workLoadIndex,
        content: 'view',
      });


      hasRenderedSetter?.(false);





    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Inside your handleQueryString function:
    const queryParams = getQueryStringParams();
    const accountName = queryParams.get('acctName');
    const opportunityNo = queryParams.get('oppno');

    // Assert accountName and opportunityNo as strings
    const parsedAccountName = accountName ? String(accountName) : '';
    const parsedOpportunityNo = opportunityNo ? String(opportunityNo) : '';

    // Get the current location
    handleQueryString(parsedAccountName, parsedOpportunityNo);
    setFirstEffectCompleted(true);

  }, []);


  useEffect(() => {

    try {



      if (firstEffectCompleted) {

        console.log('State updated:', calculatedValues);

        const jsonString = JSON.stringify(calculatedValues);
        const jsonObject = JSON.parse(jsonString);


        // Assuming you have the element with id "0"
        const cardElement = document.getElementById(jsonObject.index);


        // Ensure that the element exists before accessing its children
        if (cardElement) {
          // Assuming RAM, CPU, and Storage are in the first div within cardElement
          const ramCell = cardElement.querySelector('div:nth-child(2) table tbody > tr:nth-child(1)');
          const secondColumnContent = cardElement.querySelector('div:nth-child(2) table tbody');

          const cpuCell = cardElement.querySelector('div:nth-child(2) table tbody > tr:nth-child(2)');
          const storageCell = cardElement.querySelector('div:nth-child(2) table tbody > tr:nth-child(3)');
          const tierElement = cardElement.querySelector(`#tier-${jsonObject.index}`);



          if (shouldRefreshCalculation.workLoadType === 'Generic') {
            if (secondColumnContent) {
              secondColumnContent.innerHTML = `${jsonObject.RAM}<br>${jsonObject.vCPUs}<br>${jsonObject.Storage}`;
            }

          } else if (shouldRefreshCalculation.workLoadType === 'Search') {

            if (secondColumnContent) {
              secondColumnContent.innerHTML = ` ${jsonObject.RAM}<br>${jsonObject.vCPUs}<br>${jsonObject.Storage}`;
            }
          }

          if (tierElement) {
            tierElement.textContent = jsonObject.Tier;
          }

          setCalculatedValues([
            {
              Tier: '--',
              RAM: '--',
              Storage: '--',
              vCPUs: '--',
              workLoadIndex: jsonObject.index,
              active: false,
              cloud: '--',
            },
            // Add more objects as needed
          ]);

          for (let i = 0; i < cards.length; i++) {
            const cardElement = document.getElementById("card-" + i);
            const cloudProviderLogo = document.querySelector(`#cloudProviderLogo-${i}`) as HTMLImageElement | null;

            if (!cloudProviderLogo) {
              console.log(`cloudProviderLogo-${i} not found.`);
              continue;
            }

            const isActive = i === jsonObject.index && cloudProviderLogo.alt === jsonObject.cloud;
            const logoPrefix = isActive ? '' : '_w';
            const logoName = cloudProviderLogo.alt.toLowerCase();

            if (cardElement) {
              cardElement.style.color = isActive ? '#ffffff' : '#00684A';
              cardElement.style.backgroundColor = isActive ? '#00684A' : '#ffffff';
            }

            cloudProviderLogo.src = `${logoName}_logo${logoPrefix}.png`;
          }

        }
      }
    } catch (error) {

    }
  }, [calculatedValues, cards]);



  return (

    <SizingProvider>
      <LeafygreenProvider>

        <div className={logoHeader}>
          <div className={wrapperStyle}>
            <div className={leftColumnStyle}>
              <MongoDBLogoMark height={35} className={logoStyle} />
              <span className={logoStyleFont}>Metron</span>
            </div>
            <div className={rightColumnStyle}>
              <div className={sizingHeaderRight}>

                {currentUser ? (
                  <Button
                    className={buttonStyle}
                    color="secondary"
                    onClick={async () => {
                      await logOut();
                    }}
                  >
                    Log Out
                  </Button>
                ) : null}
                {estimateText ? (
                  <><TierInfo /><Button
                    href={window.location.origin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonStyle}
                    onClick={() => {
                      window.location.href = window.location.origin;
                    }}
                  >
                    <FontAwesomeIcon icon={faHome} />
                  </Button>

                  </>
                ) : (
                  <SaveButton handleConfirmClick={handleConfirmClick} />
                )}




              </div>
            </div>
          </div>
        </div>
        <div>
          <div className={flexContainer}>

            {estimateText ? (

              <><div className={sizingHeaderLeft}>
                <div dangerouslySetInnerHTML={{ __html: estimateText }} />
              </div>
                <div className={sizingHeaderRight} style={{ display: 'flex', alignItems: 'center' }}>
                  <CurrentUrlGenerator acctName={accountName} oppno={opportunityNo} />
                  <NodeType handleWorkLoadConfirmClick={handleWorkLoadConfirmClick} />

                </div></>


            ) : (
              <div className={sizingHeaderLeft}>
                <div className={searchBox}>
                  <SearchBox />
                </div>
              </div>
            )}


          </div>
        </div>

        <div className={cardContainer}>
          {cards.map((card, index) => (
            <Card key={index} id={"card-" + index} darkMode={false} className={cardStyles}>

              {card}


              {/* <Button darkMode={true} className={buttonCardStyle} onClick={() => handleDeleteCard(index)}>Delete </Button> */}
            </Card>
          ))}
        </div>

        <div className='mainContainer'>

          <Tabs aria-labelledby="some-id" setSelected={setSelected} selected={selected}>
            {
              shouldRefreshCalculation.workLoadType === 'Generic' ? (
                <Tab name="Generic Tier Sizing">
                  <Generic
                    workLoadType={shouldRefreshCalculation.workLoadType}
                    workLoadName={shouldRefreshCalculation.workLoadName}
                    cloudProvider={shouldRefreshCalculation.cloudProvider}
                    workLoadIndex={shouldRefreshCalculation.workLoadIndex}
                    content='view' accountName={accountName} opportunityNo={''}
                    updateCalculatedValues={updateCalculatedValues}
                    handleDeleteCard={handleDeleteCard} />

                </Tab>

              ) : shouldRefreshCalculation.workLoadType === 'Search' ? (
                <Tab name="Search Tier Sizing">

                  <Search
                    workLoadType={shouldRefreshCalculation.workLoadType}
                    workLoadName={shouldRefreshCalculation.workLoadName}
                    cloudProvider={shouldRefreshCalculation.cloudProvider}
                    workLoadIndex={shouldRefreshCalculation.workLoadIndex}
                    content='view' accountName={accountName} opportunityNo={''}
                    updateCalculatedValues={updateCalculatedValues}
                    handleDeleteCard={handleDeleteCard} />

                </Tab>
              ) : (
                <Tab name="Your latest sizings">
                  <br></br>


                  {estimateText ? (

                    <BasicEmptyState />


                  ) : (
                    <UserSizingList />
                  )}



                </Tab>

              )

            }

            <Tab name="FAQ">
              <br></br>
              <FAQ />
            </Tab>

          </Tabs>
          {isDeleteModalOpen && (
            <Modal open={isDeleteModalOpen} setOpen={setDeleteModalOpen}>
              <h3>Tier was  deleted, please continue</h3>

              <Button onClick={handleConfirmDelete}>OK</Button>

            </Modal>
          )}
        </div>

      </LeafygreenProvider>
    </SizingProvider>

  );
}

const AppWithProvider: React.FC = () => {
  return (
    <SizingProvider>
      <Metron />
    </SizingProvider>
  );
};

export default Metron;
