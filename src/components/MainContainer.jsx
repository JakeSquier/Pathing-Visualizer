import React, {Component} from 'react';
import $ from 'jquery' 
import Visualizer from './PathFindingVisualizer/Visualizer'
import { randomMaze } from '../mazeAlgorithims/randomMaze';
import { verticalMaze } from '../mazeAlgorithims/verticalMaze';
import { horizontalMaze } from '../mazeAlgorithims/HorizontalMaze';
import { recursiveDivisionMaze } from '../mazeAlgorithims/recursiveDivisionMaze';
import Navbar from './navComponents/Navbar';
import NavTop from './navComponents/topNav';
import itemData from '../data/item-data'
import algData from '../data/alg-data'
import pathGrabWorker from '../workers/pathGrabWorker';
import _dijkstraWorker from "../workers/dijkstraWorker";
import aStarWorker from '../workers/aStarWorker'
import greedyBestFirstSearchWorker from '../workers/greedyBestFirstSearchWorker';
import breadthFirstSearchWorker from '../workers/breadthFirstSearchWorker';
import depthFirstSearchWorker from '../workers/depthFirstSearchWorker';
import bidirectionalGreedySearchWorker from '../workers/bidirectionalGreedySearchWorker';
import WebWorker from "../workers/workerSetup";
import './mainContainer.css'

export default class MainContainer extends Component{
    constructor(props){
        super(props);
        this.state = {
            grid: [],
            mouseIsPressed: false,
            showNav: false,
            currItemDesc: 'Start',
            currItemObj: itemData[0],
            currAlgObj: algData[0],
            currAlgTab: 0,
            lcurrMazeAlg: 'Recursive Division Maze',
            rowNum: 24,
            colNum: 49,
            currMazeTab: 0,
            startNode: [9, 1],
            finishNode: [9, 47],
            startIsMoving: false,
            finishIsMoving: false,
            isThereStop: false,
            stopIsMoving: false,
            prevStop: [],
            generatingMaze: false,
            visualizingAlgorithm: false,
            animationSpeed: 20,
            gridClean: true,
            maze: false
        }
    }
    //reminder!!
    // row is width
    // col is height
    componentDidMount() {
      const grid = renderGrid(this.state, this.state.rowNum, this.state.colNum)
      this.setState({grid: grid});
    }

    handleMouseDown = (row, col) => {

        var newGrid = this.state.grid
        var node = newGrid[row][col]

        if(this.state.visualizingAlgorithm || this.state.generatingMaze) return

        if(this.state.grid[row][col].isStart){
          this.setState({startIsMoving: true})
          newGrid = this.state.grid
        } else if(this.state.grid[row][col].isFinish){
          this.setState({finishIsMoving: true})
          newGrid = this.state.grid
        } else if(this.state.currItemDesc === 'Stop'){
          this.setState({stopIsMoving: true, isThereStop: true})
        } else if(this.state.currItemDesc === 'Wall' && (!node.isStart && !node.isFinish && !node.isStop)) {
          newGrid = getNewGridWithWallToggled( newGrid, row, col)   
        }
        this.setState({grid: newGrid, mouseIsPressed: true});
    }
    
    handleMouseEnter = (row, col) => {

        if (!this.state.mouseIsPressed) return;

        var newGrid = this.state.grid;
        var node = newGrid[row][col]

        if( node.isStart || node.isStop || node.isFinish || this.state.visualizingAlgorithm || this.state.generatingMaze) return

        if(this.state.startIsMoving){
          newGrid = getNewGridWithStart(this.state.grid, row, col, this.state.startNode)
          this.setState({startNode: [row, col]})
        } else if(this.state.finishIsMoving){
          newGrid = getNewGridWithFinish(this.state.grid, row, col, this.state.finishNode)
          this.setState({finishNode: [row, col]})
        } else if(this.state.currItemDesc === 'Stop'){
          newGrid = getNewGridWithStopToggled(this.state.grid, row, col, this.state.prevStop);
          this.setState({prevStop: [row, col]})
        } else if(this.state.currItemDesc === 'Wall' && (!node.isStart && !node.isFinish && !node.isStop)) {
          newGrid = getNewGridWithWallToggled( newGrid, row, col);
        }
        this.setState({grid: newGrid});
    }
    
    handleMouseUp = (row, col) => {
        this.setState({mouseIsPressed: false, startIsMoving: false, finishIsMoving: false});
    }

    handleNav = () => {
      this.setState({showNav: !this.state.showNav})
    }

    //navBar functions
    handleItemDescChange = (e, item) => {
      var newItem = `${item}`
      itemData.map((_item) => {
        if(item === _item.id) this.setState({currItemDesc: newItem, currItemObj: _item})

        return _item
      })
    }

    handleTabs = (e, val) => {
      this.setState({currAlgTab: val, currAlgObj: algData[val]})
    }

    handleMazeTabs = (e, val) => {
      this.setState({currMazeTab: val})
    }

    handleSpeedChange = (e, val) => {
      var currSpeed = this.state.animationSpeed

      if(val && currSpeed > 5){
        this.setState({animationSpeed: currSpeed-5})
      } if(!val && currSpeed < 35){
        this.setState({animationSpeed: currSpeed+5})
      }
    }

    generateMaze = (e) => {

      if(this.state.generatingMaze || this.state.visualizingAlgorithm || !this.state.gridClean || this.state.maze) return

      this.setState({maze: true})

      var currAlg = this.state.currMazeTab
 
      if(currAlg===0){
        this.generateRecursiveDivisionMaze()
      } else if(currAlg===1){
        this.generateVerticalMaze()
      } else if(currAlg===2){
        this.generateHorizontalMaze()
      } else if(currAlg===3){
        this.generateRandomMaze()
      }
    }

