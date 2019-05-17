// Função que remove registros duplicados de um vetor de objetos conforme o atributo informado
const getUnique = (arr, comp) => {
  const unique = arr
    .map(e => e[comp])

    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the dead keys & store unique objects
    .filter(e => arr[e])
    .map(e => arr[e]);

  return unique;
};

// Função que remove acentos de uma string
const removeAccents = s => {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f|\u00b4|\u0060|\u005e|\u007e]/g, "");
};

// Função que ordena um vetor de objetos conforme o atributo informado
const sort = (arr, attribute) => {
  return arr.sort((a, b) => {
    let c = removeAccents(a[attribute]).toLowerCase();
    let d = removeAccents(b[attribute]).toLowerCase();
    if (c < d) return -1;
    if (c > d) return 1;
    return 0;
  });
};

// Função que filtra um vetor de objetos conforme o termo pesquisado
const filter = (q, arr, attribute) => {
  q = removeAccents(q).toLowerCase();

  return arr.filter(
    item =>
      removeAccents(item[attribute])
        .toLowerCase()
        .indexOf(q) != -1
  );
};

export default { getUnique, removeAccents, sort, filter };
