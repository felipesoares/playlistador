import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

import styles from "./Playlist.module.scss";

import API from "./../../providers/playlistator.providers";

export function PlaylistPage(props) {
  const playlistID = props.match.params.id; // ID da playlist na URL

  const [orderBy, setOrderBy] = useState(0); // Ordenação padrão por 'Música'
  const [openDropDown, setOpenDropDown] = useState(false);

  const [filter, setFilter] = useState(""); // Termo da busca

  const ordenacao = {
    0: { alias: "name", description: "Música" },
    1: { alias: "artist", description: "Artista" },
    2: { alias: "duration", description: "Duração" }
  }; // Opções de ordenação

  const [playlistName, setPlaylistName] = useState(""); // Título da playlist
  const [playlistThumb, setPlaylistThumb] = useState(""); // Thumb da playlist

  const [songs, setSongs] = useState(); // Lista das músicas (imutável)
  const [results, setResults] = useState(); // Lista das músicas a serem exibidas nos resultados (mutável)

  const [feedback, setFeedback] = useState("Carregando músicas..."); // Feedback ao usuário

  useEffect(() => {
    getPlaylists(); // Ao montar o componente, buscar a lista de músicas
  }, []);

  // Método para consumir a lista de músicas da API em formato JSON
  function getPlaylists() {
    new API()
      .getPlaylist(playlistID)
      .then(function(response) {
        if (response.ok) {
          var contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json().then(function(json) {
              setPlaylistName(json.playlist.name); // Título da playlist
              setPlaylistThumb(json.playlist.thumb); // Thumb da playlist
              // setSongs(json.playlist.songs);
              // setResults(json.playlist.songs);
              orderList(orderBy, getUnique(json.playlist.songs, "id")); // Garante a remoção de registros repetidos da requisição e ordena a playlist pela ordem padrão
              setFeedback("Nenhum resultado encontrado."); // Muda o feedback padrão para o usuário quando o filtro não retorna dados
            });
          } else {
            setFeedback(`Formato inválido na resposta da requisição :(`);
          }
        } else {
          setFeedback(`Bad request :(`); // Erro na requisição. Exemplo: ID inexistente.
        }
      })
      .catch(function(error) {
        setFeedback(`Erro ao tentar processar a requisição :(`); // Erro na requisição. Exemplo: Falta de autenticação.
      });
  }

  // Função que remove registros repetidos de um vetor de objetos
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

  // Função que remove acentos de uma string
  function removerAcentos(s) {
    return s
      .normalize("NFD")
      .replace(/[\u0300-\u036f|\u00b4|\u0060|\u005e|\u007e]/g, "");
  }

  // Função complementar que ordena o vetor de músicas de acordo com a ordem selecionada
  function sort(arr, key) {
    return arr.sort((a, b) => {
      let c = removerAcentos(a[ordenacao[key].alias]).toLowerCase();
      let d = removerAcentos(b[ordenacao[key].alias]).toLowerCase();
      if (c < d) return -1;
      if (c > d) return 1;
      return 0;
    });
  }

  // Função que ordena o vetor de músicas com ou sem filtro aplicado
  function orderList(key, list) {
    setOrderBy(parseInt(key)); // Atualiza a opção de ordenação

    let arr = Object.assign([], list);

    if (filter) {
      setResults(sort(Object.assign([], results), key));
    } else {
      setResults(sort(arr, key));
    }
    setSongs(sort(arr, key));
  }

  // Função que filtra o vetor de músicas de acordo com o termo pesquisado
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
          <label
            className={styles.label}
            onClick={() => setOpenDropDown(!openDropDown)}
          >
            Ordenar por
          </label>
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
                      setOpenDropDown(!openDropDown); // Abre ou fecha o menu dropDown
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
            autoComplete="off"
            autoFocus={true}
            onChange={event => {
              setFilter(event.target.value);
              if (event.target.value) {
                if (results) setResults(filterList(event.target.value, songs)); // filtra as músicas
              } else setResults(sort(Object.assign([], songs), orderBy)); // limpa o filtro
            }}
            className={styles.filter}
          />
        </div>
      </div>

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