    resetGrid = () => {
      if (this.state.visualizingAlgorithm || this.state.generatingMaze) {
        return;
      }
      document.getElementsByClassName('progress')[0].style.width = '0%'

      var rowNum = this.state.rowNum
      var colNum = this.state.colNum

      const grid = this.state.grid
      const startNode = this.state.startNode
      const finishNode = this.state.finishNode
      const stopNode = this.state.isThereStop ? this.state.prevStop : false

      for (let row = 0; row < rowNum; row++) {
        for (let col = 0; col < colNum; col++) {
          if ( (row === startNode[0] && col === startNode[1])) 
          {
            document.getElementById(`node-${row}-${col}`).className = "node node-start";
          } else if((row === finishNode[0] && col === finishNode[1]))
          {
            document.getElementById(`node-${row}-${col}`).className = "node node-finish";
          } else if(stopNode !== false && (row === stopNode[0] && col === stopNode[1]))
          {
            document.getElementById(`node-${row}-${col}`).className = "node node-stop";
          } else if(grid[row][col].isWall)
          {
            document.getElementById(`node-${row}-${col}`).className = "node node-wall";
          } else {
            document.getElementById(`node-${row}-${col}`).className = "node";
          }
        }
      }
      const newGrid = getGridWithoutPath(this.state.grid, true);
      this.setState({
        grid: newGrid,
        visualizingAlgorithm: false,
        generatingMaze: false,
        gridClean: true,
        maze: false
      });
    }

    clearGrid = () => {

      if (this.state.visualizingAlgorithm || this.state.generatingMaze) {
        return;
      }
      document.getElementsByClassName('progress')[0].style.width = '0%'
      
      var rowNum = this.state.rowNum
      var colNum = this.state.colNum

      const startNode = this.state.startNode
      const finishNode = this.state.finishNode

      for (let row = 0; row < rowNum; row++) {
        for (let col = 0; col < colNum; col++) {
          if ( (row === startNode[0] && col === startNode[1])) 
          {
            document.getElementById(`node-${row}-${col}`).className = "node node-start";
          } else if((row === finishNode[0] && col === finishNode[1]))
          {
            document.getElementById(`node-${row}-${col}`).className = "node node-finish";
          } else 
          {
            document.getElementById(`node-${row}-${col}`).className = "node";
          }
        }
      }
      const newGrid = getGridWithoutPath(this.state.grid);
      this.setState({
        grid: newGrid,
        visualizingAlgorithm: false,
        generatingMaze: false,
        prevStop: [],
        isThereStop: false  ,
        gridClean: true,
        maze: false
      });
    }

    // play animation

    playAnimation = (e) => {

      if(this.state.generatingMaze || this.state.visualizingAlgorithm || !this.state.gridClean) return

      var currAlg = this.state.currAlgObj.id
      this.setState({
        gridClean: false,
        visualizingAlgorithm: true
      })
      if(currAlg===0){
        this.visualizeDijkstra()
      } else if(currAlg===1){
        this.visualizeaStar()
      } else if(currAlg===4){
        this.visualizbfs()
      } else if(currAlg===2){
        this.visualizegbfs()
      } else if(currAlg===5){
        this.visualizedfs()
      } else if(currAlg===3){
        this.visualizeBidirectionalGreedySearch()
      }
      return
    }

    handleProgressSetup = (
      isThereStop, 
      isSecondAnimation, 
      animationSpeed,
      animationDuration,
    ) => {

      const progressBar = document.getElementById(`progressBar`)
      progressBar.className = 'progress progress-no-stop'
      
      if(!isThereStop) {

        progressBar.className = 'progress progress-no-stop-anime'
        progressBar.style.animationDuration = `${(animationDuration*animationSpeed/1000)}s`
        progressBar.addEventListener('animationend', () => {
          progressBar.classList.remove('progress-no-stop-anime')
          progressBar.className = 'progress progress-no-stop'
        })
        return 100/animationDuration

      } else if(!isSecondAnimation && isThereStop) {

        progressBar.className = 'progress progress-no-stop-anime'
        progressBar.style.animationDuration = `${(animationDuration*animationSpeed/1000)}s`
        progressBar.addEventListener('animationend', () => {
          progressBar.classList.remove('progress-no-stop-anime')
          progressBar.className = 'progress progress-no-stop'
        })
        return 50/animationDuration

      } else if(isSecondAnimation && isThereStop) {

        progressBar.className = 'progress progress-stop-anime'
        progressBar.style.animationDuration = `${(animationDuration*animationSpeed/1000)}s`
        progressBar.addEventListener('animationend', () => {
          progressBar.classList.remove('progress-stop-anime')
          progressBar.className = 'progress progress-stop'
        })
        return 50/animationDuration

      }
    }

    //animte dijkstra

