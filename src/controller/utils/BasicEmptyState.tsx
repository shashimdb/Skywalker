import React from 'react';
import Button from '@leafygreen-ui/button';
import { BasicEmptyState } from '@leafygreen-ui/empty-state';



const MyBasicEmptyState: React.FC = () => {
    return (
        <BasicEmptyState
            title="Now you can create a New Workload"
            description="Currently we support General Tier &  Search Tier"
              graphic={<img src="db_slalom1.svg" />}
            primaryButton={<Button> This opportunity has no workload yet</Button>}

        />
        
    );
};

export default MyBasicEmptyState;
