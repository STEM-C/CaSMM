import React, { useEffect, useState} from 'react';
import '../DayPanels.less';
import {
  Menu,
  Checkbox,
  Input,
  Switch,
} from 'antd';


export default function StudentToolboxMenu(props) {
  const [searchFilter, setSearchFilter] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [openedToolBoxCategories, setOpenedToolBoxCategories] = useState([]);
  const [selectedToolBoxCategories, setSelectedToolBoxCategories] = useState([]);
  const { day, studentToolbox, setStudentToolbox } = props;

  const { SubMenu } = Menu;

  useEffect(() => {
    // once the day state is set, set the workspace and save
    const setUp = async () => {
        //set selected blocks in toolbox
        let tempCategories = [],
        tempToolBox = [];
        day &&
        day.selectedToolbox &&
        day.selectedToolbox.forEach(([category, blocks]) => {
            tempCategories.push(category);
            tempToolBox = [
            ...tempToolBox,
            ...blocks.map((block) => block.name)
            ];
        });

        setOpenedToolBoxCategories(tempCategories);
        setStudentToolbox(tempToolBox);
    }
    setUp();
  }, [day]);

  const handleSearchFilterChange = (value) => {
    let validCategories = [];

    if (value === '') {
      validCategories =
        day &&
        day.toolbox &&
        day.toolbox.reduce((accume, [category, blocks]) => {
          if (blocks.some((block) => studentToolbox.includes(block.name))) {
            return [...accume, category];
          } else {
            return accume;
          }
        }, []);
    } else {
      validCategories =
        day &&
        day.toolbox &&
        day.toolbox.reduce((accume, [category, blocks]) => {
          if (blocks.some((block) => block.name.includes(value))) {
            return [...accume, category];
          } else {
            return accume;
          }
        }, []);
    }

    setOpenedToolBoxCategories(validCategories);
    setSearchFilter(value);
  };

  /**
   * filters out blocks not in searchFilter
   * @param {object} blocks {name, description}
   */
  const applySearchFilter = (blocks) => {
    return blocks.filter((block) => block.name.includes(searchFilter));
  };

  /**
   * select or deselect entire toolbox
   * @param {object} event
   */
  const handleSelectEntireToolBox = (event) => {
    if (event.target.checked) {
      let tempToolBox = [];
      let tempCategories = [];
      day &&
        day.toolbox &&
        day.toolbox.forEach(([category, blocks]) => {
          tempCategories.push(category);
          tempToolBox = [...tempToolBox, ...blocks.map((block) => block.name)];
        });

      setSelectedToolBoxCategories(tempCategories);
      setStudentToolbox(tempToolBox);
      setSelectAll(true);
    } else {
      setStudentToolbox([]);
      setSelectedToolBoxCategories([]);
      setSelectAll(false);
    }
  };

  /**
   * select or deselect toolbox category
   * @param {boolean} checked if the switch has just be checked or not
   * @param {string} category the category being selected
   * @param {[object]} blocks the avaliable blocks inside the category
   * @param {object} event
   */
  const handleSelectToolBoxCategory = (checked, category, blocks, event) => {
    event.stopPropagation(); //prevent the submenu from being clicked on

    let blockNames = blocks.map((block) => block.name);

    if (checked) {
      setSelectedToolBoxCategories([...selectedToolBoxCategories, category]);
      setStudentToolbox([
        ...studentToolbox,
        ...blockNames.filter((item) => !studentToolbox.includes(item)),
      ]);
    } else {
      setSelectedToolBoxCategories(
        selectedToolBoxCategories.filter((item) => item !== category)
      );
      setStudentToolbox(
        studentToolbox.filter((item) => !blockNames.includes(item))
      );
      setSelectAll(false);
    }
  };

  /**
   * handle selecting a single block
   * @param {boolean} checked
   * @param {string} blockName
   * @param {string} category the category block belongs to
   */
  const handleSelectToolBoxBlock = (checked, blockName, category) => {
    //reverse, checked = just unchecked, !check = just checked
    if (checked) {
      setStudentToolbox(studentToolbox.filter((item) => item !== blockName));
      setSelectAll(false);
      setSelectedToolBoxCategories(
        selectedToolBoxCategories.filter((x) => x !== category)
      );
    } else {
      setStudentToolbox([...studentToolbox, blockName]);
    }
  };

  const renderImage = (block)=>{

    if(block.image_url){
\      return <img 
        height="95%"
        width="95%"
        src={process.env.PUBLIC_URL + block.image_url}
        />
    }
    else
      return block.name;
  }

  return (
          <div id='side-container'>
            <div>
              Current Student Toolbox Selection
              <Input
                placeholder='Search Block'
                prefix={<i className='fa fa-search' />}
                onChange={(e) => handleSearchFilterChange(e.target.value)}
              />
              <Checkbox
                checked={selectAll}
                onClick={handleSelectEntireToolBox}
                disabled={searchFilter}
              >
                Select All
              </Checkbox>
              <Menu
                id='menu'
                mode='inline'
                openKeys={openedToolBoxCategories}
                onOpenChange={(keys) => setOpenedToolBoxCategories(keys)}
              >
                {
                  // Maps out block categories
                  day &&
                    day.toolbox &&
                    day.toolbox.map(([category, blocks]) => (
                      <SubMenu
                        key={category}
                        title={
                          <span>
                            <span>{category}</span>
                            {openedToolBoxCategories.some(
                              (c) => c === category
                            ) ? ( //check if the submenu is open
                              <span id='category-switch'>
                                <Switch
                                  disabled={searchFilter}
                                  checked={selectedToolBoxCategories.includes(
                                    category
                                  )}
                                  checkedChildren='category selected'
                                  unCheckedChildren='select category'
                                  onChange={(checked, event) =>
                                    handleSelectToolBoxCategory(
                                      checked,
                                      category,
                                      blocks,
                                      event
                                    )
                                  }
                                />
                              </span>
                            ) : null}
                          </span>
                        }
                      >
                        {
                          //filter out blocks not in search term
                          applySearchFilter(blocks).map((block) => {
                            return (
                              <Menu.Item className="ImageMenu" key={block.name}>
                                <Checkbox
                                  checked={
                                    studentToolbox.indexOf(block.name) > -1
                                      ? true
                                      : false
                                  }
                                  onClick={(e) =>
                                    handleSelectToolBoxBlock(
                                      !e.target.checked,
                                      block.name,
                                      category
                                    )
                                  }
                                >
                                  {renderImage(block)}
                                </Checkbox>
                              </Menu.Item>
                            );
                          })
                        }
                      </SubMenu>
                    ))
                }
              </Menu>
            </div>
        </div>
    )
}
