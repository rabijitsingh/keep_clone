import React, {Component} from 'react';
import keyboardWrite from '../inputMethods/keyboardWrite.png';
import './Write.css';

export default class WriteByHand extends Component
{

    constructor(props)
    {
        super(props);
        this.canvas = React.createRef();
        this.color = this.color.bind(this);
        this.draw = this.draw.bind(this);
        this.findxy = this.findxy.bind(this);
        this.addNote = this.addNote.bind(this);
        this.state = {
            flag: false,
            ctx: '',
            prevX: 0,
            prevY: 0,
            currX: 0,
            currY: 0,
            x: "black",
            y: 2
        };
    }
    addNote(e)
    {
        this.props.addNote(e);
        //Resetting the canvas container.
        let myCanvas = e.target.parentNode.parentNode;
        for(let i = 0; i < 6; i++)
           myCanvas = myCanvas.previousSibling;
        this.state.ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
    }
    // Function to change the color of pencil
    color(obj) {
        this.setState({x: obj.target.value});
        if (obj.target.id === "white")
            this.setState({y: 14, x: "white"});
        else 
            this.setState({y: 2});
    }
    // Function to find the current co-ordinates of mouse and depending on the event taking appropriate action.
    findxy(res, e) 
    {
        if (res === 'down') {
            this.setState({prevX: this.state.currX,
                prevY: this.state.currY, 
                currX: e.clientX - this.canvas.current.offsetLeft,
                currY: e.clientY - this.canvas.current.offsetTop,
                flag: true
            });
            this.state.ctx.beginPath();
            this.state.ctx.strokeStyle = this.state.x;
            this.state.ctx.rect(this.state.currX, this.state.currY, this.state.y-1, this.state.y-1);
            this.state.ctx.stroke();
        }
        if (res === 'up' || res === "out"){
            this.setState({flag: false});
        }
        if (res === 'move') {
            if (this.state.flag) {
                this.setState({prevX: this.state.currX, 
                    prevY: this.state.currY, 
                    currX: e.clientX - this.canvas.current.offsetLeft,
                    currY: e.clientY - this.canvas.current.offsetTop
                });
                this.draw();
            }
        }
    }
    // Initializing the canvas to draw on it.
    componentDidMount() 
    {
        this.state.ctx = this.canvas.current.getContext("2d");
        var newObj = this;
        this.canvas.current.addEventListener("mousemove", function (e) {
            newObj.findxy('move', e);
        }, false);
        this.canvas.current.addEventListener("mousedown", function (e) {
            newObj.findxy('down', e);
        }, false);
        this.canvas.current.addEventListener("mouseup", function (e) {
            newObj.findxy('up', e);
        }, false);
        this.canvas.current.addEventListener("mouseout", function (e) {
            newObj.findxy('out', e);
        }, false);
    }

    // Function to actually draw the characters on the canvas container.
    draw() {
        this.state.ctx.beginPath();
        this.state.ctx.moveTo(this.state.prevX, this.state.prevY);
        this.state.ctx.lineTo(this.state.currX, this.state.currY);
        this.state.ctx.strokeStyle = this.state.x;
        this.state.ctx.lineWidth = this.state.y;
        this.state.ctx.stroke();
        this.setState({ctx: this.state.ctx});
    }

    render()
    {
        return (<div className="form-group fcontrol">
             <a href="#" className="option noteb" onClick={this.props.changeMode}><img width="30" height="20" title="Write By Hand" src={keyboardWrite} alt="Write By Hand"/></a>
            <label htmlFor="exampleFormControlTextarea1">Description</label>
            <canvas id="can" ref = {this.canvas} className="canvas" width="250%" name="newNoteData" onMouseUp={this.props.onChange} onMouseOut={this.props.onChange}>
            Your browser doesn't support canvas.
            </canvas>
            <div className="elements">
            <div className="color"> 
            <div className="ChooseColor">Choose Color</div>
            <input type="color" className="ColorInput" onChange={this.color}/>
            </div>
            <div className="eraser"> 
            <div className="Eraser">Eraser</div>
            <div className="EraserIcon" id="white" onClick={this.color}></div>
            </div>
            </div>
            <button onClick={this.addNote} type="submit" className="btn btn-block ">Add Note</button>
        </div>);
    }
}