import React, { Component } from 'react';
import axios from 'axios';
import Joke from './Joke';
import "./Feed.css";
import laughing from "./laughing.png";

class Feed extends Component {
    static defaultProps = {
        NewJokesNumber : 5
    }
    constructor(props) {
        super(props);
        this.state = {
            jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
            loading: false
        };
        this.seenJokes = new Set(this.state.jokes.map(j => j.joke));
        this.add_jokes = this.add_jokes.bind(this);
        this.getNewJokes = this.getNewJokes.bind(this);
        this.VoteUp = this.VoteUp.bind(this);
        this.VoteDown = this.VoteDown.bind(this);
    }

    async add_jokes() {
        try {
            let new_jokes = [];
        while(new_jokes.length < this.props.NewJokesNumber) {
            let res = await axios.get("https://icanhazdadjoke.com/", 
            {headers:{Accept:"application/json"}});
            if(!this.seenJokes.has(res.data.joke)) {
                new_jokes.push({
                    joke: res.data.joke,
                    id:res.data.id, 
                    UpScore:0,
                    DownScore: 0,
                    score:0,
                    rating: 1
                });
                this.seenJokes = new Set(this.state.jokes.map(j => j.joke));
            }
            else {
                console.log("Found a duplicate Joke... ");
                console.log(res.data.joke);
            }   
        }
        this.setState(currState => (
            { jokes: [...currState.jokes, ...new_jokes], loading:false}
        ),
        () => {
            window.localStorage.setItem("jokes",JSON.stringify(this.state.jokes));
        });
        } catch(e) {
            alert(e);
            this.setState({loading: false});
        }
        
    }

    getNewJokes() {
        this.setState({loading:true},this.add_jokes);
    }

    componentDidMount(){
        if (this.state.jokes.length === 0) 
            this.getNewJokes();
    }

    VoteUp(id) {
        this.setState(currState => {
            let modified_jokes = currState.jokes.map(joke => {
                let modified_joke = joke;
                if (joke.id === id ) {
                    joke.UpScore = joke.UpScore + 1;
                    joke.score = joke.score + 1;
                    joke.rating = (joke.UpScore)/(joke.DownScore+1);
                }
                return modified_joke;
            })
            return {jokes: modified_jokes};
        },
        () => {
            window.localStorage.setItem("jokes",JSON.stringify(this.state.jokes));
        })
    }

    VoteDown(id) {
        this.setState(currState => {
            let modified_jokes = currState.jokes.map(joke => {
                let modified_joke = joke;
                if (joke.id === id ) {
                    joke.DownScore = joke.DownScore + 1;
                    joke.score = joke.score - 1;
                    joke.rating = (joke.UpScore)/(joke.DownScore+1);
                }
                return modified_joke;
            })
            return {jokes: modified_jokes};
        },
        () => {
            window.localStorage.setItem("jokes",JSON.stringify(this.state.jokes));
        })
    }

    render() {
        if (this.state.loading === true) {
            return (
                <div>
                    <i className = "loading-emoji far fa-smile fa-spin"></i>
                    <h3> Loading jokes ...</h3>
                </div>
            )
        }
        return (
            <div className="Feed">
                <div className="Feed-Sidebar">
                    <h2 className='Feed-Sidebar-Title'> <strong>Dad</strong> Jokes</h2>
                    <img className="Feed-Emote" src={laughing} alt="rofl-emoji"/>
                    <div>
                    <button className="Feed-Btn" onClick={this.getNewJokes}>Add Jokes </button>
                    </div>
                </div>
                
                <div className="Feed-Joke-List">
                        {this.state.jokes.map(joke => (
                            <Joke 
                                joke={joke.joke} 
                                id={joke.id} 
                                key={joke.id} 
                                score={joke.score}
                                rating={joke.rating}
                                VoteUp = {this.VoteUp}
                                VoteDown = {this.VoteDown}
                                UpScore = {joke.UpScore}
                                DownScore = {joke.DownScore}
                            />
                        ))}
                </div>
            </div>
        )
    }
}

export default Feed;