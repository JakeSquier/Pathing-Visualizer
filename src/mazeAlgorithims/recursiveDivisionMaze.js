let walls;
export function recursiveDivisionMaze(grid, startNode, finishNode, isThereStop, stopNode=false) {
  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }
  let vertical = range(grid[0].length);
  let horizontal = range(grid.length);
  walls = [];
  getRecursiveWalls(vertical, horizontal, grid, startNode, finishNode, isThereStop, stopNode);
  return walls;
}

function range(len) {
  let result = [];
  for (let i = 0; i < len; i++) {
    result.push(i);
  }
  return result;
}

//dir === 0 => Horizontal
//dir === 1 => Vertical

function getRecursiveWalls(vertical, horizontal, grid, startNode, finishNode, isThereStop, stopNode) {
  if (vertical.length < 2 || horizontal.length < 2) {
    return;
  }
  let dir;
  let num;
  if (vertical.length > horizontal.length) {
    dir = 0;
    num = generateOddRandomNumber(vertical);
  }
  if (vertical.length <= horizontal.length) {
    dir = 1;
    num = generateOddRandomNumber(horizontal);
  }

  if (dir === 0) {
    addWall(dir, num, vertical, horizontal, startNode, finishNode, isThereStop, stopNode);
    getRecursiveWalls(
      vertical.slice(0, vertical.indexOf(num)),
      horizontal,
      grid,
      startNode,
      finishNode,
      isThereStop,
      stopNode
    );
    getRecursiveWalls(
      vertical.slice(vertical.indexOf(num) + 1),
      horizontal,
      grid,
      startNode,
      finishNode,
      isThereStop,
      stopNode
    );
  } else {
    addWall(dir, num, vertical, horizontal, startNode, finishNode, isThereStop, stopNode);
    getRecursiveWalls(
      vertical,
      horizontal.slice(0, horizontal.indexOf(num)),
      grid,
      startNode,
      finishNode,
      isThereStop,
      stopNode
    );
    getRecursiveWalls(
      vertical,
      horizontal.slice(horizontal.indexOf(num) + 1),
      grid,
      startNode,
      finishNode,
      isThereStop,
      stopNode
    );
  }
}

function generateOddRandomNumber(array) {
  let max = array.length - 1;
  let randomNum =
    Math.floor(Math.random() * (max / 2)) +
    Math.floor(Math.random() * (max / 2));
  if (randomNum % 2 === 0) {
    if (randomNum === max) {
      randomNum -= 1;
    } else {
      randomNum += 1;
    }
  }
  return array[randomNum];
}

//dir === 0 => Horizontal
//dir === 1 => Vertical

function addWall(dir, num, vertical, horizontal, startNode, finishNode, isThereStop, stopNode) {
  
  let isStartFinish = false;
  let tempWalls = [];
  if (dir === 0) {
    if (horizontal.length === 2) return;
    for (let temp of horizontal) {
      if (
        (temp === startNode.row && num === startNode.col) ||
        (temp === finishNode.row && num === finishNode.col) ||
        (isThereStop && (temp === stopNode.row && num === stopNode.col))
      ) {
        isStartFinish = true;
        continue;
      }
      tempWalls.push([temp, num]);
    }
  } else {
    if (vertical.length === 2) return;
    for (let temp of vertical) {
      if (
        (num === startNode.row && temp === startNode.col) ||
        (num === finishNode.row && temp === finishNode.col) ||
        (isThereStop && (num === stopNode.row && temp === stopNode.col))
      ) {
        isStartFinish = true;
        continue;
      }
      tempWalls.push([num, temp]);
    }
  }
  if (!isStartFinish) {
    tempWalls.splice(generateRandomNumber(tempWalls.length), 1);
  }
  for (let wall of tempWalls) {
    walls.push(wall);
  }
}

function generateRandomNumber(max) {
  let randomNum =
    Math.floor(Math.random() * (max / 2)) +
    Math.floor(Math.random() * (max / 2));
  if (randomNum % 2 !== 0) {
    if (randomNum === max) {
      randomNum -= 1;
    } else {
      randomNum += 1;
    }
  }
  return randomNum;
}