import React from 'react';

const Image = (props) => {
  return <img {...props} alt={props.alt || ''} />;
};

export default Image;
