import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import fn from "./utils/functions";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it("remove registros duplicados de um vetor de objetos conforme o atributo informado", () => {
  const data = [{ id: 1 }, { id: 2 }, { id: 1 }, { id: 3 }, { id: 3 }];
  const attribute = "id";

  expect(fn.getUnique(data, attribute)).toEqual([
    { id: 1 },
    { id: 2 },
    { id: 3 }
  ]);
});

it("remove acentos de uma string", () => {
  const data = "ÁéÃõÔôÇçÀà";
  expect(fn.removeAccents(data)).toEqual("AeAoOoCcAa");
});

it("ordena um vetor de objetos conforme o atributo informado", () => {
  const data = [
    { name: "de" },
    { name: "bc" },
    { name: "a" },
    { name: "cd" },
    { name: "ab" }
  ];
  const attribute = "name";

  expect(fn.sort(data, attribute)).toEqual([
    { name: "a" },
    { name: "ab" },
    { name: "bc" },
    { name: "cd" },
    { name: "de" }
  ]);
});

describe("filtra um vetor de objetos conforme o termo pesquisado", () => {
  const data = [
    { name: "de" },
    { name: "bc" },
    { name: "a" },
    { name: "cd" },
    { name: "ab" }
  ];
  const attribute = "name";

  it("termo 'a'", () => {
    let q = "a";
    expect(fn.filter(q, data, attribute)).toEqual([
      { name: "a" },
      { name: "ab" }
    ]);
  });

  it("termo 'bc'", () => {
    let q = "bc";
    expect(fn.filter(q, data, attribute)).toEqual([{ name: "bc" }]);
  });

  it("termo 'fg'", () => {
    let q = "fg";
    expect(fn.filter(q, data, attribute)).toEqual([]);
  });
});
