import React, { useEffect, useState } from 'react';
import { css, keyframes } from '@leafygreen-ui/emotion';
import LeafygreenProvider from '@leafygreen-ui/leafygreen-provider';

import Button from '@leafygreen-ui/button';

import { Tabs, Tab } from '@leafygreen-ui/tabs';

import SaveButton from './controller/SaveButton';

import FAQ from './controller/utils/FAQ';

import SearchBox from './controller/utils/SearchBox';
import UserSizingList from './controller/utils/UserSizingList';
import BasicEmptyState from './controller/utils/BasicEmptyState';

import VStepper from './controller/vector/VStepper';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

import DataService from './controller/service/DataSerice';
import { sizingDataSetter, userDataSetter, useSizingContext, hasRenderedSetter, cardIndexSetter } from './controller/context/SizingContext';

import { AppProvider, useApp } from "./RealmApp";
import { useSkywalker } from "./hooks/useSkywalker";

import RAG from './controller/usecases/RAG';
import Semantic from './controller/usecases/Semantic';

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

const Skywalker: React.FC<{}> = () => {

  const { currentUser, logOut } = useApp();
  const { createIndex, usecaseSelected } = useSizingContext();
  const { ...todoActions } = useSkywalker();

  const todoDocument = {
    name: currentUser?.profile.email.toString(),
    createdAt: new Date()
  };

  currentUser && todoActions.saveTodo(todoDocument);
  if (currentUser && userDataSetter) {
    userDataSetter(currentUser.profile.email.toString());
  }
  const [hasIndex, setHasIndex] = useState(false);

  const [selected, setSelected] = useState(0);

  const dataService = new DataService();

  useEffect(() => {
    try {
      console.log(createIndex);
      console.log(usecaseSelected);
    } catch (error) {
      // Handle error if necessary
    }
  }, [createIndex, usecaseSelected]);



  return (


      <LeafygreenProvider>

        <div className={logoHeader}>
          <div className={wrapperStyle}>
            <div className={leftColumnStyle}>
              <img src="jedi.png" alt="AWS" width="95" height="70" />
              <span className={logoStyleFont}>Skywalker</span>
            </div>
            <div className={rightColumnStyle}>
              <div className={sizingHeaderRight}>
              <SaveButton />

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
            
                  <><Button
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
              
               
       


              </div>
            </div>
          </div>
        </div>
        <div>
          <div className={flexContainer}>

            {!createIndex ? (

              <div className={sizingHeaderLeft}>
                <div className={searchBox}>
                  <SearchBox />
                </div>
              </div>

            ) : (
              <div></div>
            )}


          </div>
        </div>


        <div className='mainContainer'>

          <Tabs aria-labelledby="some-id" setSelected={setSelected} selected={selected}>
            {
              createIndex ? (
                <Tab name="Create Vector Index">
                  <VStepper />
                </Tab>

              ) : usecaseSelected === 'Semantic' ? (
                <Tab name="Semantic Search">
                  <Semantic />
                </Tab>

              ): usecaseSelected === 'RAG' ? (
                <Tab name="RAG">
                  <RAG />
                </Tab>

              ) : (
                <Tab name="Vectors">
                  <br></br>
                  {hasIndex ? (
                    <BasicEmptyState />
                  ) : (
                    <UserSizingList />
                  )}
                </Tab>

              )

            }

            <Tab name="How this works?">
              <br></br>
              <FAQ />
            </Tab>

          </Tabs>

        </div>

      </LeafygreenProvider>


  );
}

const AppWithProvider: React.FC = () => {
  const { createIndex } = useSizingContext();
  return (

      <Skywalker />

  );
};

export default Skywalker;
