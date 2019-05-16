import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import styles from "./Playlist.module.scss";

import API from "./../../providers/playlistador.providers";

export function PlaylistPage(props) {
  const { name } = props;
  const playlistID = props.match.params.id;

  const [orderBy, setOrderBy] = useState(0); // Música
  const [openDropDown, setOpenDropDown] = useState(false);

  const [filter, setFilter] = useState("");

  const ordenacao = {
    0: { alias: "name", description: "Música" },
    1: { alias: "artist", description: "Artista" },
    2: { alias: "duration", description: "Duração" }
  };

  const [songs, setSongs] = useState();
  const [results, setResults] = useState();
  const [feedback, setFeedback] = useState("Carregando músicas...");

  const [playlistName, setPlaylistName] = useState("");
  const [playlistThumb, setPlaylistThumb] = useState("");

  useEffect(() => {
    getPlaylists();
  }, []);

  function getPlaylists() {
    new API()
      .getPlaylist(playlistID)
      .then(function(response) {
        if (response.ok) {
          var contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json().then(function(json) {
              setPlaylistName(json.playlist.name);
              setPlaylistThumb(json.playlist.thumb);
              // setSongs(json.playlist.songs);
              // setResults(json.playlist.songs);
              orderList(orderBy, getUnique(json.playlist.songs, "id"));
              setFeedback("Nenhum resultado encontrado.");
            });
          } else {
            setFeedback(`Formato inválido na resposta da requisição :(`);
          }
        } else {
          setFeedback(`Bad request :(`);
        }
      })
      .catch(function(error) {
        setFeedback(`Erro ao tentar processar a requisição :(`);
      });
  }

  function getUnique(arr, comp) {
    const unique = arr
      .map(e => e[comp])

      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the dead keys & store unique objects
      .filter(e => arr[e])
      .map(e => arr[e]);

    return unique;
  }

  function removerAcentos(s) {
    return s
      .normalize("NFD")
      .replace(/[\u0300-\u036f|\u00b4|\u0060|\u005e|\u007e]/g, "");
  }

  function sort(arr, key) {
    return arr.sort((a, b) => {
      let c = removerAcentos(a[ordenacao[key].alias]).toLowerCase();
      let d = removerAcentos(b[ordenacao[key].alias]).toLowerCase();
      if (c < d) return -1;
      if (c > d) return 1;
      return 0;
    });
  }

  function orderList(key, list) {
    setOrderBy(parseInt(key));

    let arr = Object.assign([], list);

    if (filter) {
      setResults(sort(Object.assign([], results), key));
    } else {
      setResults(sort(arr, key));
    }
    setSongs(sort(arr, key));
  }

  function filterList(q, list) {
    q = removerAcentos(q);
    function escapeRegExp(s) {
      return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    }
    const words = q
      .split(/\s+/g)
      .map(s => s.trim())
      .filter(s => !!s);
    const hasTrailingSpace = q.endsWith(" ");
    const searchRegex = new RegExp(
      words
        .map((word, i) => {
          if (i + 1 === words.length && !hasTrailingSpace) {
            // The last word - ok with the word being "startswith"-like
            return `(?=.*\\b${escapeRegExp(word)})`;
          } else {
            // Not the last word - expect the whole word exactly
            return `(?=.*\\b${escapeRegExp(word)}\\b)`;
          }
        })
        .join("") + ".+",
      "gi"
    );
    return list.filter(item => {
      return searchRegex.test(removerAcentos(item.name)); // + " " + item.artist
    });
  }

  return (
    <main className={"main " + styles.playlist}>
      <Helmet>
        <title>{playlistName}</title>
      </Helmet>
      <div className={styles.head}>
        <div className="clearfix">
          <img
            src={playlistThumb}
            alt={playlistName}
            className={styles.thumb}
          />
          <h1 className={styles.title}>{playlistName}</h1>
        </div>
        <div className={"clearfix " + styles.bar}>
          <label className={styles.label}>Ordenar por</label>
          <ul className={styles.select}>
            {/* onMouseLeave={() => setOpenDropDown(false)} */}
            <li>
              <span onClick={() => setOpenDropDown(!openDropDown)}>
                {ordenacao[orderBy].description}
              </span>
              <ul className={openDropDown ? styles.activate : ""}>
                {Object.keys(ordenacao).map(key => (
                  <li
                    key={key}
                    onClick={() => {
                      if (orderBy != parseInt(key)) orderList(key, songs);
                      setOpenDropDown(!openDropDown);
                    }}
                  >
                    {ordenacao[key].description}
                  </li>
                ))}
              </ul>
            </li>
          </ul>
          <input
            type="search"
            placeholder="Filtrar música"
            // value={filter}
            // onChange={event => setFilter(event.target.value)}
            onChange={event => {
              setFilter(event.target.value);
              if (event.target.value) {
                if (results) setResults(filterList(event.target.value, songs));
              } else setResults(sort(Object.assign([], songs), orderBy));
            }}
            className={styles.filter}
          />
        </div>
      </div>
      {/* <Link to="/" title="Playlistador">Home</Link> */}

      <div className={styles.results}>
        <ul className={styles.itens}>
          {results && results.length ? (
            results.map((song, index) => (
              <li key={song.id} className={styles.item}>
                <div className={styles.gridContainer}>
                  <div className={styles.gridItem}>
                    <span className={styles.index}>
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div className={styles.gridItem + " " + styles.subGrid}>
                    <span className={styles.name}>{song.name}</span>
                    <span className={styles.artist}>{song.artist}</span>
                  </div>
                  <div className={styles.gridItem + " " + styles.duration}>
                    <span>{song.duration}</span>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className={styles.item}>{feedback}</li>
          )}
        </ul>
      </div>
    </main>
  );
}
export default PlaylistPage;