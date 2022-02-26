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
            jokes: []
        }
        this.add_jokes = this.add_jokes.bind(this);
        this.VoteUp = this.VoteUp.bind(this);
        this.VoteDown = this.VoteDown.bind(this);
    }

    async add_jokes() {
        let new_jokes = [];
        for (let i=0;i<this.props.NewJokesNumber;i++) {
            let res = await axios.get("https://icanhazdadjoke.com/", 
            {headers:{Accept:"application/json"}});
            new_jokes.push({
                joke: res.data.joke,
                id:res.data.id, 
                UpScore:0,
                DownScore: 0,
                score:0,
                rating: 1
            });
        }
        this.setState(currState => (
            { jokes: [...currState.jokes, ...new_jokes]}
        ));
    }

    async componentDidMount(){
        this.add_jokes();
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
        })
    }

    render() {
        return (
            <div className="Feed">
                <div className="Feed-Sidebar">
                    <h2 className='Feed-Sidebar-Title'> <strong>Dad</strong> Jokes</h2>
                    <img className="Feed-Emote" src={laughing} alt="rofl-emoji"/>
                    <div>
                    <button className="Feed-Btn" onClick={this.add_jokes}>Add Jokes </button>
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