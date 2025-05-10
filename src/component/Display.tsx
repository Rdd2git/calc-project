import React from 'react';

interface DisplayProps {
    value: string;
}

const Display: React.FC<DisplayProps> = ({ value }) => (
    <div className="display">
        {value}
    </div>
);

export default Display;
