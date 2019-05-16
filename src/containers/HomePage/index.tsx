import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

// import PropTypes from "prop-types";
// import classNames from "classnames";

import styles from "./Home.module.scss";
// import thumb from "./../../images/thumb.jpg";

import API from "./../../providers/playlistador.providers";

export function HomePage(props) {
  // const { name } = props;

  const [playlists, setPlaylists] = useState();
  const [feedback, setFeedback] = useState("Carregando playlists...");

  useEffect(() => {
    getPlaylists();
  }, []);

  function getPlaylists() {
    new API()
      .getPlaylists()
      .then(function(response) {
        if (response.ok) {
          var contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json().then(function(json) {
              setPlaylists(json.playlists);
            });
          } else {
            setFeedback(`Formato inválido na resposta da requisição :(`);
          }
        } else {
          setFeedback(`Erro na resposta da requisição :(`);
        }
      })
      .catch(function(error) {
        setFeedback(`Erro ao tentar processar a requisição :(`);
      });
  }

  return (
    <main className={"main " + styles.home}>
      <Helmet>
        <title>Todas as playlists</title>
      </Helmet>
      <h1 className={styles.title}>Todas as playlists</h1>

      <div className={styles.playlists}>
        <ul className={styles.itens}>
          {playlists && playlists.length ? (
            playlists.map(playlist => (
              <li key={playlist.id} className={styles.item}>
                <Link to={"/playlist/" + playlist.id} title={playlist.name}>
                  <div className={styles.thumb}>
                    <img src={playlist.thumb} alt={playlist.name} />
                  </div>
                  <div className={styles.text}>
                    <span className={styles.name}>{playlist.name}</span>
                    <span className={styles.description}>
                      {playlist.description}
                    </span>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li>{feedback}</li>
          )}
        </ul>
      </div>
    </main>
  );
}

// HomePage.propTypes = {
//   foo: PropTypes.string
// };

export default HomePage;
