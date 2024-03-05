import React from 'react';
import Banner from "@leafygreen-ui/banner";
import { Link } from "@leafygreen-ui/typography";
import Card from "@leafygreen-ui/card";

import '../../css/Generic.css'; // Import your CSS file

const Semantic = () => {

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Image at the center */}
        <h1>Semantic Search</h1>

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
     
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Semantic;
