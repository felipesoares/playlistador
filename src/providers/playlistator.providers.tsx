export default class API {
  configInit: any;

  constructor() {
    const authHeader = new Headers();
    const token = "";
    authHeader.append("Authorization", `Bearer ${token}`);
    const configInit: RequestInit = {
      method: "GET",
      headers: authHeader,
      cache: "default"
    };
    this.configInit = configInit;
  }

  getPlaylists(): Promise<Response> {
    return fetch(`${process.env.REACT_APP_API}/playlists`, this.configInit);
  }

  getPlaylist(playlist: number): Promise<Response> {
    return fetch(
      `${process.env.REACT_APP_API}/playlist/${playlist}`,
      this.configInit
    );
  }
}
