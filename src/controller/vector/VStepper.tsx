import { JSXElementConstructor, ReactElement, ReactNode, useState } from "react";
import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import Stepper, { Step } from "@leafygreen-ui/stepper";
import Card from "@leafygreen-ui/card";
import Button from "@leafygreen-ui/button";
import Toggle from "@leafygreen-ui/toggle";
import TextInput from '@leafygreen-ui/text-input';
import { Option, OptionGroup, Select, Size } from '@leafygreen-ui/select';

function VStepper() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const maxDisplayedSteps = 5;

  const [formData, setFormData] = useState({
    indexName: "",
    selectedDatabase: "",
    selectedCollection: "",
    selectedField: "",
    selectedApiEndpoint: "",
    apiKey: ""
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
        </Card>
      );
    } else if (currentStep === stepNumber && currentStep === 4) {
      return (
        <div style={{ display: 'flex', marginBottom: '20px', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, marginRight: '20px', padding: '25px' }}>
            <div>

              <div style={{ display: 'flex', marginBottom: '20px', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, marginRight: '20px', padding: '25px' }}>

                  <h4>Selection Information </h4>
                  <p>Index Name: {formData.indexName}</p>
                  <p>Selected Database: {formData.selectedDatabase}</p>
                  <p>Selected Collection: {formData.selectedCollection}</p>
                  <p>Selected Field: {formData.selectedField}</p>
                  <p>Selected API Endpoint: {formData.selectedApiEndpoint}</p>
                  <p>API Key: {formData.apiKey}</p>
                </div>

                -----------
                <div style={{ flex: 1, marginLeft: '20px' }}>

                  <h4>Output Summary </h4>
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
              <Button>
                Create Semantic Search
              </Button>
              <p>

                Semantic search is a revolutionary approach to information retrieval that aims to understand the intent and context behind a user's query rather than relying solely on keyword matching. Unlike traditional search engines, which primarily analyze text based on the occurrence of specific words or phrases, semantic search engines delve deeper into the meaning of the query and the content being searched.
              </p>

            </Card>
            <br></br>
            <Card>
              <Button>
                Create RAG
              </Button>

              <p>
                Retrievable Augmented Generation (RAG) is an innovative approach in natural language processing (NLP) that combines the strengths of two prominent models: retriever models and generator models. The retriever component is responsible for efficiently searching and retrieving relevant context from a large corpus of documents, while the generator component generates coherent and contextually relevant responses based on the retrieved information.
              </p>

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
          onClick={incrementStep}
        >
          {currentStep === 2 ? "Review and Confirm" : "Next"}
        </Button>
      </div>
    </LeafyGreenProvider>
  );
}

export default VStepper;
