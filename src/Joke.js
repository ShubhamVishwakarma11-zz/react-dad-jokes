import React, { Component } from 'react';
import "./Joke.css";

class Joke extends Component {
    constructor(props) {
        super(props);
        this.handleVoteUp = this.handleVoteUp.bind(this);
        this.handleVoteDown = this.handleVoteDown.bind(this);
    }

    handleVoteUp() {
        this.props.VoteUp(this.props.id);
    }

    handleVoteDown() {
        this.props.VoteDown(this.props.id);
    }

    render() {
        let scoreClass="Score";

        let emojis = [
            <i className="emoji em em-no_mouth" aria-label="FACE WITHOUT MOUTH"></i>,
            <i className="emoji em em-rolling_on_the_floor_laughing" aria-label="ROLLING ON THE FLOOR LAUGHING"></i>,
            <i className="emoji em em-laughing" aria-label="SMILING FACE WITH OPEN MOUTH AND TIGHTLY-CLOSED EYES"></i>,
            <i className="emoji em em-smiley" aria-label="SMILING FACE WITH OPEN MOUTH"></i>,
            <i className="emoji em em-expressionless" aria-label="EXPRESSIONLESS FACE"></i>,
            <i className="emoji em em-angry" aria-label="ANGRY FACE"></i>,
        ];

        let emoji_index = 0;
        const rating = this.props.rating;

        if(this.props.UpScore!==0 || this.props.DownScore!==0){
            if (rating>6) {
                emoji_index = 1;
                scoreClass = "Score good-Score";
            }
            else if (rating > 4) {
                emoji_index = 2;
                scoreClass = "Score good-Score"                
            }
            else if (rating > 3) {
                emoji_index = 3;
                scoreClass = "Score";
            }
            else if (rating > 2) {
                emoji_index = 4;
                scoreClass = "Score bad-Score";
            }
            else  {
                emoji_index = 5;
                scoreClass = "Score bad-Score";
            }
        }
        
        


        return (
            <div className="Joke-Container">
                <div className='Joke'>
                    <div className='Score-card'>
                        
                        <i onClick={this.handleVoteDown} className="vote-btn-down fa-solid fa-arrow-down"/>
                        
                        <div className={scoreClass}>
                            {this.props.score}
                        </div>

                        <i onClick={this.handleVoteUp} className="vote-btn-up fa-solid fa-arrow-up"/>
                        
                        
                    </div>
                    
                    <div className="Joke-text">
                        <p> {this.props.joke} </p>
                    </div>
                    <div className="Joke-emoji">
                        {emojis[emoji_index]}
                    </div>

                </div>
                
            </div>
        )
    }
}

export default Joke;