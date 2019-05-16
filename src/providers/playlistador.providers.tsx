export default class API {
  configInit: any;
  url: string = "http://192.168.0.14:3001";

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
    return fetch(`${this.url}/playlists`, this.configInit);
  }

  getPlaylist(playlist: number): Promise<Response> {
    return fetch(`${this.url}/playlist/${playlist}`, this.configInit);
  }
}
