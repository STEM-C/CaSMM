export const parseXML = xml => {
  const parser = new DOMParser();
  const xmlData = {
    blocks: {},
    categories: {}
  };
  let xmlDoc = parser.parseFromString(xml, "text/xml");
  const xmlBlocks = xmlDoc.querySelectorAll('block');
  for (const block of xmlBlocks) {
    const blockType = block.getAttribute('type');
    if(xmlData.blocks[blockType]) {
      xmlData.blocks[blockType].count++;
    } else {
      xmlData.blocks[blockType] = {
        count: 1,
        deleted: 0
      };
    }
  }
  return xmlData;
}

export const compareXML = ({blocks: currentBlocks}, {blocks: previousBlocks}) => {
  const blocks = diffObjects(currentBlocks, previousBlocks);
  return {
    blocks
  }
}

const diffObjects = (currentObj, previousObj) => {
  const currentKeys = Object.keys(currentObj)
  const prevKeys = Object.keys(previousObj)
  // deleted all of one type of block
  if (prevKeys.length > currentKeys.length) {
    for(let key of prevKeys) {
      if(currentKeys.indexOf(key) === -1) {
        console.log('deleted all of one block');
        currentObj[key] = {
          count: 0,
          deleted: previousObj[key].deleted + 1
        }
      }
    }
  }
  for (let key of currentKeys) {
    if (key in previousObj) {
      if (currentObj[key].count < previousObj[key].count) {
        currentObj[key].deleted = previousObj[key].deleted + 1;
        console.log('a block was deleted');
      }
      if(currentObj[key].deleted < previousObj[key].deleted) {
        console.log('a block was reintroduced');
        currentObj[key] = {
          count: 1,
          deleted: previousObj[key].deleted
        }
      }
    }
  }
  return currentObj
}