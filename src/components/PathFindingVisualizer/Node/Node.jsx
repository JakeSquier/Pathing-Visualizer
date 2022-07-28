import React, {Component} from 'react';
import './Node.css'

class Node extends Component {

    render() {
        const {
          col,
          isFinish,
          isStart,
          isVisited,
          isVisitedSecond,
          isWall,
          isWeight,
          isStop,
          onMouseDown,
          onMouseEnter,
          onMouseUp,
          row,
          distance,
          distanceSecond
        } = this.props;
        const extraClassName = 
          isFinish
          ? 'node-finish'
          : isStart
          ? 'node-start'
          : isStop
          ? 'node-stop'
          : isWall
          ? 'node-wall'
          : ''
    
        return (
          <div
            id={`node-${row}-${col}`}
            className={`node node-gap-vert node-gap-horiz ${extraClassName}`}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={(e) => {
              
              onMouseEnter(row, col)
            }}
            onMouseUp={() => onMouseUp()}>
          </div>
        );
      }
}

export default Node;