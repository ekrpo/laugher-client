import Joke from "../Joke/Joke";
import "./joke_container.scss";

function JokeContainer({ socket, setTab, jokeList, setJokes }) {
  const jokes = jokeList || [];

  return (
    <div id="joke-container">
      {jokes.length === 0 ? (
        "No results, please follow someone or post your joke :D"
      ) : (
        jokes.map((joke) => {

          return (
            <Joke
              setTab={setTab}
              key={joke.id}
              joke={joke}
              setJokes={setJokes}
              jokes={jokes}
              socket={socket}
            />
          );
        })
      )}
    </div>
  );
}

export default JokeContainer;
