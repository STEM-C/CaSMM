import { Input, Tag } from 'antd';
import React, { useState, useEffect } from 'react';

const DayComponentTags = () => {
  const [tags, setTags] = useState(['tag1', 'tag2', 'tag3']);
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
    const newTags = tags.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    console.log([...tags, inputValue]);
    setInputVisible(false);
    setInputValue('');
  };

  return (
    <div>
      {tags.map((tag, index) => (
        <Tag
          closable
          key={index}
          color={color[index % 11]}
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
          value={inputValue}
          autoFocus
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
