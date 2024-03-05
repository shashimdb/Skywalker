import React from 'react';
import Banner from "@leafygreen-ui/banner";
import { Link } from "@leafygreen-ui/typography";
import Card from "@leafygreen-ui/card";

import '../../css/Generic.css'; // Import your CSS file

const FAQ = () => {
  // Define a list of frequently asked questions and answers
  const faqData = [
    {
      question: 'What is the purpose of this skywalker?',
      answer: 'skywalker helps customer to automate creating embeddings for their data',
    },
    {
      question: 'How can I contact team?',
      answer: 'Slack - #solution-consulting-rsc-emea_apac',
    },
    {
      question: 'Does sizing portal provide pricing?',
      answer: 'No, this is only to size Generic , Search , Analytical , Vecntor , Time Series Workloads and provide respective Tier',
    },
    // Add more FAQ items as needed
  ];

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Image at the center */}
        <Banner style={{ display: 'inline-block', margin: 'auto', width: "80%" }}>
          This will help on how to collect data and enter details for sizing customer tier &nbsp;
          <a href="https://mongodb.com">Anchor tag</a>&nbsp;
          <Link>Link Component</Link>
        </Banner>

        <br /> <br /> <br />

        <Card className="custom-card" style={{ display: 'inline-block', margin: 'auto', width: "90%" }}>
          <div id="faqContainer">
            <table>
              <thead>
                <tr>
                  <th>Sl No.</th>
                  <th>Question</th>
                  <th>Answer</th>
                </tr>
              </thead>
              <tbody>
                {faqData.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.question}</td>
                    <td>{item.answer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;
