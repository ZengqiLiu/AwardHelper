import React from 'react';

const List = ({ items = [] }) => {
  return (
    <ol>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ol>
  );
};

export default List;