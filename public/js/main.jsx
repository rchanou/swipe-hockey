/** @jsx React.DOM */


var socket = io.connect();

var Game = React.createClass({
  getDefaultProps: function(){
    return {
      size: 1000,
      max: 20,
	    mod: 100,
      rad: 100
    };
  },
  getInitialState: function(){
    return {
      id: Math.random(),
      side: 'bottom',
      x: 200,
      y: 200,
      vel: {
        x: 5,
        y: 5
      }
    };
  },
  render: function(){
    return <svg width={this.props.size} height={this.props.size} fill='white' ref='field'>
			<circle cx={this.state.x} cy={this.state.y} r={this.props.rad} ref='ball'/>
		</svg>;
  },
  componentDidMount: function(){
    socket.emit('hi', this.state.id);
    socket.on('need start', function(id){
      if (id != this.state.id){
        socket.emit('jumpstart', {id: this.state.id, state: this.state });
      }
    }.bind(this));
    socket.on('give start', function(start){
      if (start.id != this.state.id){
        this.state = start.state;
      }
    }.bind(this));

    socket.on('ball', function(data){
  		this.state = data;
  	}.bind(this));
  
    var ham = new Hammer(this.refs.ball.getDOMNode());
    ham.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

    ham.on('swipe', function(e){
      this.state.vel.x = e.deltaX/this.props.mod;
      this.state.vel.y = e.deltaY/this.props.mod;
	    socket.emit('ball', this.state);
    }.bind(this));
    
    this.updateState();
  },
  componentDidUpdate: function(){
    this.updateState();
  },
  updateState: function(){
    this.state.x += this.state.vel.x;
    this.state.y += this.state.vel.y;
    
    if (this.state.x <=0 || this.state.x >= this.props.size){
      this.state.vel.x = -this.state.vel.x;
    }
    if (this.state.y <=0 || this.state.y >= this.props.size){
      this.state.vel.y = -this.state.vel.y;
    }

    //var w = this.refs.field.getDOMNode().offsetWidth;
    //var h = window.innerHeight;
    //this.state.x = (this.state.x + w) % w;
    //this.state.y = (this.state.y + h) % h; 
    
    setTimeout(function(){
        this.forceUpdate();
    }.bind(this),16);
  }
});

React.renderComponent(<Game />, document.getElementById('main'));