import React, {Component} from 'react';
import algData from '../../data/alg-data'
import './nav.css'
import Start from '../../media/right-arrow.png'
import Finish from '../../media/dart-board.png'
import Stop from '../../media/stop.png'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';


export default class Navbar extends Component {

    useStyles = makeStyles(theme => ({
        customHoverFocus: {
          "&:hover, &.Mui-focusVisible": { backgroundColor: "yellow" }
        }
    }));    

    getWaves = () => {
        var wave, currItemPic, currBtnColor;
        var currItem = this.props.state.currItemDesc
        if(currItem === 'Start'){
            wave = 'start-item-back'
            currItemPic = <img className='item-picture start-picture' style={{height: '40px', width: '40px'}} src={Start}/>
            currBtnColor = 'active-start'
            return [wave, currItemPic, currBtnColor]
        } else if(currItem === 'Target'){
            wave = 'target-item-back'
            currItemPic = <img className='item-picture target-picture' style={{height: '40px', width: '40px'}} src={Finish} />
            currBtnColor = 'active-target'
            return [wave, currItemPic, currBtnColor]
        } else if(currItem === 'Wall'){
            wave = 'wall-item-back'
            currItemPic = <div className='wall-picture'></div>
            currBtnColor = 'active-wall'
            return [wave, currItemPic, currBtnColor]
        } else if(currItem === 'Stop'){
            wave = 'stop-item-back'
            currItemPic = <img className='item-picture stop-picture' style={{height: '45px', width: '45px'}} src={Stop} />
            currBtnColor = 'active-stop'
            return [wave, currItemPic, currBtnColor]
        }
    }
    render(){
        const info = this.getWaves()
        const wave = info[0]
        const currItemPic = info[1]
        const currBtnColor = info[2]
        const showNav = this.props.state.showNav
        const items = ['Start', 'Target', 'Wall', 'Stop']
        const mazeAlgs = ['Recursive Division Maze', 'Vertical Division Maze', 'Horizontal Divsion Maze', 'Random Maze']
        const currItem = this.props.state.currItemObj
        const currAlg = this.props.state.currAlgObj
        

        return(
            <div className={`nav-bar nav-${showNav ? 'active' : 'inactive'}`}>
                <div className='nav-toggle-container'>
                    <IconButton className="nav-btn" onClick={this.props.toggleNav}>
                        {this.props.state.showNav ? <ArrowCircleDownIcon /> : <ArrowCircleUpIcon />}
                    </IconButton>
                </div>
                <div className="algs-container">
                    <div className="alg-selector">
                        <Tabs
                            orientation="vertical"
                            TabIndicatorProps={{style: {background:'rgb(100, 255, 218)'}}}
                            value={this.props.state.currAlgTab}
                            onChange={this.props.handleTabs}
                            variant="scrollable"
                            
                        >
                            {algData.map((alg, val) => {
                                return <Tab className="alg-tab" label={<span className="alg-tab-text">{`${alg.name}`}</span>} value={val} />
                            })}
                        </Tabs>
                    </div>
                    <div className='alg-card'>
                        <div className='alg-card-glass'>
                            <h2 className="alg-card-title">{currAlg.name}</h2>
                            <div className="alg-card-text-container">
                                <p className="alg-card-desc">{currAlg.description}</p>
                            </div>
                            <div className="play-btn-container">
                                <IconButton onClick={this.props.play}>
                                    <PlayCircleFilledIcon className="play-btn" size="10em" fontSize="inherit"/>
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="middle-container">
                    <div className='speed-container'>
                        <IconButton onClick={(e) => {this.props.handleSpeedChange(e, true)}}>
                            <RemoveIcon className='subtract-btn'/>
                        </IconButton>
                        <p className='speed-text'>{this.props.state.animationSpeed}</p>
                        <IconButton onClick={(e) => {this.props.handleSpeedChange(e, false)}}>
                            <AddIcon className='add-btn'/>
                        </IconButton>
                    </div>
                    <Button className="maze-btn" onClick={this.props.genMaze} variant="contained" fullWidth={true} color="primary">
                        <Typography className="maze-btn-text" >
                            Generate
                        </Typography>
                    </Button>
                    <div className="maze-selector">
                        <Tabs
                            orientation="vertical"
                            TabIndicatorProps={{style: {background: 'rgb(100, 255, 218)'}}}
                            value={this.props.state.currMazeTab}
                            onChange={this.props.handleMazeTabs}
                            variant="scrollable"
                            
                        >
                            {mazeAlgs.map((title, val) => {
                                return <Tab className="alg-tab" label={<span className="alg-tab-text">{`${title}`}</span>} value={val} />
                            })}
                        </Tabs>
                    </div>
                </div>
                <div className="items-container">
                    <div className={`item-card ${wave}`}>
                        <div className="items-selector">
                            {items.map((item, i) => {
                                const isCurrItem = this.props.state.currItemDesc === item
                                return (
                                    <a className={`item-btn item-btn-${isCurrItem ? `${currBtnColor}` : 'inactive'} ${i===0 ? 'first-btn' : ''} ${i===(items.length-1) ? 'last-btn' : ''}`} id={`${item}-btn`}
                                    onClick={(e) => {this.props.handleItemChange(e, item)}}>
                                        <p className="item-btn-text">{item}</p>
                                    </a>
                                );
                            })}
                        </div>
                        <h2 className="item-title">{currItem.title}</h2>
                        <div className="description-box">
                            <p className="item-description">{currItem.description}</p>
                        </div>
                        {currItemPic}
                    </div>
                </div>
            </div>
        )
    }
}