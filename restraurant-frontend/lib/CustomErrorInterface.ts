export default interface Error {
  status: number;
  response: {
    statusText: string;
    data: {
      message: string;
    };
  };
}
