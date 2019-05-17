import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import styles from "./Home.module.scss";

import API from "./../../providers/playlistator.providers";

export function HomePage(props) {
  const [playlists, setPlaylists] = useState();
  const [feedback, setFeedback] = useState("Carregando playlists..."); // Feedback ao usuário

  useEffect(() => {
    getPlaylists(); // Ao montar o componente, buscar a lista de playlists
  }, []);

  // Método para consumir a lista de playlists da API em formato JSON
  function getPlaylists() {
    new API()
      .getPlaylists()
      .then(function(response) {
        if (response.ok) {
          var contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json().then(function(json) {
              setPlaylists(json.playlists); // Carrega a lista de playlists
            });
          } else {
            setFeedback(`Formato inválido na resposta da requisição :(`);
          }
        } else {
          setFeedback(`Erro na resposta da requisição :(`);
        }
      })
      .catch(function(error) {
        setFeedback(`Erro ao tentar processar a requisição :(`); // Erro na requisição. Exemplo: Falta de um cabeçalho de autorização.
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

export default HomePage;
