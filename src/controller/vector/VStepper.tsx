import { JSXElementConstructor, ReactElement, ReactNode, useState } from "react";
import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import Stepper, { Step } from "@leafygreen-ui/stepper";
import Card from "@leafygreen-ui/card";
import Button from "@leafygreen-ui/button";
import Toggle from "@leafygreen-ui/toggle";
import TextInput from '@leafygreen-ui/text-input';
import { Option, OptionGroup, Select, Size } from '@leafygreen-ui/select';
import { useSizingContext, createIndexSetter } from '../context/SizingContext';
import DataService from "../service/DataSerice";
import * as Realm from "realm-web";

function VStepper() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setOnprogress] = useState('')



  const [loginProgress, setLoginProgress] = useState('')
  const [appProgress, setAppProgress] = useState('')
  const [authProgress, setAuthProgress] = useState('')
  const [dsProgress, setDSProgress] = useState('')
  const [ruleProgress, setRuleProgress] = useState('')
  const [vectorProgress, setVectorProgress] = useState('')
  const [indexProgress, setIndexProgress] = useState('')


  const maxDisplayedSteps = 5;
  const { setCreateIndex, setUsecaseSelected, usecaseSelected } = useSizingContext();

  let jsonData = {};


  const [formData, setFormData] = useState({

    selectedCluster: "",
    selectedDatabase: "",
    selectedCollection: "",
    selectedField: "",

    groupID: "",
    atlasUsername: "",
    atlasAPIKey: "",

    selectedApiEndpoint: "",
    apiKey: "",
    similarity: "",
    selectedUsecase: "",

    indexName: "",
  });

  const decrementStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const incrementStep = () => {

    if (currentStep < maxDisplayedSteps) {
      setCurrentStep(currentStep + 1);
      if(currentStep === 1){
         jsonData = {
          atlasDataDetails: {
            clusterName: formData.selectedCluster,
            database: formData.selectedDatabase,
            collection: formData.selectedCollection,
            selectField: formData.selectedField
          },
          atlasAccessDetails: {
            groupID: formData.groupID,
            atlasUsername: formData.atlasUsername,
            atlasAPIKey: formData.atlasAPIKey
          },
          indexDetails: {
            similarity: formData.similarity
          },
          embeddingAPIDetails: {
            apiEndpoint: formData.selectedApiEndpoint,
            apiKey: formData.apiKey
          }
        };
    
      }
    }

    console.log("JSON Data:", jsonData);
  };



  /// Implement complete logic
  const handleSubmit = async () => {

    try {

      const dataService = new DataService()
      const clusterName = "vectorCluster"
      const collectionName = "users"
      const dbname = "library"
      const groupId = "64f5e489d8a3f03aa3f834f4"
      const fieldName = "name"
      // Handle Login
      const loginHandle = await dataService.handleLogin({
        "username": "irmwcwcb", "apiKey": "e65e3195-61ff-4a69-92e4-f2a534d9d487"
      })
      dataService.ACCESS_TOKEN = loginHandle.data.access_token
      console.log(dataService.ACCESS_TOKEN)
      setOnprogress("Login Success...")
      setLoginProgress("Completed")
      // Create App
      const createAppHandle = await dataService.handleCreateApp(groupId)
      console.log(createAppHandle)
      const appId = createAppHandle.data._id
      const clientAppId = createAppHandle.data.client_app_id
      console.log(clientAppId)
      setOnprogress("App Created...")
      setAppProgress("Completed");
      const enableAuth = await dataService.handleAuthProvider(groupId, appId)
      setOnprogress("Enabling Auth...")
      setAuthProgress("Completed")
      console.log(enableAuth)
      // Link DS
      const linkDataSource = await dataService.handleLinkDataSource(groupId, appId, clusterName)
      setOnprogress("Datasource Linked...")
      setDSProgress("Completed");
      console.log("Link DS - ", linkDataSource)
      const serviceId = linkDataSource.data._id
      // Create rule
      const createRules = await dataService.handleCreateRule(groupId, appId, dbname, collectionName, serviceId)
      setOnprogress("Creating Rules...")
      setRuleProgress("Completed");
      console.log(createRules)

      // Create Vectors
      const app = new Realm.App({ id: clientAppId });
      const credentials = Realm.Credentials.anonymous();
      try {
        const user = await app.logIn(credentials);
        const mongo = user.mongoClient("vector-data");
        const collection = mongo.db(dbname).collection(collectionName);
        console.log(collection)
        const documents = await collection.find({});
        setOnprogress("Creating vectors..")
        setLoginProgress("Completed");
        console.log("documnets array : ", documents)
        documents.forEach(async (element: any) => {
          const embedding = await dataService.getEmbeddings(element[fieldName], "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")
          collection.updateOne({ _id: element._id },
            { $set: { embedding: embedding.data.data[0].embedding } }
          )
        });
        setOnprogress("Vector Creation Completed!")
        setVectorProgress("Completed");
        //Create Vector Index
        await dataService.handleCreateIndex(groupId, clusterName, collectionName, dbname, "embedding")
        setOnprogress("Vector Index Created!")
        setIndexProgress("Completed");
      } catch (err) {
        console.error("Failed to log in", err);
        setOnprogress("Failed to log in")
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setOnprogress("Failed while automating")
    }
  };

  const renderCard = (stepNumber: number, title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined) => {
    if (currentStep === stepNumber && currentStep === 0) {
      return (
        <div style={{ justifyContent: 'center', paddingLeft: '125px', paddingRight: '125px' }}>
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            <img src="skywalker_usp.png" alt="AWS" style={{ width: '70%', height: '400px' }} />
          </Card>
        </div>
      );
    } else if (currentStep === stepNumber && currentStep === 1) {
      return (
        <>

          <div style={{ justifyContent: 'space-between', paddingLeft: '125px', paddingRight: '125px' }}>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '125px', paddingRight: '125px' }}>

                {/* Column 1 */}
                <div style={{ flex: 1, marginRight: '20px' }}>
                  {/* Atlas Data Details */}
                  <h2 style={{ color: '#00684A' }}>Atlas Data Details</h2>
                  <div style={{ marginBottom: '20px' }}>
                    <Select
                      className="select-style"
                      label="Cluster Name"
                      name="cluster"
                      placeholder="Select"
                      size={Size.Default}
                      value={formData.selectedCluster}
                      onChange={(value) => setFormData({ ...formData, selectedCluster: value })}
                    >
                      <Option value="Cluster1">Cluster1</Option>
                      <Option value="vectorCluster">vectorCluster</Option>
                    </Select>

                    <Select
                      className="select-style"
                      label="Database"
                      name="database"
                      placeholder="Select"
                      size={Size.Default}
                      value={formData.selectedDatabase}
                      onChange={(value) => setFormData({ ...formData, selectedDatabase: value })}
                    >
                      <Option value="DB1">DB1</Option>
                      <Option value="library">library</Option>
                    </Select>


                    <Select
                      className="select-style"
                      label="Collection"
                      name="collection"
                      placeholder="Select"
                      size={Size.Default}
                      value={formData.selectedCollection}
                      onChange={(value) => setFormData({ ...formData, selectedCollection: value })}
                    >
                      <Option value="Col1">Col1</Option>
                      <Option value="users">users</Option>
                    </Select>



                    <Select
                      className="select-style"
                      label="Select Field"
                      name="field"
                      placeholder="Select"
                      size={Size.Default}
                      value={formData.selectedField}
                      onChange={(value) => setFormData({ ...formData, selectedField: value })}
                    >
                      <Option value="Field1">Field1</Option>
                      <Option value="name">name</Option>
                    </Select>
                  </div>
                  {/* Embedding API Details */}
                  <h2 style={{ color: '#00684A' }}>Index Details</h2>
                  <div>

                    <Select
                      className="select-style"
                      label="Similarity"
                      name="similarity"
                      placeholder="Select"
                      size={Size.Default}
                      value={formData.similarity}
                      onChange={(value) => setFormData({ ...formData, similarity: value })}
                    >
                      <Option value="cosine">Cosine</Option>
                      <Option value="dotproduct">DotProduct</Option>
                      <Option value="wuclidean">Euclidean</Option>
                    </Select>


                  </div>
                </div>
                {/* Column 2 */}
                <div style={{ flex: 1, marginLeft: '20px' }}>
                  {/* Atlas Access Details */}
                  <h2 style={{ color: '#00684A' }}>Atlas Access Details</h2>
                  <div style={{ marginBottom: '20px' }}>
                    <TextInput
                      label="Atlas Groupd ID "
                      description="Description"
                      name="groupID"
                      placeholder="Placeholder"
                      value={formData.groupID}
                      onChange={(e) => setFormData({ ...formData, groupID: e.target.value })} />


                    <TextInput
                      label="Atlas Username"
                      description="Description"
                      name="atlasUsername"
                      placeholder="Placeholder"
                      value={formData.atlasUsername}
                      onChange={(e) => setFormData({ ...formData, atlasUsername: e.target.value })} />

                    <TextInput
                      label="Atlas API Key"
                      description="Description"
                      name="atlasAPIKey"
                      placeholder="Placeholder"
                      value={formData.atlasAPIKey}
                      onChange={(e) => setFormData({ ...formData, atlasAPIKey: e.target.value })} />

                  </div>
                  {/* Embedding API Details */}
                  <h2 style={{ color: '#00684A' }}>Embedding API Details</h2>
                  <div>
                    <Select
                      className="select-style"
                      label="API Endpoints"
                      name="ApiEndpoint"
                      placeholder="Select"
                      size={Size.Default}
                      value={formData.selectedApiEndpoint}
                      onChange={(value) => setFormData({ ...formData, selectedApiEndpoint: value })}
                    >
                      <Option value="OpenAI">OpenAI</Option>
                      <Option value="HuggingFace">HuggingFace</Option>
                    </Select>

                    <TextInput
                      label="API Key"
                      description="Description"
                      placeholder="Placeholder"
                      value={formData.apiKey}
                      onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })} />




                  </div>
                </div>


              </div>
            </Card>
          </div>
        </>


      );
    } else if (currentStep === stepNumber && currentStep === 2) {
      return (
        <div style={{ justifyContent: 'space-between', paddingLeft: '125px', paddingRight: '125px' }}>
          <Card>
            <h2 style={{ color: '#00684A', paddingLeft: '125px' }}>Review before creating the embeddings
              <br></br>
              ________</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '125px', paddingRight: '125px' }}>
              <div style={{ flex: 1, marginRight: '20px' }}>
                <h2>Atlas Data Details</h2>
                <p>Cluster Name: {formData.selectedCluster}</p>
                <p>Database: {formData.selectedDatabase}</p>
                <p>Collection: {formData.selectedCollection}</p>
                <p>Select Field: {formData.selectedField}</p>
              </div>
              <div style={{ flex: 1, marginLeft: '20px' }}>
                <h2>Atlas Access Details</h2>
                <p>Group ID: {formData.groupID}</p>
                <p>Atlas Username: {formData.atlasUsername}</p>
                <p>Atlas API Key: {formData.atlasAPIKey}</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '125px', paddingRight: '125px' }}>
              <div style={{ flex: 1, marginRight: '20px' }}>
                <h2>Index Details</h2>
                <p>Similarity: {formData.similarity}</p>
              </div>
              <div style={{ flex: 1, marginLeft: '20px' }}>
                <h2>Embedding API Details</h2>
                <p>API Endpoint: {formData.selectedApiEndpoint}</p>
                <p>API Key: {formData.apiKey}</p>
              </div>
            </div>
          </Card>
        </div>
      );
    }
    else if (currentStep === stepNumber && currentStep === 3) {
      return (

        <div style={{ justifyContent: 'space-between', paddingLeft: '100px', paddingRight: '125px' }}>
          <Card>
            <h1 style={{ color: '#00684A' }}>Jedi in Action.... whoosssshhhhh</h1>
            <div style={{ display: 'flex', paddingLeft: '125px', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px' }}>
              <div style={{ flex: 1 }}>

                <h4>Login Success:</h4>
                <h4>App Created:</h4>
                <h4>Enabling Auth:</h4>
                <h4>Datasource Linked:</h4>
                <h4>Creating Rules:</h4>
                <h4>Creating vectors:</h4>
                <h4>Creating index:</h4>
              </div>
              <div style={{ flex: 1 }}>
                <h4>{loginProgress}</h4>
                <h4>{appProgress}</h4>
                <h4>{authProgress}</h4>
                <h4>{dsProgress}</h4>
                <h4>{ruleProgress}</h4>
                <h4>{vectorProgress}</h4>
                <h4>{indexProgress}</h4>
              </div>
            </div>
            <p> Overall Progress: {progress} </p>
          </Card>
        </div>


      );
    } else if (currentStep === stepNumber && currentStep === 4) {
      return (

        <div style={{ justifyContent: 'space-between', paddingLeft: '125px', paddingRight: '125px' }}>

          <Card style={{ backgroundColor: '#00684A', color: '#ffffff' }}>

            <h1 style={{ justifyContent: 'space-between', paddingLeft: '125px', paddingRight: '125px' }}>Implement usecase on newly created embeddings</h1>
            <br></br>
            <div style={{ justifyContent: 'space-between', paddingLeft: '125px', paddingRight: '125px' }}>
              <Select
                className="select-style"

                label=""
                name="selectedUsecase"
                placeholder="Select"
                size={Size.Large}
                value={formData.selectedUsecase}
                onChange={(value) => setFormData({ ...formData, selectedUsecase: value })}
              >
                <Option value="RAG">RAG</Option>
                <Option value="Semantic Search">Semantic Search</Option>
                <Option value="QA">Q & A </Option>
                <Option value="ChatBot">ChatBot </Option>
              </Select>

              <br></br>
              <Button

                onClick={() => {
                  // Open corresponding file based on selected usecase
                  if (formData.selectedUsecase === "RAG") {
                    setCreateIndex(false);
                    setUsecaseSelected('RAG');


                  } else if (formData.selectedUsecase === "Semantic Search") {
                    setCreateIndex(false);
                    setUsecaseSelected('Semantic');

                  }

                }}
              >
                Confirm
              </Button>
            </div>
          </Card>
          <br></br>
          <Card >

            <h2 style={{ color: '#00684A', paddingLeft: '125px' }}>Summary of the Jedi Destination
              <br></br>
              ________</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '125px', paddingRight: '125px' }}>
              <div style={{ flex: 1, marginRight: '20px' }}>
                <h2>Embeddings details</h2>
                <p>Index Field Name: {formData.selectedField}_embeddings</p>

              </div>
              <div style={{ flex: 1, marginLeft: '20px' }}>
                <h2>Atlas App Service Details</h2>
                <p>Service Name : skywalkerVectorApp</p>

              </div>
            </div>




            <h2 style={{ color: '#00684A', paddingLeft: '125px' }}>User Input Data
              <br></br>
              ________</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '125px', paddingRight: '125px' }}>
              <div style={{ flex: 1, marginRight: '20px' }}>
                <h2>Atlas Data Details</h2>
                <p>Cluster Name: {formData.selectedCluster}</p>
                <p>Database: {formData.selectedDatabase}</p>
                <p>Collection: {formData.selectedCollection}</p>
                <p>Select Field: {formData.selectedField}</p>
              </div>
              <div style={{ flex: 1, marginLeft: '20px' }}>
                <h2>Atlas Access Details</h2>
                <p>Group ID: {formData.groupID}</p>
                <p>Atlas Username: {formData.atlasUsername}</p>
                <p>Atlas API Key: {formData.atlasAPIKey}</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '125px', paddingRight: '125px' }}>
              <div style={{ flex: 1, marginRight: '20px' }}>
                <h2>Index Details</h2>
                <p>Similarity: {formData.similarity}</p>
              </div>
              <div style={{ flex: 1, marginLeft: '20px' }}>
                <h2>Embedding API Details</h2>
                <p>API Endpoint: {formData.selectedApiEndpoint}</p>
                <p>API Key: {formData.apiKey}</p>
              </div>
            </div>
          </Card>


        </div>


      );
    } else if (currentStep === stepNumber && currentStep === 5) {
      return (
        <div style={{ justifyContent: 'space-between', paddingLeft: '125px', paddingRight: '125px' }}>
          <Card>
            <h1></h1>
          </Card>
        </div>
      );
    }
    return null;
  };

  return (
    <LeafyGreenProvider darkMode={darkMode}>
      <div className={`App ${darkMode && "darkmode-bg"}`}>
        <div className="sandbox">
          <Stepper currentStep={currentStep} maxDisplayedSteps={maxDisplayedSteps}>
            <Step>Overview</Step>
            <Step>Configure</Step>
            <Step>Summary</Step>
            <Step>Progress</Step>
            <Step>Completed</Step>
          </Stepper>
          {renderCard(0, "Overview")}
          {renderCard(1, "Configure")}
          {renderCard(2, "Summary")}
          {renderCard(3, "Progress")}
          {renderCard(4, "Completed")}
        </div>
        <br></br>
        <div style={{ justifyContent: 'center', paddingLeft: '125px', paddingRight: '125px', float: 'right' }}>
          <Button
            className="bottom-left-button"
            disabled={currentStep <= 1}
            onClick={decrementStep}
          >
            Previous
          </Button>

          <Button
            className="bottom-right-button"
            disabled={currentStep >= maxDisplayedSteps}
            darkMode={true}
            onClick={() => {
              if (currentStep === 4) {
                // Navigate to the home page
                window.location.href = "/home"; // Update the URL as needed
              } else if (currentStep === 2) {
                // Increment the step
                incrementStep();
                handleSubmit();
              }
              else {
                incrementStep();
              }
            }}
          >
            {currentStep === 2 ? "Review and Confirm" : currentStep === 4 ? "Close" : "Next"}
          </Button>
        </div>
      </div>
    </LeafyGreenProvider>
  );
}

export default VStepper;
