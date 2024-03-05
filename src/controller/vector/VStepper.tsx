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
  const maxDisplayedSteps = 5;
  const { setCreateIndex, setUsecaseSelected, usecaseSelected } = useSizingContext();

  const [formData, setFormData] = useState({
    indexName: "",
    selectedDatabase: "",
    selectedCollection: "",
    selectedField: "",
    selectedApiEndpoint: "",
    apiKey: "",
    selectedUsecase: "",
  });

  const decrementStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const incrementStep = () => {

    if (currentStep < maxDisplayedSteps) {
      setCurrentStep(currentStep + 1);
    }
  };


  async function generateEmbedding() {

  }

  /// Implement complete logic
  const handleSubmit = async () => {

    try {

      const dataService = new DataService()
      const clusterName = "vector-demo"
      // Handle Login
      const loginHandle = await dataService.handleLogin({
        "username": "<public-key>", "apiKey": "<private-key>"
      })
      dataService.ACCESS_TOKEN = loginHandle.data.access_token
      setOnprogress("Login Success...");
      // Create App
      const groupId = '<group-id>'
      const createAppHandle = await dataService.handleCreateApp(groupId)
      console.log(createAppHandle)
      const appId = createAppHandle.data._id
      const clientAppId = createAppHandle.data.client_app_id
      console.log(clientAppId)
      setOnprogress("App Created...")
      const enableAuth = await dataService.handleAuthProvider(groupId, appId)
      setOnprogress("Enabling Auth...")
      console.log(enableAuth)
      // Link DS
      const linkDataSource = await dataService.handleLinkDataSource(groupId, appId, clusterName)
      setOnprogress("Datasource Linked...")
      console.log("Link DS - ", linkDataSource)
      const serviceId = linkDataSource.data._id
      // Create rule
      const createRules = await dataService.handleCreateRule(groupId, appId, "rag", "data", serviceId)
      setOnprogress("Creating Rules...")
      console.log(createRules)

      // Create Vectors
      const app = new Realm.App({ id: clientAppId });
      const credentials = Realm.Credentials.anonymous();
      try {
        const user = await app.logIn(credentials);
        const mongo = user.mongoClient("vector-data");
        const collection = mongo.db("rag").collection("data");
        console.log(collection)
        const documents = await collection.find({});
        setOnprogress("Creating vector..")
        documents.forEach(element => {
          console.log("data : ", element.line)
        });
      } catch (err) {
        console.error("Failed to log in", err);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderCard = (stepNumber: number, title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined) => {
    if (currentStep === stepNumber && currentStep === 0) {
      return (
        <Card>
          <h1> i am  {title}</h1>
        </Card>
      );
    } else if (currentStep === stepNumber && currentStep === 1) {
      return (
        <div style={{ display: 'flex', marginBottom: '20px', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, marginRight: '20px', padding: '25px' }}>

            <TextInput
              label="Index Name"
              description="Description"
              placeholder="Placeholder"
              value={formData.indexName}
              onChange={(e) => setFormData({ ...formData, indexName: e.target.value })}
            />
            <Select
              className="select-style"
              label="Select Database"
              name="docMultiplier"
              placeholder="Select"
              size={Size.Large}
              value={formData.selectedDatabase}
              onChange={(value) => setFormData({ ...formData, selectedDatabase: value })}
            >
              <Option value="DB1">DB1</Option>
              <Option value="DB2">DB2</Option>
            </Select>
            <Select
              className="select-style"
              label="Select Collection"
              name="docMultiplier"
              placeholder="Select"
              size={Size.Large}
              value={formData.selectedCollection}
              onChange={(value) => setFormData({ ...formData, selectedCollection: value })}
            >
              <Option value="Col1">Col1</Option>
              <Option value="Col2">Col2</Option>
            </Select>

            <Select
              className="select-style"
              label="Select Field"
              name="docMultiplier"
              placeholder="Select"
              size={Size.Large}
              value={formData.selectedField}
              onChange={(value) => setFormData({ ...formData, selectedField: value })}
            >
              <Option value="Field1">Field1</Option>
              <Option value="Field2">Field2</Option>
            </Select>
          </div>
          <div style={{ flex: 1, marginLeft: '20px' }}>

            <Select
              className="select-style"
              label="API Endpoints"
              name="docMultiplier"
              placeholder="Select"
              size={Size.Large}
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
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
            />
          </div>
        </div>

      );
    } else if (currentStep === stepNumber && currentStep === 2) {
      return (
        <div>
          <h1>i am {title}</h1>
          <p>Index Name: {formData.indexName}</p>
          <p>Selected Database: {formData.selectedDatabase}</p>
          <p>Selected Collection: {formData.selectedCollection}</p>
          <p>Selected Field: {formData.selectedField}</p>
          <p>Selected API Endpoint: {formData.selectedApiEndpoint}</p>
          <p>API Key: {formData.apiKey}</p>
        </div>
      );
    } else if (currentStep === stepNumber && currentStep === 3) {
      return (
        <Card>
          <h1>i am {title}</h1>
          <p> Progress : {progress} </p>
        </Card>
      );
    } else if (currentStep === stepNumber && currentStep === 4) {
      return (
        <div style={{ display: 'flex', marginBottom: '20px', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, marginRight: '20px', padding: '25px' }}>
            <div>

              <div style={{ display: 'flex', marginBottom: '20px', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, marginRight: '20px', padding: '25px' }}>

                  <h4>User Inputs </h4>
                  <p>Index Name: {formData.indexName}</p>
                  <p>Selected Database: {formData.selectedDatabase}</p>
                  <p>Selected Collection: {formData.selectedCollection}</p>
                  <p>Selected Field: {formData.selectedField}</p>
                  <p>Selected API Endpoint: {formData.selectedApiEndpoint}</p>
                  <p>API Key: {formData.apiKey}</p>
                </div>

                -----------
                <div style={{ flex: 1, marginLeft: '20px' }}>

                  <h4>Overall Summary </h4>
                  <p>Index Name: {formData.indexName}</p>
                  <p>Selected Database: {formData.selectedDatabase}</p>
                  <p>Selected Collection: {formData.selectedCollection}</p>
                  <p>Selected Field: {formData.selectedField}</p>
                  <p>Selected API Endpoint: {formData.selectedApiEndpoint}</p>
                  <p>API Key: {formData.apiKey}</p>
                </div>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, marginLeft: '20px' }}>

            <Card>

              <h1>Implement usecase on newly created embeddings</h1>

              <Select
                className="select-style"
                label="Select Usecase"
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
            </Card>



          </div>
        </div>
      );
    } else if (currentStep === stepNumber && currentStep === 5) {
      return (
        <h1></h1>
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
    </LeafyGreenProvider>
  );
}

export default VStepper;