    animateDijkstra = (
      visitedNodesInOrder, 
      nodesInShortestPathOrder, 
      animationStall,
      animationSpeed=10, 
      isThereStop=false,
      isSecondAnimation=false
    ) => {

      var animationColor;

      animationColor = isSecondAnimation ? animationColor = 'node-target-visited' : animationColor = 'node-visited'

      //progressTracker
      const progress = $("#progressBar")

      var integralVal = this.handleProgressSetup(
        isThereStop,
        isSecondAnimation,
        animationSpeed,
        visitedNodesInOrder.length
      )

      for (let i = 0; i <= visitedNodesInOrder.length; i++) {

        if (i === visitedNodesInOrder.length) {

          if(isSecondAnimation && isThereStop) return

          setTimeout(this.animateShortestPath, animationStall*animationSpeed, nodesInShortestPathOrder)

          return;
        }
        setTimeout(() => {
          const node = visitedNodesInOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).className = `node ${animationColor} node-gap-vert node-gap-horiz`;
            progress.width(`+=${integralVal}%`)
          }, animationSpeed * i);
      }
    }
    
    visualizeDijkstra = () => {

      this.dijkstraWorker = new WebWorker(_dijkstraWorker)

      this.pathGrabWorker = new WebWorker(pathGrabWorker)

      var grid = this.state.grid;
      const START_NODE = this.state.startNode
      const FINISH_NODE = this.state.finishNode
      const STOP_NODE = this.state.prevStop
      const startNode = grid[START_NODE[0]][START_NODE[1]];
      const finishNode = grid[FINISH_NODE[0]][FINISH_NODE[1]];
      const stopNode = this.state.isThereStop ? grid[STOP_NODE[0]][STOP_NODE[1]] : []
      if(this.state.isThereStop){

        this.dijkstraWorker.postMessage([grid, startNode, finishNode, stopNode])

        this.dijkstraWorker.addEventListener('message', (message) => {
            
            const animateTiming = async (message) => {

                this.pathGrabWorker.postMessage([message.data, true])

                this.pathGrabWorker.addEventListener('message', (messageTwo) => {

                    const animateTime = (message, messageTwo) => {

                      var nodesInShortestPathOrder;

                      if(messageTwo.data[0][0] === false && messageTwo.data[1][0] === false) {
                        nodesInShortestPathOrder = [startNode, stopNode, finishNode]
                      } else if(messageTwo.data[0][0] === false) {
                        nodesInShortestPathOrder = [startNode, ...messageTwo.data[1]]
                      } else if(messageTwo.data[1][0] === false) {
                        nodesInShortestPathOrder = [...messageTwo.data[0], finishNode]
                      } else {
                        nodesInShortestPathOrder = [...messageTwo.data[0], ...messageTwo.data[1]]
                      }

                      this.animateDijkstra(
                        message.data[0], 
                        nodesInShortestPathOrder, 
                        (message.data[0].length+message.data[1].length), 
                        this.state.animationSpeed, 
                        this.state.isThereStop,
                        false
                      )

                      setTimeout(this.animateDijkstra, 
                        message.data[0].length * this.state.animationSpeed, 
                        message.data[1], 
                        nodesInShortestPathOrder,
                        (message.data[0].length+message.data[1].length), 
                        this.state.animationSpeed, 
                        this.state.isThereStop, 
                        true
                      )
                    }

                    animateTime(message, messageTwo)
                })
            }
            animateTiming(message)
        })

        return

      } else if(!this.state.isThereStop){

        this.dijkstraWorker.postMessage([grid, startNode, finishNode, false])

        this.dijkstraWorker.addEventListener('message', (message) => {

            this.pathGrabWorker.postMessage([message.data, false])

            this.pathGrabWorker.addEventListener('message', (messageTwo) => {

              var nodesInShortestPathOrder = messageTwo.data === false ? [startNode, finishNode] : messageTwo.data

              this.animateDijkstra(
                message.data, 
                nodesInShortestPathOrder, 
                message.data.length, 
                this.state.animationSpeed, 
                this.state.isThereStop
              )

            })
        })
      }
    }

    //animate aStar

    animateaStar = (
      visitedNodesInOrder, 
      nodesInShortestPathOrder,
      animationStall, 
      animationSpeed,
      isThereStop, 
      isSecondAnimation=false
    ) => {

      var animationColor

      animationColor = isSecondAnimation ? animationColor = 'node-target-visited' : animationColor = 'node-visited'

      //progress tracker
      const progress = $("#progressBar")
      progress.replaceWith($("#progressBar")).clone(true)

      var integralVal = this.handleProgressSetup(
        isThereStop,
        isSecondAnimation,
        animationSpeed,
        visitedNodesInOrder.length
      )

      for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        if (i === visitedNodesInOrder.length) {

          if(isSecondAnimation && isThereStop) return

          setTimeout(this.animateShortestPath, animationStall*animationSpeed, nodesInShortestPathOrder)

          return;
        }
        setTimeout(() => {
            const node = visitedNodesInOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).className = `node ${animationColor} node-gap-vert node-gap-horiz`;
            progress.width(`+=${integralVal}%`)
          }, animationSpeed * i);
      }
    }

    visualizeaStar = () => {

      this.aStarWorker = new WebWorker(aStarWorker)

      this.pathGrabWorker = new WebWorker(pathGrabWorker)

      var grid = this.state.grid;
      const START_NODE = this.state.startNode
      const FINISH_NODE = this.state.finishNode
      const STOP_NODE = this.state.prevStop
      const startNode = grid[START_NODE[0]][START_NODE[1]];
      const finishNode = grid[FINISH_NODE[0]][FINISH_NODE[1]];
      const stopNode = this.state.isThereStop ? grid[STOP_NODE[0]][STOP_NODE[1]] : []

      if(this.state.isThereStop) {
        this.aStarWorker.postMessage([grid, startNode, finishNode, stopNode])

        this.aStarWorker.addEventListener('message', (message) => {
            
          const animateTiming = async (message) => {

            this.pathGrabWorker.postMessage([message.data, true])

            this.pathGrabWorker.addEventListener('message', (messageTwo) => {

                const animateTime = (message, messageTwo) => {

                  var nodesInShortestPathOrder;

                  if(messageTwo.data[0][0] === false && messageTwo.data[1][0] === false) {
                    nodesInShortestPathOrder = [startNode, stopNode, finishNode]
                  } else if(messageTwo.data[0][0] === false) {
                    nodesInShortestPathOrder = [startNode, ...messageTwo.data[1]]
                  } else if(messageTwo.data[1][0] === false) {
                    nodesInShortestPathOrder = [...messageTwo.data[0], finishNode]
                  } else {
                    nodesInShortestPathOrder = [...messageTwo.data[0], ...messageTwo.data[1]]
                  }

                  this.animateaStar(
                    message.data[0], 
                    nodesInShortestPathOrder, 
                    (message.data[0].length+message.data[1].length), 
                    this.state.animationSpeed, 
                    this.state.isThereStop,
                    false
                  )

                  setTimeout(this.animateaStar, 
                    message.data[0].length * this.state.animationSpeed, 
                    message.data[1], 
                    nodesInShortestPathOrder,
                    (message.data[0].length+message.data[1].length), 
                    this.state.animationSpeed, 
                    this.state.isThereStop, 
                    true
                  )
                }

                animateTime(message, messageTwo)
            })
        }
        animateTiming(message)
    })
          return
          
      } else if(!this.state.isThereStop){

          this.aStarWorker.postMessage([grid, startNode, finishNode, false])

          this.aStarWorker.addEventListener('message', (message) => {

              this.pathGrabWorker.postMessage([message.data, false])

              this.pathGrabWorker.addEventListener('message', (messageTwo) => {

                var nodesInShortestPathOrder = messageTwo.data === false ? [startNode, finishNode] : messageTwo.data

                this.animateaStar(
                  message.data, 
                  nodesInShortestPathOrder, 
                  message.data.length,
                  this.state.animationSpeed,
                  this.state.isThereStop,
                  false
                )

              })
          })
      }
    }

    //animate breadth first search 

    animatebfs = (
      visitedNodesInOrder, 
      nodesInShortestPathOrder, 
      animationStall,
      animationSpeed, 
      isThereStop,
      isSecondAnimation=false
    ) => {

      var animationColor

      animationColor = isSecondAnimation ? animationColor = 'node-target-visited' : animationColor = 'node-visited'

      //progress tracker
      const progress = $("#progressBar")
      progress.replaceWith($("#progressBar")).clone(true)

      var integralVal = this.handleProgressSetup(
        isThereStop,
        isSecondAnimation,
        animationSpeed,
        visitedNodesInOrder.length
      )

      for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        if (i === visitedNodesInOrder.length) {

          if(isSecondAnimation && isThereStop) return
          
          setTimeout(this.animateShortestPath, animationSpeed*animationStall, nodesInShortestPathOrder)

          return;
          }
        setTimeout(() => {
          const node = visitedNodesInOrder[i];
          document.getElementById(`node-${node.row}-${node.col}`).className = `node ${animationColor} node-gap-vert node-gap-horiz`;
          progress.width(`+=${integralVal}%`)
        }, animationSpeed * i);
      }
    }

    visualizbfs = () => {
      
      this.breadthFirstSearchWorker = new WebWorker(breadthFirstSearchWorker)

      this.pathGrabWorker = new WebWorker(pathGrabWorker)

      var grid = this.state.grid;
      const START_NODE = this.state.startNode
      const FINISH_NODE = this.state.finishNode
      const STOP_NODE = this.state.prevStop
      const startNode = grid[START_NODE[0]][START_NODE[1]];
      const finishNode = grid[FINISH_NODE[0]][FINISH_NODE[1]];
      const stopNode = this.state.isThereStop ? grid[STOP_NODE[0]][STOP_NODE[1]] : []

      if(this.state.isThereStop){

        this.breadthFirstSearchWorker.postMessage([grid, startNode, finishNode, stopNode])

        this.breadthFirstSearchWorker.addEventListener('message', (message) => {
                       
            const animateTiming = async (message) => {

              this.pathGrabWorker.postMessage([message.data, true])

              this.pathGrabWorker.addEventListener('message', (messageTwo) => {

                  const animateTime = (message, messageTwo) => {

                    var nodesInShortestPathOrder;

                    if(messageTwo.data[0][0] === false && messageTwo.data[1][0] === false) {
                      nodesInShortestPathOrder = [startNode, stopNode, finishNode]
                    } else if(messageTwo.data[0][0] === false) {
                      nodesInShortestPathOrder = [startNode, ...messageTwo.data[1]]
                    } else if(messageTwo.data[1][0] === false) {
                      nodesInShortestPathOrder = [...messageTwo.data[0], finishNode]
                    } else {
                      nodesInShortestPathOrder = [...messageTwo.data[0], ...messageTwo.data[1]]
                    }

                    this.animatebfs(
                      message.data[0], 
                      nodesInShortestPathOrder, 
                      (message.data[0].length+message.data[1].length), 
                      this.state.animationSpeed, 
                      this.state.isThereStop,
                      false
                    )

                    setTimeout(this.animatebfs, 
                      message.data[0].length * this.state.animationSpeed, 
                      message.data[1], 
                      nodesInShortestPathOrder,
                      (message.data[0].length+message.data[1].length), 
                      this.state.animationSpeed, 
                      this.state.isThereStop,
                      true
                    )
                  }

                  animateTime(message, messageTwo)
              })
            }
          animateTiming(message)
      })
      return

      } else if(!this.state.isThereStop){

        this.breadthFirstSearchWorker.postMessage([grid, startNode, finishNode, false])

        this.breadthFirstSearchWorker.addEventListener('message', (message) => {

            this.pathGrabWorker.postMessage([message.data, false])

            this.pathGrabWorker.addEventListener('message', (messageTwo) => {

              var nodesInShortestPathOrder = messageTwo.data === false ? [startNode, finishNode] : messageTwo.data

              this.animatebfs(
                message.data, 
                nodesInShortestPathOrder, 
                message.data.length, 
                this.state.animationSpeed, 
                false
              )
            })
        })
      }
    }

    // greedy best first search

    animategbfs = (
      visitedNodesInOrder, 
      nodesInShortestPathOrder,
      animationStall, 
      animationSpeed, 
      isThereStop,
      isSecondAnimation=false
    ) => {

      var animationColor

      animationColor = isSecondAnimation ? animationColor = 'node-target-visited' : animationColor = 'node-visited'

      //progress tracker
      const progress = $("#progressBar")
      progress.replaceWith($("#progressBar")).clone(true)

      var integralVal = this.handleProgressSetup(
        isThereStop,
        isSecondAnimation,
        animationSpeed,
        visitedNodesInOrder.length
      )

      for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        if (i === visitedNodesInOrder.length) {

          if(isSecondAnimation && isThereStop) return

          setTimeout(this.animateShortestPath, animationStall*animationSpeed, nodesInShortestPathOrder)

          return;
          }
        setTimeout(() => {
            const node = visitedNodesInOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).className = `node ${animationColor} node-gap-vert node-gap-horiz`;
            progress.width(`+=${integralVal}%`)
          }, animationSpeed * i);
      }
    }

    visualizegbfs = () => {
      
      this.greedyBestFirstSearchWorker = new WebWorker(greedyBestFirstSearchWorker)

      this.pathGrabWorker = new WebWorker(pathGrabWorker)

      var grid = this.state.grid;
      const START_NODE = this.state.startNode
      const FINISH_NODE = this.state.finishNode
      const STOP_NODE = this.state.prevStop
      const startNode = grid[START_NODE[0]][START_NODE[1]];
      const finishNode = grid[FINISH_NODE[0]][FINISH_NODE[1]];
      const stopNode = this.state.isThereStop ? grid[STOP_NODE[0]][STOP_NODE[1]] : []

      if(this.state.isThereStop) {

        this.greedyBestFirstSearchWorker.postMessage([grid, startNode, finishNode, stopNode])

        this.greedyBestFirstSearchWorker.addEventListener('message', (message) => {
            
          const animateTiming = async (message) => {

            this.pathGrabWorker.postMessage([message.data, true])

            this.pathGrabWorker.addEventListener('message', (messageTwo) => {

                const animateTime = (message, messageTwo) => {

                  var nodesInShortestPathOrder;

                  if(messageTwo.data[0][0] === false && messageTwo.data[1][0] === false) {
                    nodesInShortestPathOrder = [startNode, stopNode, finishNode]
                  } else if(messageTwo.data[0][0] === false) {
                    nodesInShortestPathOrder = [startNode, ...messageTwo.data[1]]
                  } else if(messageTwo.data[1][0] === false) {
                    nodesInShortestPathOrder = [...messageTwo.data[0], finishNode]
                  } else {
                    nodesInShortestPathOrder = [...messageTwo.data[0], ...messageTwo.data[1]]
                  }

                  this.animategbfs(
                    message.data[0], 
                    nodesInShortestPathOrder, 
                    (message.data[0].length+message.data[1].length), 
                    this.state.animationSpeed, 
                    this.state.isThereStop,
                    false
                  )

                  setTimeout(this.animategbfs, 
                    message.data[0].length * this.state.animationSpeed, 
                    message.data[1], 
                    nodesInShortestPathOrder,
                    (message.data[0].length+message.data[1].length), 
                    this.state.animationSpeed, 
                    this.state.isThereStop, 
                    true
                  )
                }

                animateTime(message, messageTwo)
            })
          }
          animateTiming(message)
      })
      
      } else if(!this.state.isThereStop) {
        
        this.greedyBestFirstSearchWorker.postMessage([grid, startNode, finishNode, false])

        this.greedyBestFirstSearchWorker.addEventListener('message', (message) => {

            this.pathGrabWorker.postMessage([message.data, false])

            this.pathGrabWorker.addEventListener('message', (messageTwo) => {

              var nodesInShortestPathOrder = messageTwo.data === false ? [startNode, finishNode] : messageTwo.data

              this.animategbfs(
                message.data, 
                nodesInShortestPathOrder,
                message.data.length, 
                this.state.animationSpeed, 
                this.state.isThereStop,
                false
              )

            })
        })
      }
    }

    // depth first search

    animatedfs = (
      visitedNodesInOrder, 
      nodesInShortestPathOrder, 
      animationStall, 
      animationSpeed, 
      isThereStop,
      isSecondAnimation=false
    ) => {

      var animationColor

      animationColor = isSecondAnimation ? animationColor = 'node-target-visited' : animationColor = 'node-visited'

      //progress tracker
      const progress = $("#progressBar")
      progress.replaceWith($("#progressBar")).clone(true)

      var integralVal = this.handleProgressSetup(
        isThereStop,
        isSecondAnimation,
        animationSpeed,
        visitedNodesInOrder.length
      )

      for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        if (i === visitedNodesInOrder.length) {

          if(isSecondAnimation && isThereStop) return

          setTimeout(this.animateShortestPath, animationStall*animationSpeed, nodesInShortestPathOrder)

          return;
          }
        setTimeout(() => {
            const node = visitedNodesInOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).className = `node ${animationColor} node-gap-vert node-gap-horiz`;
            progress.width(`+=${integralVal}%`)
          }, animationSpeed * i);
      }
    }

    visualizedfs = () => {
            
      this.depthFirstSearchWorker = new WebWorker(depthFirstSearchWorker)

      this.pathGrabWorker = new WebWorker(pathGrabWorker)

      var grid = this.state.grid;
      const START_NODE = this.state.startNode
      const FINISH_NODE = this.state.finishNode
      const STOP_NODE = this.state.prevStop
      const startNode = grid[START_NODE[0]][START_NODE[1]];
      const finishNode = grid[FINISH_NODE[0]][FINISH_NODE[1]];
      const stopNode = this.state.isThereStop ? grid[STOP_NODE[0]][STOP_NODE[1]] : []
      
      if(this.state.isThereStop){

        this.depthFirstSearchWorker.postMessage([grid, startNode, finishNode, stopNode])

        this.depthFirstSearchWorker.addEventListener('message', (message) => {
            
          const animateTiming = async (message) => {

            this.pathGrabWorker.postMessage([message.data, true])

            this.pathGrabWorker.addEventListener('message', (messageTwo) => {

                const animateTime = (message, messageTwo) => {

                  var nodesInShortestPathOrder;

                  if(messageTwo.data[0][0] === false && messageTwo.data[1][0] === false) {
                    nodesInShortestPathOrder = [startNode, stopNode, finishNode]
                  } else if(messageTwo.data[0][0] === false) {
                    nodesInShortestPathOrder = [startNode, ...messageTwo.data[1]]
                  } else if(messageTwo.data[1][0] === false) {
                    nodesInShortestPathOrder = [...messageTwo.data[0], finishNode]
                  } else {
                    nodesInShortestPathOrder = [...messageTwo.data[0], ...messageTwo.data[1]]
                  }

                  this.animatedfs(
                    message.data[0], 
                    nodesInShortestPathOrder, 
                    (message.data[0].length+message.data[1].length), 
                    this.state.animationSpeed, 
                    this.state.isThereStop,
                    false
                  )

                  setTimeout(
                    this.animatedfs, 
                    message.data[0].length * this.state.animationSpeed, 
                    message.data[1], 
                    nodesInShortestPathOrder,
                    (message.data[0].length+message.data[1].length), 
                    this.state.animationSpeed, 
                    this.state.isThereStop, 
                    true
                  )
                }

                animateTime(message, messageTwo)
            })
          }
          animateTiming(message)
      })
        return

      } else if(!this.state.isThereStop){

        this.depthFirstSearchWorker.postMessage([grid, startNode, finishNode, false])

        this.depthFirstSearchWorker.addEventListener('message', (message) => {

            this.pathGrabWorker.postMessage([message.data, false])

            this.pathGrabWorker.addEventListener('message', (messageTwo) => {

              var nodesInShortestPathOrder = messageTwo.data === false ? [startNode, finishNode] : messageTwo.data

              this.animatedfs(
                message.data, 
                nodesInShortestPathOrder,
                message.data.length, 
                this.state.animationSpeed,
                this.state.isThereStop, 
                false
              )

            })
        })
      }
    }

    // bidirectional greedy first search

    animateBidirectionalAlgorithm = (
      visitedNodesInOrderStart,
      visitedNodesInOrderFinish,
      nodesInShortestPathOrder,
      isShortedPath,
      animationSpeed,
      animationStall,
      isSecondAnimation=false
    ) => {

      this.setState({visualizingAlgorithm: true})

      var animationColor

      animationColor = isSecondAnimation ? animationColor = 'node-target-visited' : animationColor = 'node-visited'

      //progress tracker
      const progress = $("#progressBar")
      progress.replaceWith($("#progressBar")).clone(true)

      var integralVal = this.handleProgressSetup(
        this.state.isThereStop,
        false,
        animationSpeed,
        visitedNodesInOrderStart.length
      )

      let len = Math.max(
        visitedNodesInOrderStart.length,
        visitedNodesInOrderFinish.length
      );

      for (let i = 1; i <= len; i++) {
        let nodeA = visitedNodesInOrderStart[i];
        let nodeB = visitedNodesInOrderFinish[i];
        if (i === visitedNodesInOrderStart.length) {

          if(isSecondAnimation && this.state.isThereStop) return

          setTimeout(() => {
            if (isShortedPath) {
              this.animateShortestPath(
                nodesInShortestPathOrder
              );
            } else {
              this.setState({ visualizingAlgorithm: false });
            }
          }, animationStall * animationSpeed);
          return;
        }
        setTimeout(() => {
          //visited nodes
          if (nodeA !== undefined) {
            document.getElementById(`node-${nodeA.row}-${nodeA.col}`).className = `node ${animationColor} node-gap-vert node-gap-horiz`;
          }
          if (nodeB !== undefined) {
            document.getElementById(`node-${nodeB.row}-${nodeB.col}`).className = `node ${animationColor} node-gap-vert node-gap-horiz`;
          }
          progress.width(`+=${integralVal*2}%`)

        }, i * animationSpeed);
      }
    }

    visualizeBidirectionalGreedySearch = () => {
      if (this.state.visualizingAlgorithm || this.state.generatingMaze) {
        return;
      }

      this.bidirectionalGreedySearchWorker = new WebWorker(bidirectionalGreedySearchWorker)

      const { grid } = this.state;
      const _startNode = this.state.startNode
      const _finishNode = this.state.finishNode
      const _stopNode = this.state.prevStop
      const startNode = grid[_startNode[0]][_startNode[1]];
      const finishNode = grid[_finishNode[0]][_finishNode[1]];
      const stopNode = this.state.isThereStop ? grid[_stopNode[0]][_stopNode[1]] : false

      if(this.state.isThereStop) {

        this.bidirectionalGreedySearchWorker.postMessage([grid, startNode, finishNode, stopNode, true])

        this.bidirectionalGreedySearchWorker.addEventListener('message', (message) => {

            const visitedNodesInOrderStart = message.data[0][0];
            const visitedNodesInOrderStopFirst = message.data[0][1];
            const isShortedPath = message.data[0][2];

            const visitedNodesInOrderStopSecond = message.data[1][0]
            const visitedNodesInOrderFinish = message.data[1][1]
            const isShortedPathSecond = message.data[1][2]

            if(visitedNodesInOrderStart[0] !== startNode) visitedNodesInOrderStart.unshift(startNode)

            if(visitedNodesInOrderStopFirst[0] !== stopNode) visitedNodesInOrderStopFirst.unshift(stopNode)

            if(visitedNodesInOrderFinish[0] !== finishNode) visitedNodesInOrderFinish.unshift(finishNode)

            const animationStall = (visitedNodesInOrderStart.length+visitedNodesInOrderStopFirst.length+visitedNodesInOrderStopSecond.length+visitedNodesInOrderFinish.length)

            const nodesInShortestPathOrderFirst = getNodesInShortestPathOrderBidirectionalGreedySearch(
              visitedNodesInOrderStart[visitedNodesInOrderStart.length - 1],
              visitedNodesInOrderStopFirst[visitedNodesInOrderStopFirst.length - 1],
              false
            )

            const nodesInShortestPathOrderSecond = getNodesInShortestPathOrderBidirectionalGreedySearch(
              visitedNodesInOrderStopSecond[visitedNodesInOrderStopSecond.length - 1],
              visitedNodesInOrderFinish[visitedNodesInOrderFinish.length - 1],
              true
            )

            const nodesInShortestPathOrder = [...nodesInShortestPathOrderFirst, ...nodesInShortestPathOrderSecond]

            setTimeout(() => {
              this.animateBidirectionalAlgorithm(
                visitedNodesInOrderStart,
                visitedNodesInOrderStopFirst,
                nodesInShortestPathOrder,
                isShortedPath,
                this.state.animationSpeed,
                animationStall,
                false
              );
            }, this.state.animationSpeed);

            setTimeout(() => {
              this.animateBidirectionalAlgorithm(
                visitedNodesInOrderStopSecond,
                visitedNodesInOrderFinish,
                nodesInShortestPathOrder,
                isShortedPathSecond,
                this.state.animationSpeed,
                animationStall,
                true
              );
            }, this.state.animationSpeed*((visitedNodesInOrderStart.length-1)+(visitedNodesInOrderStopFirst.length-1)))

        })

      } else if(!this.state.isThereStop) {

        this.bidirectionalGreedySearchWorker.postMessage([grid, startNode, finishNode, stopNode])

        this.bidirectionalGreedySearchWorker.addEventListener('message', (message) => {

            const visitedNodesInOrderStart = message.data[0];
            const visitedNodesInOrderFinish = message.data[1];
            if(!visitedNodesInOrderFinish[0].isFinish) visitedNodesInOrderFinish.unshift(finishNode)
  
            const isShortedPath = message.data[2];
            const nodesInShortestPathOrder = getNodesInShortestPathOrderBidirectionalGreedySearch(
              visitedNodesInOrderStart[visitedNodesInOrderStart.length - 1],
              visitedNodesInOrderFinish[visitedNodesInOrderFinish.length - 1]
            )

            setTimeout(() => {
              this.animateBidirectionalAlgorithm(
                visitedNodesInOrderStart,
                visitedNodesInOrderFinish,
                nodesInShortestPathOrder,
                isShortedPath,
                this.state.animationSpeed
              );
            }, this.state.animationSpeed);
        })
      }
    }

    //finish animations

    animateShortestPath = (nodesInShortestPathOrder) => {

      const startNode = this.state.grid[this.state.startNode[0]][this.state.startNode[1]]
      const finishNode = this.state.grid[this.state.finishNode[0]][this.state.finishNode[1]]
      const stopNode = this.state.isThereStop ? this.state.grid[this.state.prevStop[0]][this.state.prevStop[1]] : []
      const stall = (nodesInShortestPathOrder.length*50)+2

      setTimeout(() => {this.setState({visualizingAlgorithm: false})}, stall)

      for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        setTimeout(() => {
          const node = nodesInShortestPathOrder[i];

          var currObj = document.getElementById(`node-${node.row}-${node.col}`)

          if(node.row === startNode.row && node.col === startNode.col) {
            currObj.className = 'node node-shortest-path node-shortest-path-start node-no-gap-vert';
          } else if(node.row === finishNode.row && node.col === finishNode.col){
            currObj.className = 'node node-shortest-path node-shortest-path-finish';
          } else if(this.state.isThereStop && (node.row === stopNode.row && node.col === stopNode.col)) {
            currObj.className = 'node node-shortest-path node-shortest-path-stop';
          } else if(document.getElementById(`node-${node.row}-${node.col}`).className.includes('node-shortest-path')) {
            $(`#node-${node.row}-${node.col}`).replaceWith($(`#node-${node.row}-${node.col}`).clone(true))
          } else {
            currObj.className = 'node node-shortest-path';
          }

        }, 50 * i);
      }
    }

    //generate mazes

    animateMaze = (walls) => {
      for (let i = 0; i <= walls.length; i++) {
        if (i === walls.length) {   
          setTimeout(() => {
            this.setState({ generatingMaze: false })
          }, i * 10)      
          return;
        }
        setTimeout(() => {

          let wall = walls[i];
          let node = this.state.grid[wall[0]][wall[1]];
          node.isWall = true
          document.getElementById(`node-${node.row}-${node.col}`).className = "node node-wall"

        }, i * 10);
      }
    };

    getNewGridWithMaze = (walls) => {
      let grid = this.state.grid
      let newGrid = grid.slice();
      for (let wall of walls) {
        let node = grid[wall[0]][wall[1]];
        let newNode = {
          ...node,
          isWall: true,
        };
        newGrid[wall[0]][wall[1]] = newNode;
      }
      this.setState({ grid: newGrid, generatingMaze: false })
      return
    };

    generateRandomMaze() {
      if (this.state.visualizingAlgorithm || this.state.generatingMaze) {
        return;
      }
      this.setState({ generatingMaze: true });
      setTimeout(() => {
        const { grid } = this.state;
        const _startNode = this.state.startNode
        const _finishNode = this.state.finishNode
        const startNode = grid[_startNode[0]][_startNode[1]]
        const finishNode = grid[_finishNode[0]][_finishNode[1]]
        const stopNode = this.state.isThereStop ? grid[this.state.prevStop[0]][this.state.prevStop[1]] : false
        const walls = this.state.isThereStop ? randomMaze(grid, startNode, finishNode, true, stopNode) : randomMaze(grid, startNode, finishNode, false);
        this.animateMaze(walls);
      }, 10);
    }
  
    generateRecursiveDivisionMaze() {
      if (this.state.visualizingAlgorithm || this.state.generatingMaze) {
        return;
      }
      this.setState({ generatingMaze: true });
      setTimeout(() => {
        const { grid } = this.state;
        const _startNode = this.state.startNode
        const _finishNode = this.state.finishNode
        const startNode = grid[_startNode[0]][_startNode[1]]
        const finishNode = grid[_finishNode[0]][_finishNode[1]]
        const stopNode = this.state.isThereStop ? grid[this.state.prevStop[0]][this.state.prevStop[1]] : false
        const walls = this.state.isThereStop ? recursiveDivisionMaze(grid, startNode, finishNode, true, stopNode) : recursiveDivisionMaze(grid, startNode, finishNode, false, stopNode);
        this.animateMaze(walls);
      }, 10);
    }
  
    generateVerticalMaze() {
      if (this.state.visualizingAlgorithm || this.state.generatingMaze) {
        return;
      }
      this.setState({ generatingMaze: true });
      setTimeout(() => {
        const { grid } = this.state;
        const _startNode = this.state.startNode
        const _finishNode = this.state.finishNode
        const startNode = grid[_startNode[0]][_startNode[1]]
        const finishNode = grid[_finishNode[0]][_finishNode[1]]
        const stopNode = this.state.isThereStop ? grid[this.state.prevStop[0]][this.state.prevStop[1]] : false
        const walls = this.state.isThereStop ? verticalMaze(grid, startNode, finishNode, true, stopNode) : verticalMaze(grid, startNode, finishNode, false);
        this.animateMaze(walls);
      }, 10);
    }
  
    generateHorizontalMaze() {
      if (this.state.visualizingAlgorithm || this.state.generatingMaze) {
        return;
      }
      this.setState({ generatingMaze: true });
      setTimeout(() => {
        const { grid } = this.state;
        const _startNode = this.state.startNode
        const _finishNode = this.state.finishNode
        const startNode = grid[_startNode[0]][_startNode[1]]
        const finishNode = grid[_finishNode[0]][_finishNode[1]]
        const stopNode = this.state.isThereStop ? grid[this.state.prevStop[0]][this.state.prevStop[1]] : false
        const walls = this.state.isThereStop ? horizontalMaze(grid, startNode, finishNode, true, stopNode) : horizontalMaze(grid, startNode, finishNode, false);
        this.animateMaze(walls);
      }, 10);
    }

    render(){ 

        return(
            <div className="main-container">
                <div className='grid-info-container'>
                  <div className='grid-text-container'>
                    <p className='grid-text'>Current-algorithim: <span className='grid-alg-text'>{this.state.currAlgObj.name}</span></p>
                  </div>
                  <div className="progress-bar-container">
                      <div className='progress progress-no-stop' id='progressBar'/>
                  </div>
                </div>
                <NavTop state={this.state} clearGrid={this.clearGrid} resetGrid={this.resetGrid}/>
                <div className="visualizer-container">
                    <Visualizer 
                        state={this.state} 
                        handleMouseDown={this.handleMouseDown} 
                        handleMouseEnter={this.handleMouseEnter} 
                        handleMouseUp={this.handleMouseUp}
                    />
                </div>
                <Navbar state={this.state} toggleNav={this.handleNav} handleSpeedChange={this.handleSpeedChange} handleMazeTabs={this.handleMazeTabs} genMaze={this.generateMaze} play={this.playAnimation} handleTabs={this.handleTabs} handleItemChange={this.handleItemDescChange} visualizeDijkstra={this.visualizeDijkstra}/>
            </div>
        )
    }
}

