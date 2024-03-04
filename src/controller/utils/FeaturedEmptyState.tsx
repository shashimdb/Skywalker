import React from 'react';
import Button from '@leafygreen-ui/button';
import { FeaturesEmptyState } from '@leafygreen-ui/empty-state';
import { css, cx } from '@leafygreen-ui/emotion';

const centeredContent = css`
  margin: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FeaturedEmptyState: React.FC = () => {
  return (
    <div className={cx(centeredContent)}>
      <FeaturesEmptyState
        title="You have no data for calculating the Tier size"
        features={[
          { graphic: <img src='section1.svg' width="200px" alt="" />, title: "+ Collection | Search ", description: "add new collection or search index" },
          { graphic: <img src='section2.svg' width="200px" alt="" />, title: "Add Details", description: "add customer specific details in the pop window" },
          { graphic: <img src='section3.svg' width="160px" alt="" />, title: "Save & Calculate", description: "you could see the calculation and tier assigned" },
        ]}
        primaryButton={<></>}
      />
    </div>
  );
};

export default FeaturedEmptyState;
