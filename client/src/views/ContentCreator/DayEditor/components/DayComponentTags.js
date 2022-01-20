import { Input, Tag } from 'antd';
import React, { useState } from 'react';

const DayComponentTags = ({ components, setComponents, colorOffset }) => {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const color = [
    'magenta',
    'purple',
    'green',
    'cyan',
    'red',
    'geekblue',
    'volcano',
    'blue',
    'orange',
    'gold',
    'lime',
  ];

  const handleClose = (removedTag) => {
    const newTags = components.filter((tag) => tag !== removedTag);
    setComponents(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputConfirm = () => {
    if (inputValue) {
      let word = inputValue.trim();
      word = word.charAt(0).toUpperCase() + word.slice(1);
      if (components.indexOf(word) === -1) {
        setComponents([...components, word]);
      }
    }
    setInputVisible(false);
    setInputValue('');
  };

  return (
    <div style={{ marginTop: '1.5vh' }}>
      {components.map((tag, index) => (
        <Tag
          closable
          key={index}
          color={color[(index + colorOffset) % 11]}
          onClose={(e) => {
            e.preventDefault();
            handleClose(tag);
          }}
        >
          {tag}
        </Tag>
      ))}
      {inputVisible && (
        <Input
          type='text'
          id='tag-input'
          value={inputValue}
          autoFocus
          autoComplete='off'
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={handleInputConfirm}
          onBlur={handleInputConfirm}
        />
      )}
      {!inputVisible && <Tag onClick={showInput}>New Tag</Tag>}
    </div>
  );
};

export default DayComponentTags;