const renderGrid = (state, _rowNum, _colNum) => {
    const grid = [];
    var rowNum = _rowNum
    var colNum = _colNum
    for (let row = 0; row < rowNum; row++) {
      const currentRow = []
      for (let col = 0; col < colNum; col++) {
        var node = createNode(col, row, state)
        node.className = 'node'
        currentRow.push(node)
      }
      grid.push(currentRow)
    }
    return grid;
}



const createNode = (col, row, state) => {
    const startNode = state.startNode
    const finishNode = state.finishNode
    const stopNode = state.prevStop
    return {
      col,
      row,
      isStart: row === startNode[0] && col === startNode[1],
      isFinish: row === finishNode[0] && col === finishNode[1],
      isStop: state.isThereStop ? row === stopNode[0] && col === stopNode[1] : false,
      isWall: false,
      previousNode: null,
      previousNodeSecond: null,
      isVisited: false,
      isVisitedSecond: false,
      distance: Infinity,
      distanceSecond: Infinity
    };
  };

  const getNewGridWithStart = (grid, row, col, prevStart) => {

    const newGrid = grid.slice();
    const newStart = newGrid[row][col]
    const oldStart = newGrid[prevStart[0]][prevStart[1]]
    const oldNode = {
      ...oldStart,
      isStart: !oldStart.isStart
    }
    const newNode = {
      ...newStart,
      isStart: !newStart.isStart,
      isWall: false
    };
    newGrid[row][col] = newNode;
    newGrid[prevStart[0]][prevStart[1]] = oldNode
    return newGrid;
  }

  const getNewGridWithFinish = (grid, row, col, prevFinish) => {

    const newGrid = grid.slice();
    const newFinish = newGrid[row][col];
    const oldFinish = newGrid[prevFinish[0]][prevFinish[1]]
    const oldNode = {
      ...oldFinish,
      isFinish: !oldFinish.isFinish
    }
    const newNode = {
      ...newFinish,
      isFinish: !newFinish.isFinish,
      isWall: false
    };
    newGrid[row][col] = newNode;
    newGrid[prevFinish[0]][prevFinish[1]] = oldNode
    return newGrid;
  }

  const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice()
    const node = newGrid[row][col]
    var newNode = {...node}
    newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid
  };

  const getNewGridWithStopToggled = (grid, row, col, prevStop) => {

    const newGrid = grid.slice()
    const newStop = newGrid[row][col]
    if(prevStop.length === 0){
      const newNode = {
        ...newStop,
        isStop: !newStop.isStop,
        isWall: false
      };
      newGrid[row][col] = newNode
      return newGrid
    }
    const oldStop = newGrid[prevStop[0]][prevStop[1]]
    const oldNode = {
      ...oldStop,
      isStop: !oldStop.isStop
    }
    const newNode = {
      ...newStop,
      isStop: !newStop.isStop,
      isWall: false
    };
    newGrid[row][col] = newNode;
    newGrid[prevStop[0]][prevStop[1]] = oldNode
    return newGrid;
  };

  const getGridWithoutPath = (grid, minorReset=false) => {
    let newGrid = grid.slice();
    for (let row of grid) {
      for (let node of row) {
        var wall = false
        var stop = false
        if(minorReset){
          if(grid[node.row][node.col].isWall) wall = true

          if(grid[node.row][node.col].isStop) stop = true
        }
        let newNode = {
          ...node,
          distance: Infinity,
          distanceSecond: Infinity,
          totalDistance: Infinity,
          isVisited: false,
          isVisitedSecond: false,
          isShortest: false,
          previousNode: null,
          isWall: wall,
          isWeight: false,
          isStop: stop
        };
        newGrid[node.row][node.col] = newNode;
      }
    }
    return newGrid;
  };

  function getNodesInShortestPathOrderBidirectionalGreedySearch(
    nodeA,
    nodeB,
    second=false
  ) {
    let nodesInShortestPathOrder = []
    let currentNode = nodeB
    while (currentNode !== null) {
      nodesInShortestPathOrder.push(currentNode)
      if(second){
        currentNode = currentNode.previousNodeSecond
      } else {
        currentNode = currentNode.previousNode
      }
    }
    currentNode = nodeA
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode)
      if(second){
        currentNode = currentNode.previousNodeSecond
      } else {
        currentNode = currentNode.previousNode
      }
    }
    return nodesInShortestPathOrder
  }